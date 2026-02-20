// /js/modules/loading/loading.js

import { setState } from "./store.js";

let loaderElement = null;
let activeRequests = 0;

export function initLoading(options = {}) {
  const config = {
    selector: "#globalLoader",
    visibleClass: "visible",
    ...options
  };

  loaderElement = document.querySelector(config.selector);

  return {
    show: () => show(config),
    hide: () => hide(config),
    reset
  };
}

/* ============================= */
/* Core Logic */
/* ============================= */

function show(config) {
  activeRequests++;

  if (activeRequests === 1) {
    setState({ loading: true });
    toggleLoader(true, config);
  }
}

function hide(config) {
  if (activeRequests === 0) return;

  activeRequests--;

  if (activeRequests === 0) {
    setState({ loading: false });
    toggleLoader(false, config);
  }
}

function reset() {
  activeRequests = 0;
  setState({ loading: false });

  if (loaderElement) {
    loaderElement.classList.remove("visible");
  }
}

function toggleLoader(visible, config) {
  if (!loaderElement) return;

  loaderElement.classList.toggle(
    config.visibleClass,
    visible
  );
}