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

    const openMobileMenu = () => {

        if (
            !navigation ||
            !mobileMenuButton ||
            !mobileMenuOverlay
        ) {
            return;
        }

        navigation.classList.add("is-open");

        mobileMenuButton.classList.add("is-open");

        mobileMenuOverlay.classList.add("is-visible");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        mobileMenuOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add("no-scroll");

    };


    const closeMobileMenu = () => {

        if (
            !navigation ||
            !mobileMenuButton ||
            !mobileMenuOverlay
        ) {
            return;
        }

        navigation.classList.remove("is-open");

        mobileMenuButton.classList.remove("is-open");

        mobileMenuOverlay.classList.remove("is-visible");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        mobileMenuOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove("no-scroll");

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

            closeMobileMenu();

        });

    });


    /* ======================================================
       CLOSE MOBILE MENU WITH ESCAPE
    ====================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMobileMenu();

            closeLanguageMenu();

        }

    });


    /* ======================================================
       CLOSE MOBILE MENU AFTER RESIZE
    ====================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 860) {

            closeMobileMenu();

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

    };


    function closeLanguageMenu() {

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