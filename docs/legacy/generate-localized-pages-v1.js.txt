"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(projectRoot, "index.html");
const languagesPath = path.join(projectRoot, "assets/js/languages.js");
const siteUrl = "https://www.espacodosanjoschildcare.com";

const localeSeo = {
    pt: {
        htmlLang: "pt-BR",
        ogLocale: "pt_BR",
        path: "/pt/",
        title: "Creche Familiar em Clinton, MA | Espaço dos Anjos",
        description: "Creche familiar licenciada em Clinton, MA, para crianças de 6 meses a 5 anos, com aprendizado bilíngue, refeições e educação por meio de brincadeiras.",
        imageAlt: "Espaço dos Anjos Child Care em Clinton, Massachusetts"
    },
    es: {
        htmlLang: "es",
        ogLocale: "es_US",
        path: "/es/",
        title: "Cuidado Infantil Familiar en Clinton | Espaço dos Anjos",
        description: "Cuidado infantil familiar autorizado en Clinton, MA, para niños de 6 meses a 5 años, con aprendizaje bilingüe, comidas y educación mediante el juego.",
        imageAlt: "Espaço dos Anjos Child Care en Clinton, Massachusetts"
    }
};

function loadTranslations() {
    const source = fs.readFileSync(languagesPath, "utf8");
    const context = {
        console,
        document: {
            addEventListener() {},
            documentElement: {},
            querySelector() { return null; },
            querySelectorAll() { return []; },
            dispatchEvent() {}
        },
        localStorage: {
            getItem() { return null; },
            setItem() {}
        },
        navigator: { language: "en-US" },
        window: {
            location: { pathname: "/" }
        },
        CustomEvent: function CustomEvent() {}
    };

    vm.createContext(context);
    vm.runInContext(
        `${source}\nthis.__translations = WEBSITE_TRANSLATIONS;`,
        context
    );

    return context.__translations;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
    return escapeHtml(value).replaceAll('"', "&quot;");
}

function replaceElementText(html, key, value) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
        `(<([a-zA-Z][\\w:-]*)\\b[^>]*\\bdata-i18n=["']${escapedKey}["'][^>]*>)[\\s\\S]*?(</\\2>)`,
        "g"
    );

    return html.replace(
        pattern,
        (_, opening, tag, closing) =>
            `${opening}${escapeHtml(value)}${closing}`
    );
}

function replaceTranslatedAttribute(html, attribute, key, value) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const dataAttribute = `data-i18n-${attribute}`;
    const elementPattern = new RegExp(
        `<([a-zA-Z][\\w:-]*)\\b([^>]*\\b${dataAttribute}=["']${escapedKey}["'][^>]*)>`,
        "g"
    );

    return html.replace(elementPattern, (full, tag, attributes) => {
        const target = attribute === "aria-label" ? "aria-label" : attribute;
        const replacement = `${target}="${escapeAttribute(value)}"`;
        const updated = new RegExp(`\\b${target}=["'][^"']*["']`).test(attributes)
            ? attributes.replace(
                new RegExp(`\\b${target}=["'][^"']*["']`),
                replacement
            )
            : `${attributes} ${replacement}`;

        return `<${tag}${updated}>`;
    });
}

function addHreflang(html) {
    if (html.includes('hreflang="x-default"')) {
        return html;
    }

    const links = [
        `    <link rel="alternate" hreflang="en" href="${siteUrl}/">`,
        `    <link rel="alternate" hreflang="pt" href="${siteUrl}/pt/">`,
        `    <link rel="alternate" hreflang="es" href="${siteUrl}/es/">`,
        `    <link rel="alternate" hreflang="x-default" href="${siteUrl}/">`
    ].join("\n");

    return html.replace(
        /(<link\s+rel="canonical"[\s\S]*?>)/,
        `$1\n\n${links}`
    );
}

function updateLanguageSelector(html, language) {
    html = html.replace(
        /(<span class="language-selector__current">)[\s\S]*?(<\/span>)/,
        `$1\n                        ${language.toUpperCase()}\n                    $2`
    );

    return html.replace(
        /<button\b[\s\S]*?data-language="(en|pt|es)"[\s\S]*?<\/button>/g,
        (button, optionLanguage) => {
            let updated = button.replace(
                /(class="language-selector__option)(?: is-active)?(")/,
                "$1$2"
            );

            if (optionLanguage === language) {
                updated = updated.replace(
                    'class="language-selector__option"',
                    'class="language-selector__option is-active"'
                );
            }

            return updated;
        }
    );
}

function updateOpenGraphLocales(html, locale) {
    const alternateLocales = ["en_US", "pt_BR", "es_US"]
        .filter(item => item !== locale.ogLocale)
        .map(item => `    <meta property="og:locale:alternate" content="${item}">`)
        .join("\n");

    html = html.replace(
        /\s*<meta property="og:locale:alternate" content="[^"]+">/g,
        ""
    );

    return html.replace(
        /(<meta\s+property="og:locale"\s+content="[^"]+"\s*>)/s,
        `$1\n\n${alternateLocales}`
    );
}

function localizeStructuredData(html, locale) {
    const pattern = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/;
    const match = html.match(pattern);
    const data = JSON.parse(match[2]);
    const pageUrl = `${siteUrl}${locale.path}`;
    const business = data["@graph"].find(item => item["@type"] === "ChildCare");
    const page = data["@graph"].find(item => item["@type"] === "WebPage");

    business.description = locale.description;
    page["@id"] = `${pageUrl}#webpage`;
    page.url = pageUrl;
    page.name = locale.title;
    page.description = locale.description;
    page.inLanguage = locale.htmlLang;

    return html.replace(
        pattern,
        `$1\n${JSON.stringify(data, null, 2)}\n    $3`
    );
}

function buildLocale(language, translations, source) {
    const locale = localeSeo[language];
    let html = source;

    for (const [key, value] of Object.entries(translations[language])) {
        html = replaceElementText(html, key, value);
        html = replaceTranslatedAttribute(html, "aria-label", key, value);
        html = replaceTranslatedAttribute(html, "alt", key, value);
        html = replaceTranslatedAttribute(html, "placeholder", key, value);
    }

    html = html.replace('<html lang="en">', `<html lang="${locale.htmlLang}">`);
    html = html.replace(/(<title>)[\s\S]*?(<\/title>)/, `$1\n        ${locale.title}\n    $2`);
    html = html.replace(
        /(<meta\s+name="description"\s+content=")[^"]*("\s*>)/s,
        `$1${escapeAttribute(locale.description)}$2`
    );
    html = html.replace(
        /(<link\s+rel="canonical"\s+href=")[^"]*("\s*>)/s,
        `$1${siteUrl}${locale.path}$2`
    );
    html = html.replace(/(<meta\s+property="og:locale"\s+content=")[^"]*(")/, `$1${locale.ogLocale}$2`);
    html = updateOpenGraphLocales(html, locale);
    html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/s, `$1${escapeAttribute(locale.title)}$2`);
    html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/s, `$1${escapeAttribute(locale.description)}$2`);
    html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/s, `$1${siteUrl}${locale.path}$2`);
    html = html.replace(/(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/s, `$1${escapeAttribute(locale.imageAlt)}$2`);
    html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/s, `$1${escapeAttribute(locale.title)}$2`);
    html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/s, `$1${escapeAttribute(locale.description)}$2`);
    html = html.replace(/(<meta\s+name="twitter:image:alt"\s+content=")[^"]*(")/s, `$1${escapeAttribute(locale.imageAlt)}$2`);
    html = addHreflang(html);
    html = localizeStructuredData(html, locale);
    html = updateLanguageSelector(html, language);

    const outputPath = path.join(projectRoot, language, "index.html");
    fs.writeFileSync(outputPath, html);
    console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
}

const translations = loadTranslations();
const source = fs.readFileSync(sourcePath, "utf8");

for (const language of Object.keys(localeSeo)) {
    buildLocale(language, translations, source);
}
