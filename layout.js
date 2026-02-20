/* =====================================================
   UI MODULE — Core Interface System
===================================================== */

export function initUI(options = {}) {
  const config = {
    themeToggle: "#themeToggle",
    header: ".header",
    navLinks: ".nav a",
    sections: "section[id]",
    animated: ".fade-in, .slide-in",
    ...options
  };

  const state = {
    observers: [],
    listeners: []
  };

  initTheme(config, state);
  initHeaderEffect(config, state);
  initScrollSpy(config, state);
  initAnimations(config, state);

  // SPA-ready cleanup
  return function destroyUI() {
    state.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });

    state.observers.forEach(observer => observer.disconnect());

    state.listeners = [];
    state.observers = [];
  };
}

/* ================= THEME ================= */

function initTheme(config, state) {
  const toggle = document.querySelector(config.themeToggle);
  if (!toggle) return;

  const storedTheme = getStoredTheme();
  applyTheme(storedTheme, toggle);

  const handler = () => {
    const isDark = document.body.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    applyTheme(newTheme, toggle);
  };

  toggle.addEventListener("click", handler);

  state.listeners.push({
    target: toggle,
    event: "click",
    handler
  });
}

function applyTheme(theme, toggle) {
  document.body.classList.toggle("dark", theme === "dark");

  if (toggle) {
    toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  localStorage.setItem("theme", theme);
}

function getStoredTheme() {
  return localStorage.getItem("theme") || "light";
}

/* ================= HEADER EFFECT ================= */

function initHeaderEffect(config, state) {
  const header = document.querySelector(config.header);
  if (!header) return;

  const onScroll = throttle(() => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }, 100);

  window.addEventListener("scroll", onScroll, { passive: true });

  state.listeners.push({
    target: window,
    event: "scroll",
    handler: onScroll
  });
}

/* ================= SCROLL SPY ================= */

function initScrollSpy(config, state) {
  const sections = document.querySelectorAll(config.sections);
  const navLinks = document.querySelectorAll(config.navLinks);

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach(section => observer.observe(section));

  state.observers.push(observer);
}

/* ================= ANIMATIONS ================= */

function initAnimations(config, state) {
  const elements = document.querySelectorAll(config.animated);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach(el => observer.observe(el));

  state.observers.push(observer);
}

/* ================= UTIL ================= */

function throttle(fn, delay) {
  let lastCall = 0;

  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}