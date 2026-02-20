// /js/pages/dash.page.js

import { ready } from "/js/core/dom.js";
import { ENV } from "/js/core/env.js";
import { Dashboard } from "/js/modules/dashboard/dashboard.js";
import { initNavbar } from "/js/modules/navbar/navbar.js";

let dashboardInstance = null;
let destroyNavbar = null;

/* ============================= */
/* Bootstrap */
/* ============================= */

function bootstrap() {
  try {
    ENV.log("Bootstrapping Dashboard page...");

    initLayout();
    initModules();
    initTracking();
  } catch (error) {
    console.error("[DashPage] Bootstrap failed:", error);
    failSafeRedirect();
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
  dashboardInstance = new Dashboard({
    redirectUrl: "/index.html"
  });

  dashboardInstance.init();
}

function initTracking() {
  if (ENV.isDev) return;

  // Espaço reservado para analytics futuramente
  // ex: analytics.trackPage("dashboard");
}

/* ============================= */
/* Cleanup (SPA future-proof) */
/* ============================= */

export function destroy() {
  if (dashboardInstance?.destroy) {
    dashboardInstance.destroy();
  }

  if (destroyNavbar) {
    destroyNavbar();
  }

  ENV.log("Dashboard page destroyed");
}

/* ============================= */
/* Fallback */
/* ============================= */

function failSafeRedirect() {
  window.location.href = "/index.html";
}

/* ============================= */
/* Start */
/* ============================= */

ready(bootstrap);

import { initNavbar } from "../modules/navbar/navbar.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
});