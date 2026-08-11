"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const component = document.querySelector("[data-floating-booking]");

    if (!component) {
        return;
    }

    const toggle = component.querySelector(".floating-booking__toggle");
    const menu = component.querySelector(".floating-booking__menu");
    const links = component.querySelectorAll("a");

    const setOpen = open => {
        component.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-hidden", String(!open));

        if (open) {
            links[0]?.focus();
        }
    };

    toggle.addEventListener("click", () => {
        setOpen(!component.classList.contains("is-open"));
    });

    links.forEach(link => {
        link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", event => {
        if (!component.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && component.classList.contains("is-open")) {
            setOpen(false);
            toggle.focus();
        }
    });
});
