/* =====================================================
   MAIN ENTRY — Application Bootstrap
===================================================== */

import { initNavbar } from "./modules/navbar/navbar.js";
import { initSimulator } from "./modules/simulator/simulator.js";
import { initActions } from "./modules/actions.js";
import { initAnimations } from "./modules/interface.js";
// import { initAuth } from "./modules/auth.module.js";
// import { initUI } from "./modules/ui.module.js";

const modules = [];

document.addEventListener("DOMContentLoaded", bootstrap);

/* ============================= */
/*  BOOTSTRAP */
/* ============================= */

function bootstrap() {
  console.log("App iniciando...");

  safeInit(initNavbar);
  safeInit(initSimulator);
  safeInit(initActions);
  safeInit(initAnimations);

  console.log("App carregado com sucesso");
}

/* ============================= */
/*  SAFE INIT */
/* ============================= */

function safeInit(initFn) {
  if (typeof initFn !== "function") return;

  try {
    const destroy = initFn();

    if (typeof destroy === "function") {
      modules.push(destroy);
    }

  } catch (error) {
    console.error("Erro ao iniciar módulo:", error);
  }
}

/* ============================= */
/*  GLOBAL CLEANUP (SPA-ready) */
/* ============================= */

export function destroyApp() {
  modules.forEach(destroy => destroy());
  modules.length = 0;
}
/* =====================================================
   MAIN LOADER — Page Router
===================================================== */

document.addEventListener("DOMContentLoaded", loadPage);

async function loadPage() {
  const page = document.body.dataset.page;

  try {
    switch (page) {

      case "home":
        await import("./pages/index.page.js");
        break;

      case "dashboard":
        await import("./pages/dash.page.js");
        break;

      default:
        console.warn("Página não reconhecida:", page);
    }

  } catch (error) {
    console.error("Erro ao carregar página:", error);
  }
}
const ctx = document.getElementById('economyChart');

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('economyChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr'],
      datasets: [{
        label: 'Economia',
        data: [1200, 1900, 1500, 2200],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        tension: 0.4
      }]
    }
  });
});
import { initDashboard } from './modules/dashboard/dashboard.js';
import { startSimulation } from './modules/simulator/simulator.js';
import { store } from './core/store.js';
import { renderAlerts, animateKPI } from './modules/ui/actions.js';

const loginModal = document.getElementById('loginModal');
const app = document.getElementById('app');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

loginBtn.addEventListener('click', () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if(user === 'admin' && pass === 'admin123') {
    loginModal.classList.add('hidden');
    app.classList.remove('hidden');
    initDashboard();
    startSimulation();
  } else {
    alert('Usuário ou senha inválidos!');
  }
});

logoutBtn.addEventListener('click', () => {
  app.classList.add('hidden');
  loginModal.classList.remove('hidden');
});

// Dashboard navigation
document.querySelectorAll('[data-dashboard]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-dashboard');
    document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
    document.getElementById(target).classList.remove('hidden');
  });
});