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

  function initVideoModal() {
    var modal = document.getElementById("video-modal");
    var player = document.getElementById("video-modal-player");
    var titleEl = document.getElementById("video-modal-title");
    if (!modal || !player) return;

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      player.pause();
      player.removeAttribute("src");
      player.load();
    }

    function openModal(src, title) {
      if (!src) return;
      if (titleEl) titleEl.textContent = title || "";
      player.src = src;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      player.play().catch(function () {});
    }

    document.querySelectorAll(".media-card--video[data-video-src]").forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (card.dataset.swiped === "1") {
          card.dataset.swiped = "0";
          return;
        }
        e.stopPropagation();
        openModal(card.getAttribute("data-video-src"), card.getAttribute("data-video-title"));
      });
    });

    modal.querySelectorAll("[data-close-modal], .video-modal__close").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  /* Swiper coverflow */
  document.addEventListener("DOMContentLoaded", function () {
    initVideoModal();
    if (typeof Swiper === "undefined") return;

    var coverflow = {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      allowTouchMove: true,
      simulateTouch: true,
      touchRatio: 1,
      threshold: 8,
      longSwipesRatio: 0.25,
      watchSlidesProgress: true,
      autoplay: { delay: 2600, disableOnInteraction: false, pauseOnMouseEnter: true },
      speed: 800,
      coverflowEffect: {
        rotate: 28,
        stretch: -18,
        depth: 160,
        modifier: 1.05,
        slideShadows: false,
      },
    };

    function bindCarouselControls(swiper, rootSelector) {
      var root = document.querySelector(rootSelector);
      if (!root) return;

      root.querySelectorAll(".media-card--video").forEach(function (card) {
        card.addEventListener("touchstart", function () {
          card.dataset.swiped = "0";
        }, { passive: true });
        card.addEventListener("touchmove", function () {
          card.dataset.swiped = "1";
        }, { passive: true });
      });

      swiper.on("touchStart", function () {
        if (swiper.autoplay && swiper.autoplay.running) {
          swiper.autoplay.stop();
        }
      });

      swiper.on("touchEnd", function () {
        if (swiper.autoplay && !swiper.autoplay.running) {
          swiper.autoplay.start();
        }
      });
    }

    if (document.querySelector("#mediaSwiper")) {
      function syncMediaVideos(swiper) {
        swiper.slides.forEach(function (slide, index) {
          var video = slide.querySelector(".media-card__video");
          if (!video) return;
          if (index === swiper.activeIndex) {
            video.play().catch(function () {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      }

      var mediaSwiper = new Swiper("#mediaSwiper", Object.assign({}, coverflow, {
        slidesPerView: "auto",
        spaceBetween: 26,
        navigation: {
          nextEl: "#mediaSwiper .carousel-btn--next",
          prevEl: "#mediaSwiper .carousel-btn--prev",
        },
        pagination: {
          el: "#mediaSwiper .carousel-pagination",
          clickable: true,
        },
        on: {
          init: function () {
            syncMediaVideos(this);
          },
          slideChangeTransitionEnd: function () {
            syncMediaVideos(this);
          },
        },
      }));

      bindCarouselControls(mediaSwiper, "#mediaSwiper");
    }

    if (document.querySelector("#partnersSwiper")) {
      var partnersSwiper = new Swiper("#partnersSwiper", Object.assign({}, coverflow, {
        slidesPerView: "auto",
        spaceBetween: 20,
        coverflowEffect: { rotate: 22, stretch: -14, depth: 140, modifier: 1, slideShadows: false },
        navigation: {
          nextEl: "#partnersSwiper .carousel-btn--next",
          prevEl: "#partnersSwiper .carousel-btn--prev",
        },
        pagination: {
          el: "#partnersSwiper .carousel-pagination",
          clickable: true,
        },
      }));

      bindCarouselControls(partnersSwiper, "#partnersSwiper");
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
