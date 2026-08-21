/**
 * @fileoverview Keeps the footer copyright year range current without a
 * static year that goes stale.
 */

(function () {
    var startYear = 2023;
    var el = document.getElementById("copyright-year");
    if (!el) return;

    var currentYear = new Date().getFullYear();
    el.textContent =
        currentYear > startYear
            ? startYear + "–" + currentYear
            : String(startYear);
})();
