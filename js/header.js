(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".site-header__toggle");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!toggle.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) setMenu(false);
    });
  }

  if (header) {
    var ticking = false;
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
    onScroll();
  }
})();
