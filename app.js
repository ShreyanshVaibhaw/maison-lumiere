/* Maison Lumière — progressive enhancement only. Content lives in HTML. */
(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close menu when a link is chosen (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var triggers = document.querySelectorAll("[data-lightbox]");

  if (lightbox && triggers.length) {
    var stage = lightbox.querySelector(".lightbox-stage");
    var caption = lightbox.querySelector(".lightbox-caption");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var lastFocused = null;

    function openLightbox(trigger) {
      lastFocused = trigger;
      var art = trigger.querySelector("svg, img");
      var label = trigger.getAttribute("data-caption") || "";
      if (stage && art) {
        stage.innerHTML = "";
        stage.appendChild(art.cloneNode(true));
      }
      if (caption) { caption.textContent = label; }
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (closeBtn) { closeBtn.focus(); }
    }

    function closeLightbox() {
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) { lastFocused.focus(); }
    }

    triggers.forEach(function (t) {
      t.addEventListener("click", function () { openLightbox(t); });
    });

    if (closeBtn) { closeBtn.addEventListener("click", closeLightbox); }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) { closeLightbox(); }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
        closeLightbox();
      }
    });
  }

  /* ---------- Scroll reveal (reduced-motion aware) ---------- */
  var revealables = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealables.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Forms: graceful client confirmation (no backend) ---------- */
  var forms = document.querySelectorAll("form[data-confirm]");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-status");
      if (note) {
        note.hidden = false;
        note.textContent = form.getAttribute("data-confirm");
        note.focus();
      }
      form.reset();
    });
  });

  /* ---------- Current year in footer ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  var year = String(new Date().getFullYear());
  yearEls.forEach(function (el) { el.textContent = year; });
})();
