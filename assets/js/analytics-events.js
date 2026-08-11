"use strict";

(() => {
    function sendEvent(name, parameters = {}) {
        if (typeof window.gtag !== "function") {
            return;
        }

        window.gtag("event", name, {
            page_path: window.location.pathname,
            page_language: document.documentElement.lang || "en",
            ...parameters
        });
    }

    function getLabel(element) {
        return element.textContent.replace(/\s+/g, " ").trim().slice(0, 100);
    }

    document.addEventListener("click", event => {
        const link = event.target.closest("a, button");

        if (!link) {
            return;
        }

        const href = link.getAttribute("href") || "";
        const label = getLabel(link);

        if (href === "#tour" || link.matches("[data-scroll-to-tour]")) {
            sendEvent("tour_cta_click", {
                cta_text: label,
                cta_location: link.closest("header")
                    ? "header"
                    : link.closest(".hero")
                        ? "hero"
                        : link.closest("footer")
                            ? "footer"
                            : "page"
            });
            return;
        }

        if (href.includes("smartimateapp.com/smart-booking")) {
            sendEvent("booking_click", {
                cta_text: label,
                booking_provider: "Smartimate"
            });
            return;
        }

        if (href.startsWith("tel:")) {
            sendEvent("phone_click", { cta_text: label });
            return;
        }

        if (href.startsWith("sms:")) {
            sendEvent("text_click", { cta_text: label });
            return;
        }

        if (href.startsWith("mailto:")) {
            sendEvent("email_click", { cta_text: label });
            return;
        }

        if (href.includes("instagram.com/espacodosanjoschildcare")) {
            sendEvent("instagram_click", { cta_text: label });
            return;
        }

        if (href.includes("share.google/")) {
            sendEvent("google_profile_click", { cta_text: label });
        }
    });

    document.addEventListener("click", event => {
        const languageButton = event.target.closest("[data-language]");

        if (languageButton) {
            sendEvent("language_change", {
                selected_language: languageButton.dataset.language
            });
        }
    });
})();
