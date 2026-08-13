"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://www.espacodosanjoschildcare.com";

const pages = [
    { file: "index.html", lang: "en", url: `${siteUrl}/` },
    { file: "pt/index.html", lang: "pt-BR", url: `${siteUrl}/pt/` },
    { file: "es/index.html", lang: "es", url: `${siteUrl}/es/` },
    { file: "privacy-policy.html", lang: "en", url: `${siteUrl}/privacy-policy` },
    { file: "terms-of-service.html", lang: "en", url: `${siteUrl}/terms-of-service` }
];

const localizedPages = pages.slice(0, 3);
const hreflangSet = new Map([
    ["en", `${siteUrl}/`],
    ["pt", `${siteUrl}/pt/`],
    ["es", `${siteUrl}/es/`],
    ["x-default", `${siteUrl}/`]
]);

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function firstMatch(source, pattern, label) {
    const match = source.match(pattern);
    assert(match, `Missing ${label}`);
    return match[1];
}

function localAssetReferences(source) {
    const references = [
        ...source.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)(?:[?#][^"]*)?"/g)
    ].map(match => match[1]);

    for (const match of source.matchAll(/srcset="([^"]+)"/g)) {
        for (const candidate of match[1].split(",")) {
            references.push(candidate.trim().split(/\s+/)[0]);
        }
    }

    return references;
}

function validatePage(page) {
    const source = read(page.file);
    const htmlLang = firstMatch(
        source,
        /<html lang="([^"]+)"/,
        `${page.file} html lang`
    );
    const title = firstMatch(
        source,
        /<title>\s*([\s\S]*?)\s*<\/title>/,
        `${page.file} title`
    ).replace(/\s+/g, " ");
    const description = firstMatch(
        source,
        /<meta\s+name="description"\s+content="([^"]+)"/s,
        `${page.file} meta description`
    );
    const canonical = firstMatch(
        source,
        /<link\s+rel="canonical"\s+href="([^"]+)"/s,
        `${page.file} canonical`
    );
    const ogUrl = firstMatch(
        source,
        /<meta\s+property="og:url"\s+content="([^"]+)"/s,
        `${page.file} og:url`
    );

    assert(htmlLang === page.lang, `${page.file}: expected lang ${page.lang}, received ${htmlLang}`);
    assert(title.length >= 30 && title.length <= 60, `${page.file}: title length is ${title.length}`);
    assert(description.length >= 70 && description.length <= 160, `${page.file}: description length is ${description.length}`);
    assert(canonical === page.url, `${page.file}: canonical mismatch`);
    assert(ogUrl === canonical, `${page.file}: og:url must match canonical`);
    assert((source.match(/<h1\b/g) || []).length === 1, `${page.file}: expected exactly one H1`);
    assert(!source.includes("cdnjs.cloudflare.com/ajax/libs/font-awesome"), `${page.file}: Font Awesome must not be loaded`);
    assert(!source.includes('href="/assets/css/style.css'), `${page.file}: production must use the CSS bundle`);
    assert(source.includes("analytics_storage: analyticsConsent"), `${page.file}: missing analytics consent default`);
    assert(source.includes("/assets/js/cookie-consent.js"), `${page.file}: missing cookie consent controller`);
    assert(!source.includes('<script async src="https://www.googletagmanager.com/gtag/js'), `${page.file}: GA must not load before consent`);

    for (const reference of localAssetReferences(source)) {
        assert(
            fs.existsSync(path.join(root, reference)),
            `${page.file}: missing local asset ${reference}`
        );
    }

    const jsonLdBlocks = [
        ...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
    ];
    for (const block of jsonLdBlocks) {
        JSON.parse(block[1]);
    }

    return source;
}

function validateLocalizedPage(page, source) {
    const alternates = new Map(
        [...source.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)]
            .map(match => [match[1], match[2]])
    );

    assert(alternates.size === hreflangSet.size, `${page.file}: incomplete hreflang set`);
    for (const [language, url] of hreflangSet) {
        assert(alternates.get(language) === url, `${page.file}: hreflang ${language} mismatch`);
    }

    const jsonLd = JSON.parse(
        firstMatch(
            source,
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
            `${page.file} JSON-LD`
        )
    );
    const webPage = jsonLd["@graph"].find(item => item["@type"] === "WebPage");
    assert(webPage?.url === page.url, `${page.file}: WebPage schema URL mismatch`);
    assert(webPage?.inLanguage === page.lang, `${page.file}: WebPage schema language mismatch`);
}

function validateTranslations() {
    const source = read("assets/js/languages.js");
    const context = {
        document: {
            addEventListener() {},
            documentElement: {},
            querySelector() { return null; },
            querySelectorAll() { return []; },
            dispatchEvent() {}
        },
        localStorage: { getItem() { return null; }, setItem() {} },
        navigator: { language: "en-US" },
        window: { location: { pathname: "/" } },
        CustomEvent: function CustomEvent() {},
        console
    };

    vm.createContext(context);
    vm.runInContext(`${source}\nthis.translations = WEBSITE_TRANSLATIONS;`, context);

    const translations = context.translations;
    const languages = ["en", "pt", "es"];
    const expectedKeys = Object.keys(translations.en).sort();

    for (const language of languages) {
        const keys = Object.keys(translations[language]).sort();
        assert(
            JSON.stringify(keys) === JSON.stringify(expectedKeys),
            `Translation keys differ for ${language}`
        );
    }

    assert(expectedKeys.length === 215, `Expected 215 translation keys, received ${expectedKeys.length}`);
}

function validateSitemap() {
    const source = read("sitemap.xml");
    const locations = [...source.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    const expected = pages.map(page => page.url);

    assert(new Set(locations).size === locations.length, "Sitemap contains duplicate URLs");
    assert(
        JSON.stringify([...locations].sort()) === JSON.stringify([...expected].sort()),
        "Sitemap URLs do not match canonical pages"
    );

    for (const page of localizedPages) {
        assert(source.includes(`<loc>${page.url}</loc>`), `Sitemap missing ${page.url}`);
    }
}

function validateGeneratedArtifacts() {
    assert(fs.existsSync(path.join(root, "assets/css/site.bundle.css")), "Missing CSS bundle");
    assert(fs.statSync(path.join(root, "assets/css/site.bundle.css")).size > 100000, "CSS bundle is unexpectedly small");
    JSON.parse(read("assets/seo/site.webmanifest"));
    assert(read("robots.txt").includes(`${siteUrl}/sitemap.xml`), "robots.txt sitemap mismatch");
}

const sources = new Map();
for (const page of pages) {
    sources.set(page.file, validatePage(page));
}
for (const page of localizedPages) {
    validateLocalizedPage(page, sources.get(page.file));
}

validateTranslations();
validateSitemap();
validateGeneratedArtifacts();

console.log(`Validated ${pages.length} pages, ${hreflangSet.size} hreflang values and 215 translation keys.`);
