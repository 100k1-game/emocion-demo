(function () {
  "use strict";

  var VOLUME = 0.55;
  var FADE_MS = 900;

  function setVideoVolume(video) {
    video.volume = VOLUME;
  }

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

  function finish(loader, video) {
    if (loader.classList.contains("is-leaving")) return;

    var fill = document.getElementById("loading-bar-fill");
    var bar = document.querySelector(".loading-bar");
    if (fill) fill.style.width = "100%";
    if (bar) bar.setAttribute("aria-valuenow", "100");

    loader.classList.add("is-leaving");
    revealApp();

    window.setTimeout(function () {
      loader.classList.add("is-done");
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      startHeroVideo();
    }, FADE_MS);
  }

  function updateProgress(video) {
    var fill = document.getElementById("loading-bar-fill");
    var bar = document.querySelector(".loading-bar");
    if (!fill || !video.duration || !isFinite(video.duration)) return;
    var pct = Math.min(100, (video.currentTime / video.duration) * 100);
    fill.style.width = pct + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  function init() {
    var loader = document.getElementById("loading-screen");
    var video = document.getElementById("loading-video");
    if (!loader || !video) {
      revealApp();
      startHeroVideo();
      return;
    }

    document.body.classList.add("is-loading");

    video.playsInline = true;
    video.preload = "auto";
    setVideoVolume(video);
    video.muted = false;

    video.addEventListener("playing", function () {
      setVideoVolume(video);
    });

    video.addEventListener("timeupdate", function () {
      updateProgress(video);
    });

    video.addEventListener("loadedmetadata", function () {
      updateProgress(video);
    });

    video.addEventListener("ended", function () {
      finish(loader, video);
    }, { once: true });

    video.addEventListener("error", function () {
      finish(loader, video);
    }, { once: true });

    video.play().then(function () {
      setVideoVolume(video);
      video.muted = false;
    }).catch(function () {
      video.muted = true;
      setVideoVolume(video);
      video.play().catch(function () {
        finish(loader, video);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
