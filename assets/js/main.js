/* ==========================================================
   ESPAÇO DOS ANJOS CHILD CARE
   GLOBAL WEBSITE FUNCTIONALITY
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       WEBSITE ELEMENTS
    ====================================================== */

    const body = document.body;

    const header =
        document.getElementById("site-header");

    const navigation =
        document.getElementById("site-navigation");

    const mobileMenuButton =
        document.getElementById("mobile-menu-button");

    const mobileMenuOverlay =
        document.getElementById("mobile-menu-overlay");

    const navigationLinks =
        document.querySelectorAll(".site-navigation__link");

    const languageSelector =
        document.querySelector(".language-selector");

    const languageButton =
        document.querySelector(".language-selector__button");

    const languageMenu =
        document.querySelector(".language-selector__menu");

    const languageOptions =
        document.querySelectorAll(".language-selector__option");

    const currentLanguage =
        document.querySelector(".language-selector__current");

    let mobileMenuReturnFocus = null;


    /* ======================================================
       HEADER SCROLL EFFECT
    ====================================================== */

    const updateHeaderOnScroll = () => {

        if (!header) {
            return;
        }

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 20
        );

    };

    updateHeaderOnScroll();

    window.addEventListener(
        "scroll",
        updateHeaderOnScroll,
        { passive: true }
    );


    /* ======================================================
       MOBILE MENU
    ====================================================== */

    const getMobileMenuLabel = (key, fallback) => {

        const activeLanguage =
            document.documentElement.lang
                ?.toLowerCase()
                .split("-")[0];

        if (
            typeof WEBSITE_TRANSLATIONS !== "undefined" &&
            WEBSITE_TRANSLATIONS[activeLanguage]?.[key]
        ) {
            return WEBSITE_TRANSLATIONS[activeLanguage][key];
        }

        return fallback;

    };

    const openMobileMenu = () => {

        if (
            !navigation ||
            !mobileMenuButton ||
            !mobileMenuOverlay
        ) {
            return;
        }

        mobileMenuReturnFocus =
            document.activeElement;

        navigation.classList.add("is-open");

        mobileMenuButton.classList.add("is-open");

        mobileMenuOverlay.classList.add("is-visible");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            getMobileMenuLabel(
                "header.closeMenu",
                "Close navigation menu"
            )
        );

        mobileMenuOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("no-scroll");

        navigationLinks[0]?.focus();

    };


    const closeMobileMenu = ({ restoreFocus = true } = {}) => {

        if (
            !navigation ||
            !mobileMenuButton ||
            !mobileMenuOverlay
        ) {
            return;
        }

        const menuWasOpen =
            navigation.classList.contains("is-open");

        navigation.classList.remove("is-open");

        mobileMenuButton.classList.remove("is-open");

        mobileMenuOverlay.classList.remove("is-visible");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            getMobileMenuLabel(
                "header.openMenu",
                "Open navigation menu"
            )
        );

        mobileMenuOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove("no-scroll");

        if (
            menuWasOpen &&
            restoreFocus &&
            mobileMenuReturnFocus instanceof HTMLElement
        ) {

            mobileMenuReturnFocus.focus();

        }

        mobileMenuReturnFocus = null;

    };


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            () => {

                const menuIsOpen =
                    navigation?.classList.contains("is-open");

                if (menuIsOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );

    }


    if (mobileMenuOverlay) {

        mobileMenuOverlay.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navigationLinks.forEach((item) => {

                item.classList.remove("is-active");

            });

            link.classList.add("is-active");

            closeMobileMenu({ restoreFocus: false });

        });

    });


    /* ======================================================
       CLOSE MOBILE MENU WITH ESCAPE
    ====================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMobileMenu();

            closeLanguageMenu({ restoreFocus: true });

        }

    });


    /* ======================================================
       CLOSE MOBILE MENU AFTER RESIZE
    ====================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 860) {

            closeMobileMenu({ restoreFocus: false });

        }

    });


    /* ======================================================
       LANGUAGE SELECTOR
       VISUAL FUNCTIONALITY FOR NOW
    ====================================================== */

    const openLanguageMenu = () => {

        if (
            !languageSelector ||
            !languageButton ||
            !languageMenu
        ) {
            return;
        }

        languageSelector.classList.add("is-open");

        languageButton.setAttribute(
            "aria-expanded",
            "true"
        );

        languageMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        const activeOption =
            languageMenu.querySelector(
                ".language-selector__option.is-active"
            );

        activeOption?.focus();

    };


    function closeLanguageMenu({ restoreFocus = false } = {}) {

        if (
            !languageSelector ||
            !languageButton ||
            !languageMenu
        ) {
            return;
        }

        languageSelector.classList.remove("is-open");

        languageButton.setAttribute(
            "aria-expanded",
            "false"
        );

        languageMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        if (restoreFocus) {

            languageButton.focus();

        }

    }


    if (languageButton) {

        languageButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const menuIsOpen =
                    languageSelector?.classList.contains("is-open");

                if (menuIsOpen) {

                    closeLanguageMenu();

                } else {

                    openLanguageMenu();

                }

            }
        );

    }


    if (languageMenu) {

        languageMenu.addEventListener(
            "keydown",
            (event) => {

                const options =
                    Array.from(languageOptions);

                const currentIndex =
                    options.indexOf(document.activeElement);

                let nextIndex = null;

                if (event.key === "ArrowDown") {

                    nextIndex =
                        (currentIndex + 1) % options.length;

                } else if (event.key === "ArrowUp") {

                    nextIndex =
                        (currentIndex - 1 + options.length) % options.length;

                } else if (event.key === "Home") {

                    nextIndex = 0;

                } else if (event.key === "End") {

                    nextIndex = options.length - 1;

                }

                if (nextIndex !== null) {

                    event.preventDefault();
                    options[nextIndex]?.focus();

                }

            }
        );

    }


    languageOptions.forEach((option) => {

        option.addEventListener("click", () => {

            const selectedLanguage =
                option.dataset.language;

            languageOptions.forEach((item) => {

                item.classList.remove("is-active");

            });

            option.classList.add("is-active");

            if (currentLanguage) {

                currentLanguage.textContent =
                    selectedLanguage.toUpperCase();

            }

            closeLanguageMenu();

        });

    });


    document.addEventListener("click", (event) => {

        if (
            languageSelector &&
            !languageSelector.contains(event.target)
        ) {

            closeLanguageMenu();

        }

    });

});
