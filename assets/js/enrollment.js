"use strict";

(() => {
    const localeMap = {
        en: "en-US",
        pt: "pt-BR",
        es: "es-ES"
    };

    function getCurrentLanguage() {
        const windowLanguage =
            window.currentLanguage
                ?.trim()
                .toLowerCase()
                .split("-")[0];

        const htmlLanguage =
            document.documentElement.lang
                ?.trim()
                .toLowerCase()
                .split("-")[0];

        return windowLanguage || htmlLanguage || "en";
    }

    function capitalizeFirstLetter(text) {
        if (!text) {
            return "";
        }

        return (
            text.charAt(0).toUpperCase() +
            text.slice(1)
        );
    }

    function getCurrentDateInformation() {
        const currentDate = new Date();

        const language = getCurrentLanguage();

        const locale =
            localeMap[language] ||
            localeMap.en;

        const month =
            new Intl.DateTimeFormat(locale, {
                month: "long"
            }).format(currentDate);

        return {
            month: capitalizeFirstLetter(month),
            year: String(currentDate.getFullYear())
        };
    }

    function updateEnrollmentDate() {
        const monthElement =
            document.getElementById("current-month");

        const yearElement =
            document.getElementById("current-year");

        if (!monthElement || !yearElement) {
            return;
        }

        const dateInformation =
            getCurrentDateInformation();

        monthElement.textContent =
            dateInformation.month;

        yearElement.textContent =
            dateInformation.year;
    }

    function updateBulletinDate() {
        const monthElement =
            document.getElementById(
                "bulletin-current-month"
            );

        const yearElement =
            document.getElementById(
                "bulletin-current-year"
            );

        if (!monthElement || !yearElement) {
            return;
        }

        const dateInformation =
            getCurrentDateInformation();

        monthElement.textContent =
            dateInformation.month;

        yearElement.textContent =
            dateInformation.year;
    }

    function updateAllDynamicDates() {
        updateEnrollmentDate();
        updateBulletinDate();
    }

    function initializeEnrollmentScroll() {
        const enrollmentButton =
            document.querySelector(
                "[data-scroll-to-tour]"
            );

        const tourSection =
            document.getElementById("tour");

        if (!enrollmentButton || !tourSection) {
            return;
        }

        enrollmentButton.addEventListener(
            "click",
            event => {
                event.preventDefault();

                tourSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(
                    null,
                    "",
                    "#tour"
                );
            }
        );
    }

    function observeLanguageChanges() {
        const languageButtons =
            document.querySelectorAll(
                ".language-selector__option[data-language]"
            );

        languageButtons.forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    window.setTimeout(() => {
                        updateAllDynamicDates();
                    }, 50);
                }
            );
        });

        const languageObserver =
            new MutationObserver(mutations => {
                const languageChanged =
                    mutations.some(
                        mutation =>
                            mutation.type ===
                                "attributes" &&
                            mutation.attributeName ===
                                "lang"
                    );

                if (languageChanged) {
                    updateAllDynamicDates();
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

    function initializeDynamicContent() {
        updateAllDynamicDates();
        initializeEnrollmentScroll();
        observeLanguageChanges();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeDynamicContent,
            { once: true }
        );
    } else {
        initializeDynamicContent();
    }
})();