"use strict";

(() => {
    const localeMap = {
        en: "en-US",
        pt: "pt-BR",
        es: "es-ES"
    };

    function getCurrentLanguage() {
        const htmlLanguage =
            document.documentElement.lang
                ?.trim()
                .toLowerCase()
                .split("-")[0];

        const selectedLanguage =
            window.currentLanguage
                ?.trim()
                .toLowerCase()
                .split("-")[0];

        return selectedLanguage || htmlLanguage || "en";
    }

    function updateEnrollmentDate() {
        const monthElement =
            document.getElementById("current-month");

        const yearElement =
            document.getElementById("current-year");

        if (!monthElement || !yearElement) {
            return;
        }

        const currentDate = new Date();
        const language = getCurrentLanguage();
        const locale = localeMap[language] || localeMap.en;

        const formattedMonth =
            new Intl.DateTimeFormat(locale, {
                month: "long"
            }).format(currentDate);

        monthElement.textContent =
            formattedMonth.charAt(0).toUpperCase() +
            formattedMonth.slice(1);

        yearElement.textContent =
            String(currentDate.getFullYear());
    }

    function initializeEnrollmentScroll() {
        const enrollmentButton =
            document.querySelector("[data-scroll-to-tour]");

        const tourSection =
            document.getElementById("tour");

        if (!enrollmentButton || !tourSection) {
            return;
        }

        enrollmentButton.addEventListener("click", event => {
            event.preventDefault();

            tourSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(null, "", "#tour");
        });
    }

    function observeLanguageChanges() {
        const languageButtons =
            document.querySelectorAll(
                ".language-selector__option[data-language]"
            );

        languageButtons.forEach(button => {
            button.addEventListener("click", () => {
                /*
                 * Aguarda languages.js alterar o idioma da página.
                 */
                window.requestAnimationFrame(() => {
                    updateEnrollmentDate();
                });
            });
        });

        /*
         * Atualiza também quando o atributo lang do HTML mudar.
         */
        const languageObserver = new MutationObserver(mutations => {
            const languageChanged = mutations.some(
                mutation =>
                    mutation.type === "attributes" &&
                    mutation.attributeName === "lang"
            );

            if (languageChanged) {
                updateEnrollmentDate();
            }
        });

        languageObserver.observe(
            document.documentElement,
            {
                attributes: true,
                attributeFilter: ["lang"]
            }
        );
    }

    function initializeEnrollment() {
        updateEnrollmentDate();
        initializeEnrollmentScroll();
        observeLanguageChanges();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeEnrollment,
            { once: true }
        );
    } else {
        initializeEnrollment();
    }
})();