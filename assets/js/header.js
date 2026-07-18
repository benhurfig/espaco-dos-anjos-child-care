/* ==========================================================
   ESPAÇO DOS ANJOS CHILD CARE
   HEADER CONTROLLER
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const header =
        document.getElementById("site-header");

    const menuButton =
        document.getElementById("mobile-menu-button");

    const mobileMenu =
        document.getElementById("mobile-menu");

    const overlay =
        document.getElementById("mobile-overlay");

    const mobileLinks =
        mobileMenu
            ? mobileMenu.querySelectorAll("a")
            : [];


    /* ======================================================
       HEADER ON SCROLL
    ====================================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 20) {

            header.classList.add("is-scrolled");

        } else {

            header.classList.remove("is-scrolled");

        }

    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* ======================================================
       OPEN MENU
    ====================================================== */

    function openMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.add("is-active");

        overlay.classList.add("is-active");

        menuButton.classList.add("is-active");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow = "hidden";

    }


    /* ======================================================
       CLOSE MENU
    ====================================================== */

    function closeMenu() {

        if (!mobileMenu) return;

        mobileMenu.classList.remove("is-active");

        overlay.classList.remove("is-active");

        menuButton.classList.remove("is-active");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow = "";

    }


    /* ======================================================
       TOGGLE MENU
    ====================================================== */

    if (menuButton) {

        menuButton.addEventListener("click", () => {

            if (
                mobileMenu.classList.contains("is-active")
            ) {

                closeMenu();

            } else {

                openMenu();

            }

        });

    }


    /* ======================================================
       CLOSE CLICK OVERLAY
    ====================================================== */

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMenu
        );

    }


    /* ======================================================
       CLOSE CLICK LINK
    ====================================================== */

    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    /* ======================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );

});