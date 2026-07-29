(function () {

    const monthElement = document.getElementById("current-month");
    const yearElement = document.getElementById("current-year");

    if (!monthElement || !yearElement) return;

    const now = new Date();

    /*
        Idioma atual.

        No futuro basta substituir:

        window.currentLanguage

        pela variável do sistema.
    */

    const language =
        window.currentLanguage ||
        document.documentElement.lang ||
        "en";

    const localeMap = {

        en: "en-US",
        pt: "pt-BR",
        es: "es-ES"

    };

    const locale =
        localeMap[language] || "en-US";

    const month =
        new Intl.DateTimeFormat(locale, {

            month: "long"

        }).format(now);

    monthElement.textContent =
        month.charAt(0).toUpperCase() +
        month.slice(1);

    yearElement.textContent =
        now.getFullYear();

})();