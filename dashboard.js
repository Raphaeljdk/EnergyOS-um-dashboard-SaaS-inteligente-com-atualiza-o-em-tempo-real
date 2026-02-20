// dashboard.js
import { getState } from "/js/store.js";

export class Dashboard {
  constructor(options = {}) {
    this.redirectUrl = options.redirectUrl || "/index.html";
    this.user = null;
    this.elements = {};
  }

  init() {
    try {
      this.loadUser();
      this.cacheElements();
      this.bindEvents();
      this.render();
    } catch (error) {
      console.error("[Dashboard] Initialization error:", error);
      this.handleFatalError();
    }
  }

  loadUser() {
    const state = getState();
    this.user = state?.user || null;

    if (!this.user) {
      this.redirectToLogin();
    }
  }

  cacheElements() {
    this.elements.userName = document.querySelector("#userName");
    this.elements.logoutBtn = document.querySelector("#logoutBtn");
  }

  bindEvents() {
    if (this.elements.logoutBtn) {
      this.elements.logoutBtn.addEventListener("click", () => {
        this.handleLogout();
      });
    }
  }

  render() {
    this.renderUser();
  }

  renderUser() {
    if (this.elements.userName && this.user?.name) {
      this.elements.userName.textContent = this.user.name;
    }
  }

  handleLogout() {
    // Aqui você pode limpar store, token etc.
    localStorage.clear();
    window.location.href = this.redirectUrl;
  }

  redirectToLogin() {
    window.location.href = this.redirectUrl;
    throw new Error("User not authenticated");
  }

  handleFatalError() {
    window.location.href = this.redirectUrl;
  }
}
import { $, setText } from "/js/core/dom.js";

const el = $("#userName");
setText(el, user.name);
import { store } from '../../core/store.js';
import { updateCharts, animateKPI } from '../ui/actions.js';

export function initDashboard() {
  store.subscribe((state) => {
    animateKPI('totalConsumption', state.kpis.consumption);
    animateKPI('efficiency', state.kpis.efficiency);
    animateKPI('cost', state.kpis.cost);
    document.getElementById('alertsCount').textContent = state.kpis.alerts + " críticos";
    updateCharts(state.kpis);
    renderAlerts(state.alerts);
  });
}
import { store } from '../../core/store.js';
import { renderAlerts, animateKPI } from '../ui/actions.js';

export function initDashboard() {
  const overviewEl = document.getElementById('overview');
  const financeEl = document.getElementById('finance');
  const alertsEl = document.getElementById('alerts');
  const plansEl = document.getElementById('plans');

  // Inicializa templates simples
  overviewEl.innerHTML = `
    <h2 class="text-3xl font-semibold mb-6">Executive Overview</h2>
    <div id="kpis" class="grid md:grid-cols-4 gap-6 mb-10">
      <div>Consumo Total: <span id="totalConsumption">0 GWh</span></div>
      <div>Eficiência: <span id="efficiency">0%</span></div>
      <div>Custo: <span id="cost">R$0</span></div>
      <div>Alertas: <span id="alertsCount">0 críticos</span></div>
    </div>
    <canvas id="overviewChart" height="120"></canvas>
  `;

  financeEl.innerHTML = `<h2 class="text-3xl font-semibold mb-6">Financeiro</h2>
    <canvas id="financeChart" height="120"></canvas>`;

  alertsEl.innerHTML = `<h2 class="text-3xl font-semibold mb-6">Alertas em Tempo Real</h2>
    <ul id="alertsList" class="space-y-4"></ul>`;

  plansEl.innerHTML = `<h2 class="text-3xl font-semibold mb-6">Planos & Consultoria</h2>
    <p class="text-white/70">Consultoria especializada para reduzir custos e aumentar eficiência.</p>`;

  store.subscribe((state) => {
    animateKPI('totalConsumption', state.kpis.consumption);
    animateKPI('efficiency', state.kpis.efficiency);
    animateKPI('cost', state.kpis.cost);
    document.getElementById('alertsCount').textContent = state.alerts.length + " críticos";
    renderAlerts(state.alerts);
  });
}

// dashboard.js

// Exemplo de dados iniciais
let overviewData = {
    users: 1200,
    revenue: 5400,
    sales: 320,
};

let financeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [500, 700, 800, 600, 900, 1200],
};

// Função para atualizar os dados simulando "valores em tempo real"
function updateData() {
    // Atualiza overview
    overviewData.users += Math.floor(Math.random() * 10 - 5);
    overviewData.revenue += Math.floor(Math.random() * 200 - 100);
    overviewData.sales += Math.floor(Math.random() * 10 - 5);

    document.getElementById("users").innerText = overviewData.users;
    document.getElementById("revenue").innerText = "$" + overviewData.revenue;
    document.getElementById("sales").innerText = overviewData.sales;

    // Atualiza gráfico financeiro
    financeData.values = financeData.values.map(v => v + Math.floor(Math.random() * 100 - 50));
    financeChart.data.datasets[0].data = financeData.values;
    financeChart.update("active"); // anima a atualização
}

// --- Chart.js ---
const ctxFinance = document.getElementById("financeChart").getContext("2d");

const financeChart = new Chart(ctxFinance, {
    type: "line",
    data: {
        labels: financeData.labels,
        datasets: [{
            label: "Receita Mensal",
            data: financeData.values,
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            tension: 0.4, // suaviza curva
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 800,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                display: true,
            }
        }
    }
});

// Atualiza a cada 2 segundos
setInterval(updateData, 2000);
