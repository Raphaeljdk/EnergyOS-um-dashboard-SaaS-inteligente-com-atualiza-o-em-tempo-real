// /js/core/env.js

const hostname = window.location.hostname;
const searchParams = new URLSearchParams(window.location.search);

/* ============================= */
/* Environment Map */
/* ============================= */

const ENVIRONMENTS = Object.freeze({
  development: {
    apiBaseUrl: "http://localhost:5500",
    debug: true,
    logLevel: "verbose"
  },
  staging: {
    apiBaseUrl: "https://staging-api.seusite.com",
    debug: true,
    logLevel: "info"
  },
  production: {
    apiBaseUrl: "https://api.seusite.com",
    debug: false,
    logLevel: "error"
  }
});

/* ============================= */
/* Mode Detection */
/* ============================= */

function detectByHostname() {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "development";
  }

  if (hostname.includes("staging")) {
    return "staging";
  }

  return "production";
}

/**
 * Permite override via:
 * - ?env=staging
 * - localStorage.setItem("app_env", "staging")
 */
function detectOverride() {
  const queryOverride = searchParams.get("env");
  const storageOverride = localStorage.getItem("app_env");

  const candidate = queryOverride || storageOverride;

  if (candidate && ENVIRONMENTS[candidate]) {
    console.warn(`[ENV] Overridden to "${candidate}"`);
    return candidate;
  }

  return null;
}

function resolveMode() {
  return detectOverride() || detectByHostname();
}

/* ============================= */
/* Final ENV Object */
/* ============================= */

const mode = resolveMode();

if (!ENVIRONMENTS[mode]) {
  throw new Error(`[ENV] Invalid environment mode: ${mode}`);
}

export const ENV = Object.freeze({
  mode,
  ...ENVIRONMENTS[mode],

  isDev: mode === "development",
  isProd: mode === "production",
  isStaging: mode === "staging",

  /**
   * Helper para logs controlados por ambiente
   */
  log(...args) {
    if (ENVIRONMENTS[mode].debug) {
      console.log(`[${mode.toUpperCase()}]`, ...args);
    }
  }
});