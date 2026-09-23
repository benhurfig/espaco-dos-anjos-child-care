#!/usr/bin/env python3
"""Read-only static checks. Run: python3 scripts/validate_site.py [site-directory].
No third-party packages, network calls, submissions or changes to website files.
"""
from __future__ import annotations
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote, urljoin
import json
import sys
import xml.etree.ElementTree as ET

DOMAIN = 'https://www.espacodosanjoschildcare.com'
HOME_SECTIONS = ['home', 'trust-strip', 'monthly-bulletin', 'visual-story', 'programs',
                 'routine', 'learning', 'meals', 'space', 'about', 'google-profile',
                 'nearby-communities', 'tour']
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

class Node:
    def __init__(self, tag: str, attrs=(), parent=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children: list[Node] = []
        self.text = ''
    def has_class(self, name: str) -> bool:
        return name in self.attrs.get('class', '').split()

class Document(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.root = Node('document')
        self.stack = [self.root]
        self.nodes: list[Node] = []
        self.errors: list[str] = []
        self.feed(text)
        if len(self.stack) > 1:
            self.errors.append('Unclosed elements: '+','.join(n.tag for n in self.stack[1:]))
    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.stack[-1])
        self.stack[-1].children.append(node)
        self.nodes.append(node)
        if tag not in VOID: self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID: self.handle_endtag(tag)
    def handle_endtag(self, tag):
        if tag in VOID: return
        if len(self.stack) == 1:
            self.errors.append('Unmatched closing tag: '+tag)
            return
        if self.stack[-1].tag != tag:
            self.errors.append('Mismatched closing tag: '+tag+' after '+self.stack[-1].tag)
            for i in range(len(self.stack)-1, 0, -1):
                if self.stack[i].tag == tag:
                    self.stack = self.stack[:i]
                    return
        else: self.stack.pop()
    def handle_data(self, text):
        for n in self.stack: n.text += text
    def tags(self, name): return [n for n in self.nodes if n.tag == name]
    def ids(self, name): return [n for n in self.nodes if n.attrs.get('id') == name]
    def classes(self, name): return [n for n in self.nodes if n.has_class(name)]
    def links(self, rel): return [n for n in self.tags('link') if rel in n.attrs.get('rel', '').split()]

def main():
    root = Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parents[1]
    issues = []
    pages = {p:Document(p.read_text(encoding='utf-8')) for p in root.rglob('*.html') if 'docs' not in p.relative_to(root).parts}
    def issue(p, text): issues.append(f'{p.relative_to(root)}: {text}')
    def resolve(url, current):
        parsed = urlparse(urljoin(DOMAIN+'/'+str(current.relative_to(root)), url))
        if parsed.netloc not in {urlparse(DOMAIN).netloc, 'espacodosanjoschildcare.com'}: return None, parsed
        target = root / unquote(parsed.path).lstrip('/')
        if target.is_dir(): target = target / 'index.html'
        elif not target.exists() and not target.suffix and target.with_suffix('.html').exists(): target=target.with_suffix('.html')
        return target, parsed
    canonical_pages = {}
    for p,d in pages.items():
        for e in d.errors: issue(p,e)
        for tag in ['html','head','body','main','h1']:
            if len(d.tags(tag)) != 1: issue(p,f'Expected one {tag}, found {len(d.tags(tag))}')
        is_request = p.parent.name == 'family-request'
        required_ids = ['site-header', 'mobile-menu-overlay', 'main-content']
        required_ids += ['family-request-form', 'request-help'] if is_request else ['tour']
        for id_ in required_ids:
            if len(d.ids(id_)) != 1: issue(p,f'Expected one #{id_}')
        if is_request and d.classes('final-tour'):
            issue(p,'Family Request must use the help block, not the enrollment CTA')
        for cls in ['footer','language-selector','floating-booking']:
            if len(d.classes(cls)) != 1: issue(p,f'Expected one .{cls}')
        ids=Counter(n.attrs.get('id') for n in d.nodes if n.attrs.get('id'))
        for id_,count in ids.items():
            if count>1: issue(p,'Duplicate ID '+id_)
        rel=p.relative_to(root).as_posix()
        if rel in ['index.html','pt/index.html','es/index.html']:
            sections=[n.attrs.get('id','trust-strip') for n in d.tags('main')[0].children if n.tag=='section']
            if sections!=HOME_SECTIONS: issue(p,'Home sections differ: '+str(sections))
        title=d.tags('title')
        if len(title)!=1 or not title[0].text.strip(): issue(p,'Missing title')
        descriptions=[n for n in d.tags('meta') if n.attrs.get('name')=='description' and n.attrs.get('content')]
        if len(descriptions)!=1: issue(p,'Missing/duplicate meta description')
        canon=d.links('canonical')
        if len(canon)!=1: issue(p,'Missing/duplicate canonical')
        else:
            url=canon[0].attrs.get('href','')
            if not url.startswith(DOMAIN+'/'): issue(p,'Wrong canonical domain')
            if url in canonical_pages: issue(p,'Duplicate canonical')
            canonical_pages[url]=p
        for n in d.nodes:
            for attr in (['href'] if n.tag in ['a','link','use'] else ['src'] if n.tag in ['img','script','iframe','source'] else []):
                val=n.attrs.get(attr,'')
                if not val or val.startswith(('data:','tel:','sms:','mailto:','javascript:')): continue
                target,u=resolve(val,p)
                if target is None: continue
                if not target.exists(): issue(p,'Missing local target '+val); continue
                if u.fragment and target in pages and not pages[target].ids(unquote(u.fragment)):
                    issue(p,'Missing local anchor '+val)
            if n.tag=='img' and 'alt' not in n.attrs: issue(p,'Image missing alt')
            if n.tag=='script' and n.attrs.get('src','').endswith('family-request-embed.js'):
                if 'family-request' not in rel: issue(p,'Embed script on unrelated page')
        for script in d.tags('script'):
            if script.attrs.get('type')=='application/ld+json':
                try:json.loads(script.text)
                except Exception:issue(p,'Invalid JSON-LD')
        for f in d.tags('iframe'):
            if 'data-family-request-frame' not in f.attrs:continue
            u=urlparse(f.attrs.get('src',''))
            if u.scheme+'://'+u.netloc != 'https://www.smartimateapp.com' or 'company=espaco-dos-anjos-child-care' not in u.query or 'embed=1' not in u.query:
                issue(p,'Wrong SmartMate iframe configuration')
    for p,d in pages.items():
        c=d.links('canonical')
        if not c:continue
        for a in d.links('alternate'):
            lang=a.attrs.get('hreflang');url=a.attrs.get('href')
            if not lang:continue
            if url not in canonical_pages:issue(p,'Missing hreflang destination '+str(url));continue
            if lang=='x-default':continue
            target=pages[canonical_pages[url]]
            if target.tags('html')[0].attrs['lang'].split('-')[0]!=lang:issue(p,'Hreflang language mismatch')
            if not any(x.attrs.get('href')==c[0].attrs['href'] for x in target.links('alternate')):issue(p,'Non-reciprocal hreflang')
    try:
        xml=ET.parse(root/'sitemap.xml')
        sitemap={n.text for n in xml.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
        if sitemap!=set(canonical_pages):issues.append('Sitemap does not match actual canonical pages')
    except Exception as exc:issues.append('Sitemap read failed: '+str(exc))
    report={'html_pages':len(pages),'canonical_pages':len(canonical_pages),'home_sections_expected':len(HOME_SECTIONS),'issues':issues}
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 1 if issues else 0
if __name__=='__main__':sys.exit(main())
