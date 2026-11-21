/* Metta Coffee — shared site scripts (every page) */

/* ---------- Top navigation: "Menu" button ---------- */
(() => {
  const header = document.querySelector(".site-header");
  const toggle = header.querySelector(".nav-pill--wander");
  const menu = document.getElementById("wander-menu");
  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    menu.hidden = !open;
  };
  toggle.addEventListener("click", () => setOpen(menu.hidden));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !header.querySelector(".site-header__panel").contains(e.target)) setOpen(false);
  });
  header.addEventListener("focusout", (e) => {
    if (!menu.hidden && e.relatedTarget && !header.contains(e.relatedTarget)) setOpen(false);
  });
  // On phones the header is sticky; give it a solid bar once the page has scrolled
  const stuck = () => header.classList.toggle("is-stuck", window.scrollY > 4);
  window.addEventListener("scroll", stuck, { passive: true });
  stuck();
})();

/* ---------- Site credit pop-up (opened from the footer) ---------- */
(() => {
  const trigger = document.querySelector(".site-footer__credit");
  const panel = document.getElementById("site-credit");
  if (!trigger || !panel) return;
  const close = panel.querySelector(".site-credit__close");
  const setOpen = (open) => {
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", open);
    (open ? close : trigger).focus({ preventScroll: true });
  };
  trigger.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) setOpen(false);
  });
})();

/* ---------- Light / dark theme switch (footer) ---------- */
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sync = () => {
    const dark = root.dataset.theme === "dark";
    toggle.setAttribute("aria-checked", dark);
  };
  let fadeTimer;
  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    if (!reduce) {
      root.classList.add("theme-fading");
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => root.classList.remove("theme-fading"), 850);
    }
    if (next === "dark") root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try { localStorage.setItem("metta-theme", next); } catch (e) { /* storage blocked: still switches */ }
    sync();
  });
  sync();
})();

/* ---------- Scroll reveal: sections fade up as they come on screen ---------- */
(() => {
  if (!("IntersectionObserver" in window)) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Single pieces fade up on their own; groups fade up one after another
  const singles = [
    // Home
    ".about__intro", ".about__visit", ".carousel", ".drinks__scroller", ".drinks__info",
    ".story__text", ".story__media", ".makers-band__title", ".makers-band__rule", ".makers-band__text",
    ".spotlight", ".follow__aside",
    // Beans
    ".ordering__title", ".ordering__text", ".blends", ".where__media", ".where__text",
    ".origins__title", ".origins__stage",
    // Contact
    ".contact-form",
    // Events
    ".events__month",
    // Makers
    ".makers-photos:not(.about-photo)", ".consign__title", ".consign__text", ".host__media", ".host__body",
    ".faq__title", ".faq__group-title", ".faq__item",
    // About
    ".about-photo", ".about-story__title", ".about-story__body > p", ".about-cards", ".about-closing", ".about-ctas",
  ];
  const groups = [".follow__feed > li", ".beans-row > li", ".menu-grid > li", ".events__list > li", ".consign__cols > li"];

  const targets = new Map();                       // element -> stagger index
  singles.forEach((sel) => document.querySelectorAll(sel).forEach((el) => targets.set(el, 0)));
  groups.forEach((sel) => document.querySelectorAll(sel).forEach((el) => {
    const i = [...el.parentElement.children].indexOf(el);
    targets.set(el, i % 4);                        // rows of up to 4 ripple left to right
  }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      el.classList.add("is-revealed");
      el.addEventListener("animationend", function done(e) {
        if (e.target !== el) return;
        el.removeEventListener("animationend", done);
        el.classList.remove("reveal", "is-revealed");
        el.style.removeProperty("--reveal-i");
      });
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  targets.forEach((i, el) => {
    const r = el.getBoundingClientRect();
    const showing = el.offsetParent !== null && r.top < innerHeight && r.bottom > 0;
    if (showing) return;                           // already on screen at load: leave it alone
    el.classList.add("reveal");
    if (i) el.style.setProperty("--reveal-i", i);
    io.observe(el);
  });
})();
