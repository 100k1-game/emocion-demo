(function () {
  "use strict";

  /* Scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Smooth scroll */
  function headerHeight() {
    var h = document.querySelector(".site-header");
    return h ? h.offsetHeight + 16 : 180;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerHeight(),
        behavior: "smooth",
      });
    });
  });

  /* Scroll to top */
  var topBtn = document.getElementById("scroll-top");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      topBtn.classList.toggle("is-visible", window.scrollY > 500);
    }, { passive: true });
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Swiper coverflow */
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof Swiper === "undefined") return;

    var coverflow = {
      effect: "coverflow",
      grabCursor: false,
      centeredSlides: true,
      loop: true,
      allowTouchMove: false,
      watchSlidesProgress: true,
      autoplay: { delay: 2600, disableOnInteraction: false },
      speed: 800,
      coverflowEffect: {
        rotate: 28,
        stretch: -18,
        depth: 160,
        modifier: 1.05,
        slideShadows: false,
      },
    };

    if (document.querySelector("#mediaSwiper")) {
      new Swiper("#mediaSwiper", Object.assign({}, coverflow, {
        slidesPerView: "auto",
        spaceBetween: 26,
      }));
    }

    if (document.querySelector("#partnersSwiper")) {
      new Swiper("#partnersSwiper", Object.assign({}, coverflow, {
        slidesPerView: 3,
        spaceBetween: 20,
        coverflowEffect: { rotate: 22, stretch: -14, depth: 140, modifier: 1, slideShadows: false },
        breakpoints: {
          0: { slidesPerView: 1.15 },
          640: { slidesPerView: 2.2 },
          960: { slidesPerView: 3 },
        },
      }));
    }

    var aboutEl = document.querySelector("#aboutSwiper");
    if (aboutEl) {
      var aboutDelay = 6500;
      aboutEl.style.setProperty("--about-delay", aboutDelay + "ms");

      function restartAboutProgress() {
        var bar = document.getElementById("about-progress");
        if (!bar) return;
        bar.classList.remove("is-running");
        void bar.offsetWidth;
        bar.classList.add("is-running");
      }

      var aboutSwiper = new Swiper("#aboutSwiper", {
        loop: true,
        effect: "fade",
        fadeEffect: { crossFade: true },
        speed: 900,
        autoplay: {
          delay: aboutDelay,
          disableOnInteraction: false,
          waitForTransition: true,
        },
        allowTouchMove: true,
        pagination: {
          el: "#aboutSwiper .about-swiper__dots",
          clickable: true,
        },
        on: {
          init: function () {
            restartAboutProgress();
          },
          slideChangeTransitionStart: function () {
            restartAboutProgress();
          },
        },
      });

    }
  });

  /* Yandex Map */
  function initMap() {
    if (typeof ymaps === "undefined" || !document.getElementById("yandex-map")) return;
    ymaps.ready(function () {
      var map = new ymaps.Map("yandex-map", {
        center: [44.903328, 37.334196],
        zoom: 16,
        controls: [],
      });
      map.geoObjects.add(new ymaps.Placemark([44.903328, 37.334196], {
        balloonContentHeader: "Emocion",
        balloonContentBody: "г. Анапа, ул. Горького, 78",
      }, { preset: "islands#redDotIcon" }));
      map.behaviors.disable("scrollZoom");
      map.controls.add("zoomControl", { size: "small" });
    });
  }

  if (typeof ymaps !== "undefined") initMap();
  else window.addEventListener("load", initMap);
})();
