/* Metta Coffee — shared site scripts (every page) */

/* ---------- Top navigation: "Wander" menu ---------- */
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
