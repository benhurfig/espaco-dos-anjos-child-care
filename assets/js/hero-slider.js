/* ==========================================================
   ESPAÇO DOS ANJOS CHILD CARE
   HERO IMAGE SLIDER
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ======================================================
       HERO ELEMENTS
    ====================================================== */

    const heroSlider =
        document.getElementById("hero-slider");

    const slides =
        document.querySelectorAll(".hero__slide");

    const dots =
        document.querySelectorAll(".hero__dot");

    const storyText =
        document.getElementById("hero-story-text");


    /* ======================================================
       VALIDATION
    ====================================================== */

    if (!heroSlider || slides.length === 0) {

        return;

    }


    /* ======================================================
       SLIDER SETTINGS
    ====================================================== */

    const slideInterval = 4500;

    let currentSlideIndex = 0;

    let sliderTimer = null;


    /* ======================================================
       GET CURRENT WEBSITE LANGUAGE
    ====================================================== */

    const getCurrentLanguage = () => {

        return document.documentElement.lang || "en";

    };


/* ======================================================
   UPDATE STORY CARD TEXT
====================================================== */

const updateStoryCard = (slide) => {

    if (!storyText || !slide) {
        return;
    }

    const translationKey =
        slide.dataset.heroLabel;

    const currentLanguage =
        document.documentElement.lang || "en";

    const translatedText =
        window.WEBSITE_TRANSLATIONS?.[currentLanguage]?.[translationKey];

    /* Update the translation key for the active slide */

    storyText.setAttribute(
        "data-i18n",
        translationKey
    );

    /* Apply translated text */

    if (translatedText) {

        storyText.textContent =
            translatedText;

    }

};


    /* ======================================================
       SHOW SELECTED SLIDE
    ====================================================== */

    const showSlide = (index) => {

        if (index < 0 || index >= slides.length) {

            return;

        }


        slides.forEach((slide, slideIndex) => {

            slide.classList.toggle(
                "is-active",
                slideIndex === index
            );

        });


        dots.forEach((dot, dotIndex) => {

            const isActive =
                dotIndex === index;

            dot.classList.toggle(
                "is-active",
                isActive
            );

            dot.setAttribute(
                "aria-selected",
                String(isActive)
            );

        });


        currentSlideIndex = index;

        updateStoryCard(
            slides[currentSlideIndex]
        );

    };


    /* ======================================================
       SHOW NEXT SLIDE
    ====================================================== */

    const showNextSlide = () => {

        const nextIndex =
            (currentSlideIndex + 1) %
            slides.length;

        showSlide(nextIndex);

    };


    /* ======================================================
       START AUTO SLIDER
    ====================================================== */

    const startSlider = () => {

        stopSlider();

        sliderTimer =
            window.setInterval(
                showNextSlide,
                slideInterval
            );

    };


    /* ======================================================
       STOP AUTO SLIDER
    ====================================================== */

    const stopSlider = () => {

        if (!sliderTimer) {

            return;

        }

        window.clearInterval(
            sliderTimer
        );

        sliderTimer = null;

    };


    /* ======================================================
       DOT BUTTON CONTROLS
    ====================================================== */

    dots.forEach((dot) => {

        dot.addEventListener(
            "click",
            () => {

                const slideIndex =
                    Number(
                        dot.dataset.slideIndex
                    );

                showSlide(slideIndex);

                startSlider();

            }
        );

    });


    /* ======================================================
       PAUSE WHEN BROWSER TAB IS HIDDEN
    ====================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                stopSlider();

            } else {

                startSlider();

            }

        }
    );


    /* ======================================================
       UPDATE TEXT WHEN LANGUAGE CHANGES
    ====================================================== */

    document.addEventListener(
        "websiteLanguageChanged",
        () => {

            updateStoryCard(
                slides[currentSlideIndex]
            );

        }
    );


    /* ======================================================
       INITIALIZE HERO SLIDER
    ====================================================== */

    showSlide(0);

    startSlider();

});