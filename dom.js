// /js/core/dom.js

/* ============================= */
/* Selectors */
/* ============================= */

export function $(selector, scope = document) {
  if (!selector) return null;

  if (selector instanceof Element) return selector;

  const el = scope.querySelector(selector);

  if (!el) {
    console.warn(`[DOM] Element not found: ${selector}`);
  }

  return el;
}

export function $$(selector, scope = document) {
  if (!selector) return [];
  return Array.from(scope.querySelectorAll(selector));
}

/* ============================= */
/* Events */
/* ============================= */

export function on(target, event, handler, options = {}) {
  const el = $(target);
  if (!el) return;

  el.addEventListener(event, handler, options);
}

export function off(target, event, handler, options = {}) {
  const el = $(target);
  if (!el) return;

  el.removeEventListener(event, handler, options);
}

/**
 * Delegação de eventos (muito usado em SaaS)
 */
export function delegate(parent, selector, event, handler) {
  const el = $(parent);
  if (!el) return;

  el.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && el.contains(target)) {
      handler(e, target);
    }
  });
}

/* ============================= */
/* Content */
/* ============================= */

export function setText(target, value) {
  const el = $(target);
  if (!el) return;

  el.textContent = value ?? "";
}

/**
 * ⚠️ Use com cuidado (XSS)
 */
export function setHTML(target, html, { sanitize = false } = {}) {
  const el = $(target);
  if (!el) return;

  if (sanitize) {
    el.textContent = html ?? "";
  } else {
    el.innerHTML = html ?? "";
  }
}

/* ============================= */
/* Visibility */
/* ============================= */

export function show(target, display = "block") {
  const el = $(target);
  if (!el) return;

  el.style.display = display;
}

export function hide(target) {
  const el = $(target);
  if (!el) return;

  el.style.display = "none";
}

export function toggle(target, force) {
  const el = $(target);
  if (!el) return;

  const isHidden = getComputedStyle(el).display === "none";

  if (typeof force === "boolean") {
    el.style.display = force ? "block" : "none";
  } else {
    el.style.display = isHidden ? "block" : "none";
  }
}

/* ============================= */
/* Classes */
/* ============================= */

export function addClass(target, className) {
  const el = $(target);
  if (!el) return;

  el.classList.add(className);
}

export function removeClass(target, className) {
  const el = $(target);
  if (!el) return;

  el.classList.remove(className);
}

export function toggleClass(target, className, force) {
  const el = $(target);
  if (!el) return;

  el.classList.toggle(className, force);
}

/* ============================= */
/* Create */
/* ============================= */

export function create(tag, options = {}) {
  const el = document.createElement(tag);

  const {
    id,
    className,
    text,
    html,
    attrs = {},
    dataset = {}
  } = options;

  if (id) el.id = id;
  if (className) el.className = className;
  if (text) el.textContent = text;
  if (html) el.innerHTML = html;

  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  Object.entries(dataset).forEach(([key, value]) => {
    el.dataset[key] = value;
  });

  return el;
}

/* ============================= */
/* Utilities */
/* ============================= */

export function ready(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}