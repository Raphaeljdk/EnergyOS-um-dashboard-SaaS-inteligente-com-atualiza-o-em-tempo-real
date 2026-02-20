/* =====================================================
   AC SaaS — Application Bootstrap
===================================================== */

import { initUI } from "./layout.js";
import { initSimulator } from "./simulator.js";
import { fetchData } from "./api.js";
import { renderBenefits, renderCases } from "./interface.js";

/* ============================= */
/*  ENTRY POINT */
/* ============================= */

document.addEventListener("DOMContentLoaded", bootstrapApp);

async function bootstrapApp() {
  console.log("Inicializando aplicação...");

  try {
    initializeCore();
    await initializeDataLayer();

    console.log("App iniciada com sucesso 🚀");

  } catch (error) {
    handleFatalError(error);
  }
}

/* ============================= */
/*  CORE INIT */
/* ============================= */

function initializeCore() {
  safeInit(initUI);
  safeInit(initSimulator);
}

/* ============================= */
/*  DATA LAYER */
/* ============================= */

async function initializeDataLayer() {
  showLoading(true);

  try {
    const data = await fetchData();

    validateData(data);

    renderBenefits(data.benefits ?? []);
    renderCases(data.cases ?? []);

  } finally {
    showLoading(false);
  }
}

/* ============================= */
/*  SAFE INIT */
/* ============================= */

function safeInit(initFn) {
  if (typeof initFn !== "function") return;

  try {
    initFn();
  } catch (error) {
    console.error("Erro ao iniciar módulo:", error);
  }
}

/* ============================= */
/*  DATA VALIDATION */
/* ============================= */

function validateData(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Formato de dados inválido.");
  }
}

/* ============================= */
/*  LOADING CONTROL */
/* ============================= */

function showLoading(state) {
  document.documentElement.classList.toggle("is-loading", state);
}

/* ============================= */
/*  ERROR HANDLING */
/* ============================= */

function handleFatalError(error) {
  console.error("Erro crítico na aplicação:", error);

  renderFatalUI();
}

function renderFatalUI() {
  const root = document.querySelector("main");

  if (!root) return;

  root.innerHTML = `
    <section class="app-error">
      <h2>Erro ao carregar aplicação</h2>
      <p>Verifique sua conexão ou tente novamente.</p>
      <button id="reloadApp">Recarregar</button>
    </section>
  `;

  document
    .querySelector("#reloadApp")
    ?.addEventListener("click", () => location.reload());
}