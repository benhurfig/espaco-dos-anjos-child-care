"use strict";

(() => {
    const storageKey = "edaCookieConsent";
    const acceptedValue = "accepted";
    const rejectedValue = "rejected";

    const translations = {
        en: {
            title: "Your privacy matters",
            text: "We use optional analytics cookies to understand website visits and improve the experience. The site works normally if you decline.",
            accept: "Accept analytics",
            reject: "Decline",
            policy: "Privacy Policy",
            settings: "Cookie settings",
            label: "Cookie consent"
        },
        pt: {
            title: "Sua privacidade é importante",
            text: "Usamos cookies opcionais de análise para entender as visitas e melhorar a experiência. O site funciona normalmente se você recusar.",
            accept: "Aceitar analytics",
            reject: "Recusar",
            policy: "Política de Privacidade",
            settings: "Configurar cookies",
            label: "Consentimento de cookies"
        },
        es: {
            title: "Tu privacidad es importante",
            text: "Usamos cookies opcionales de análisis para entender las visitas y mejorar la experiencia. El sitio funciona normalmente si los rechazas.",
            accept: "Aceptar analytics",
            reject: "Rechazar",
            policy: "Política de Privacidad",
            settings: "Configurar cookies",
            label: "Consentimiento de cookies"
        }
    };

    function currentLanguage() {
        const language = document.documentElement.lang
            .toLowerCase()
            .split("-")[0];

        return translations[language] ? language : "en";
    }

    function updateGoogleConsent(granted) {
        window.analyticsConsentGranted = granted;

        if (typeof window.gtag !== "function") {
            return;
        }

        window.gtag("consent", "update", {
            analytics_storage: granted ? "granted" : "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });

        if (
            granted &&
            typeof window.loadGoogleAnalytics === "function"
        ) {
            window.loadGoogleAnalytics();
        }
    }

    function storeChoice(value) {
        try {
            localStorage.setItem(storageKey, value);
        } catch (error) {
            console.warn("Cookie preference could not be saved.");
        }
    }

    function readChoice() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function buildConsentInterface() {
        const language = currentLanguage();
        const copy = translations[language];
        const component = document.createElement("div");

        component.className = "cookie-consent";
        component.setAttribute("data-cookie-consent", "");
        component.setAttribute("role", "dialog");
        component.setAttribute("aria-modal", "false");
        component.setAttribute("aria-label", copy.label);
        component.hidden = true;
        component.innerHTML = `
            <div class="cookie-consent__content">
                <div class="cookie-consent__copy">
                    <strong class="cookie-consent__title">${copy.title}</strong>
                    <p class="cookie-consent__text">
                        ${copy.text}
                        <a href="/privacy-policy">${copy.policy}</a>
                    </p>
                </div>
                <div class="cookie-consent__actions">
                    <button class="cookie-consent__button cookie-consent__button--reject" type="button" data-cookie-reject>${copy.reject}</button>
                    <button class="cookie-consent__button cookie-consent__button--accept" type="button" data-cookie-accept>${copy.accept}</button>
                </div>
            </div>
        `;

        const settingsButton = document.createElement("button");
        settingsButton.className = "cookie-settings-button";
        settingsButton.type = "button";
        settingsButton.textContent = copy.settings;
        settingsButton.setAttribute("data-cookie-settings", "");
        settingsButton.hidden = true;

        const settingsHost =
            document.querySelector(".footer__bottom") ||
            document.querySelector(".footer") ||
            document.body;

        document.body.append(component);
        settingsHost.append(settingsButton);

        const acceptButton = component.querySelector("[data-cookie-accept]");
        const rejectButton = component.querySelector("[data-cookie-reject]");

        const closeWithChoice = accepted => {
            const value = accepted ? acceptedValue : rejectedValue;
            storeChoice(value);
            updateGoogleConsent(accepted);
            component.hidden = true;
            settingsButton.hidden = false;
            settingsButton.focus();
        };

        acceptButton.addEventListener("click", () => closeWithChoice(true));
        rejectButton.addEventListener("click", () => closeWithChoice(false));
        settingsButton.addEventListener("click", () => {
            component.hidden = false;
            settingsButton.hidden = true;
            rejectButton.focus();
        });

        const savedChoice = readChoice();

        if (savedChoice === acceptedValue) {
            updateGoogleConsent(true);
            settingsButton.hidden = false;
        } else if (savedChoice === rejectedValue) {
            updateGoogleConsent(false);
            settingsButton.hidden = false;
        } else {
            component.hidden = false;
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildConsentInterface, { once: true });
    } else {
        buildConsentInterface();
    }
})();
