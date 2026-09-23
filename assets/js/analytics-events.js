"use strict";

(() => {
    function sendEvent(name, parameters = {}) {
        if (
            !window.analyticsConsentGranted ||
            typeof window.gtag !== "function"
        ) {
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

    function normalizePath(pathname) {
        return pathname.replace(/\/+$/, "") || "/";
    }

    function getFamilyRequestTarget(href) {
        try {
            const target = new URL(href, window.location.href);
            return /^\/(?:pt\/|es\/)?family-request\/?$/.test(target.pathname)
                ? target
                : null;
        } catch (error) {
            return null;
        }
    }

    function getCtaLocation(link) {
        if (link.closest(".floating-booking")) {
            return "floating_button";
        }

        if (link.closest(".final-tour")) {
            return "final_cta";
        }

        if (link.closest("header")) {
            return link.closest(".site-navigation") &&
                window.matchMedia("(max-width: 768px)").matches
                ? "mobile_menu"
                : "header";
        }

        if (link.closest("footer")) {
            return "footer";
        }

        if (link.closest(".hero")) {
            return "hero";
        }

        return "other";
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

        const familyRequestTarget = getFamilyRequestTarget(href);
        const isSameFamilyRequestPage = familyRequestTarget &&
            normalizePath(familyRequestTarget.pathname) === normalizePath(window.location.pathname);

        if (
            !isSameFamilyRequestPage &&
            (
                link.matches("[data-family-request-link]") ||
                familyRequestTarget ||
                href.includes("smartimateapp.com/family-request/")
            )
        ) {
            sendEvent("final_cta_request", {
                cta_text: label,
                request_provider: "Smartimate",
                cta_location: getCtaLocation(link)
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
