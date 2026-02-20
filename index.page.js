// /js/pages/index.page.js

import { ready } from "/js/core/dom.js";
import { ENV } from "/js/core/env.js";
import { initNavbar } from "/js/modules/navbar/navbar.js";
// importe outros módulos se existirem:
// import { initHero } from "/js/modules/hero/hero.js";
// import { initSimulator } from "/js/modules/simulator/simulator.js";

let destroyNavbar = null;
let destroyModules = [];

/* ============================= */
/* Bootstrap */
/* ============================= */

function bootstrap() {
  try {
    ENV.log("Bootstrapping Index page...");

    initLayout();
    initModules();
    initTracking();
  } catch (error) {
    console.error("[IndexPage] Bootstrap failed:", error);
    failSafe();
  }
}

/* ============================= */
/* Setup */
/* ============================= */

function initLayout() {
  destroyNavbar = initNavbar({
    selector: "header",
    offset: 20
  });
}

function initModules() {
  // Exemplo futuro:
  // const destroyHero = initHero();
  // const destroySimulator = initSimulator();

  // destroyModules.push(destroyHero, destroySimulator);
}

function initTracking() {
  if (ENV.isDev) return;

  // Espaço para analytics no futuro
  // analytics.trackPage("home");
}

/* ============================= */
/* Cleanup (SPA-ready) */
/* ============================= */

export function destroy() {
  if (destroyNavbar) {
    destroyNavbar();
  }

  destroyModules.forEach((destroyFn) => {
    if (typeof destroyFn === "function") {
      destroyFn();
    }
  });

  destroyModules = [];

  ENV.log("Index page destroyed");
}

/* ============================= */
/* Fallback */
/* ============================= */

function failSafe() {
  // Aqui você pode mostrar uma UI de erro no futuro
  console.warn("[IndexPage] Fail-safe triggered");
}

/* ============================= */
/* Start */
/* ============================= */

ready(bootstrap);

import { initUI } from "../layout.js";
import { initSimulator } from "../simulator.js";

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initSimulator();
});