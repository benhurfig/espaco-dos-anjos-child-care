/* ==========================================================
   GOOGLE ANALYTICS 4
========================================================== */

// Carrega gtag.js

const gtagScript = document.createElement("script");

gtagScript.async = true;

gtagScript.src =
`https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4}`;

document.head.appendChild(gtagScript);

// DataLayer

window.dataLayer = window.dataLayer || [];

function gtag(){

    dataLayer.push(arguments);

}

// Inicialização

gtag("js", new Date());

// Analytics

gtag("config", CONFIG.ga4);

// Google Ads (caso exista)

if(CONFIG.googleAds){

    gtag("config", CONFIG.googleAds);

}

/* ==========================================================
   IDENTIFICA A PÁGINA
========================================================== */

window.pageSource =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
        ? "home"
        : window.location.pathname.replace(/\//g, "");

/* ==========================================================
   EVENTOS
========================================================== */

window.trackEvent = function(eventName, params = {}){

    gtag("event", eventName, {
        source_page: window.pageSource,
        ...params
    });

};

console.log("✅ Analytics carregado");