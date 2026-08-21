/**
 * @fileoverview Adds a border to the sticky header once the page has
 * scrolled, highlights whichever nav link matches the section currently
 * in view, and flips the Install link's arrow once its target has been
 * scrolled past.
 */

(function () {
    var header = document.getElementById("site-header");
    var installTarget = document.getElementById("install");
    var installArrow = document.querySelector("#install-link .install-arrow");

    if (header || (installTarget && installArrow)) {
        var onScroll = function () {
            if (header) header.classList.toggle("is-scrolled", window.scrollY > 4);
            if (installTarget && installArrow) {
                var passed = installTarget.getBoundingClientRect().bottom < 0;
                installArrow.classList.toggle("is-passed", passed);
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    var navLinks = document.querySelectorAll("nav.primary a[href^='#']");
    if (!("IntersectionObserver" in window) || navLinks.length === 0) return;

    var linkByTargetId = {};
    navLinks.forEach(function (link) {
        var id = link.getAttribute("href").slice(1);
        if (document.getElementById(id)) linkByTargetId[id] = link;
    });

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                var link = linkByTargetId[entry.target.id];
                if (!link) return;
                link.classList.toggle("is-active", entry.isIntersecting);
                if (entry.isIntersecting) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        },
        { rootMargin: "-45% 0px -50% 0px" },
    );

    Object.keys(linkByTargetId).forEach(function (id) {
        observer.observe(document.getElementById(id));
    });
})();
