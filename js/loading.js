(function () {
  "use strict";

  var SPLASH_MS = 4200;
  var FADE_MS = 850;

  function revealApp() {
    document.body.classList.remove("is-loading");
    var app = document.getElementById("app");
    if (app) {
      app.classList.remove("is-hidden");
      app.classList.add("is-ready");
    }
  }

  function startHeroVideo() {
    var hero = document.getElementById("hero-video");
    if (!hero) return;
    hero.muted = true;
    hero.play().catch(function () {});
  }

  function finish(loader) {
    if (!loader || loader.classList.contains("is-leaving")) return;

    var bar = document.querySelector(".loading-bar");
    var fill = document.getElementById("loading-bar-fill");
    if (fill) fill.style.width = "100%";
    if (bar) bar.setAttribute("aria-valuenow", "100");

    loader.classList.add("is-leaving");
    revealApp();

    window.setTimeout(function () {
      loader.classList.add("is-done");
      startHeroVideo();
    }, FADE_MS);
  }

  function init() {
    var loader = document.getElementById("loading-screen");
    if (!loader) {
      revealApp();
      startHeroVideo();
      return;
    }

    document.body.classList.add("is-loading");
    document.documentElement.style.setProperty("--splash-duration", SPLASH_MS + "ms");

    window.setTimeout(function () {
      finish(loader);
    }, SPLASH_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
