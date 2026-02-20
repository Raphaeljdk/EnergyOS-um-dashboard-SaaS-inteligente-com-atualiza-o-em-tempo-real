// /js/modules/simulator/simulator.js

const STORAGE_KEY = "lastSimulation";

export function initSimulator(options = {}) {
  const config = {
    button: "#calcBtn",
    areaInput: "#area",
    horasInput: "#horas",
    result: ".result",
    chartCanvas: "#economyChart",
    ...options
  };

  const elements = cacheElements(config);
  if (!elements.button) return () => {};

  let chartInstance = null;

  const handleClick = () => {
    const values = getInputValues(elements);

    if (!isValidInput(values)) {
      renderError(elements.result, "Preencha valores válidos.");
      return;
    }

    const calculation = calculate(values);

    renderAnimation(elements.result, calculation);
    saveSimulation(calculation);

    if (elements.chartCanvas && window.Chart) {
      chartInstance = renderChart(
        elements.chartCanvas,
        calculation,
        chartInstance
      );
    }
  };

  elements.button.addEventListener("click", handleClick);

  // Retorna destroy (SPA-ready)
  return function destroy() {
    elements.button.removeEventListener("click", handleClick);
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  };
}

/* ================================= */
/* Elementos */
/* ================================= */

function cacheElements(config) {
  return {
    button: document.querySelector(config.button),
    areaInput: document.querySelector(config.areaInput),
    horasInput: document.querySelector(config.horasInput),
    result: document.querySelector(config.result),
    chartCanvas: document.querySelector(config.chartCanvas)
  };
}

/* ================================= */
/* Validação */
/* ================================= */

function getInputValues({ areaInput, horasInput }) {
  return {
    area: parseFloat(areaInput?.value),
    horas: parseFloat(horasInput?.value)
  };
}

function isValidInput({ area, horas }) {
  return (
    Number.isFinite(area) &&
    Number.isFinite(horas) &&
    area > 0 &&
    horas > 0
  );
}

/* ================================= */
/* Cálculo */
/* ================================= */

function calculate({ area, horas }) {
  const consumoMensal = area * horas * 30 * 0.12;
  const custoMensal = consumoMensal * 0.9;
  const economiaMensal = custoMensal * 0.25;
  const economiaAnual = economiaMensal * 12;

  return {
    economiaMensal,
    economiaAnual
  };
}

/* ================================= */
/* UI */
/* ================================= */

function renderError(element, message) {
  if (!element) return;

  element.textContent = message;
  element.classList.add("text-red-400");
}

function renderAnimation(element, { economiaMensal, economiaAnual }) {
  if (!element) return;

  element.classList.remove("text-red-400");

  const duration = 1200;
  const startTime = performance.now();

  function update(time) {
    const progress = Math.min((time - startTime) / duration, 1);

    const mensal = economiaMensal * progress;
    const anual = economiaAnual * progress;

    element.innerHTML = `
      Economia mensal: ${formatCurrency(mensal)} <br>
      Economia anual: ${formatCurrency(anual)}
    `;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ================================= */
/* Chart */
/* ================================= */

function renderChart(canvas, { economiaMensal, economiaAnual }, oldChart) {
  if (oldChart) {
    oldChart.destroy();
  }

  return new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Mensal", "Anual"],
      datasets: [{
        label: "Economia (R$)",
        data: [economiaMensal, economiaAnual]
      }]
    },
    options: {
      responsive: true,
      animation: false
    }
  });
}

/* ================================= */
/* Storage */
/* ================================= */

function saveSimulation(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("[Simulation] Failed to save:", error);
  }
}

export function loadLastSimulation(target) {
  const element = resolveElement(target);
  if (!element) return;

  const simulation = getLastSimulation();
  if (!simulation) return;

  element.textContent =
    `Última economia: ${formatCurrency(simulation.economiaMensal)} / mês`;
}

function getLastSimulation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!isValidSimulation(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

function isValidSimulation(data) {
  return (
    data &&
    typeof data.economiaMensal === "number" &&
    Number.isFinite(data.economiaMensal)
  );
}

/* ================================= */
/* Utils */
/* ================================= */

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function resolveElement(target) {
  if (!target) return null;
  if (target instanceof Element) return target;
  return document.querySelector(target);
}
import { store } from '../core/store.js';

export function startSimulation() {
  setInterval(() => {
    store.kpis.consumption = (1 + Math.random() * 0.5).toFixed(2);
    store.kpis.efficiency = (90 + Math.random()*5).toFixed(1);
    store.kpis.cost = (450000 + Math.random()*50000).toFixed(0);
    
    // novos alertas aleatórios
    if(Math.random() < 0.3) {
      store.alerts.push({ message: "Alerta aleatório gerado", level: "Alerta", color: "text-yellow-400" });
    }

    store.notify();
  }, 3000);
}
import { store } from '../../core/store.js';

export function startSimulation() {
  setInterval(() => {
    store.kpis.consumption = (1 + Math.random() * 0.5).toFixed(2);
    store.kpis.efficiency = (90 + Math.random()*5).toFixed(1);
    store.kpis.cost = (450000 + Math.random()*50000).toFixed(0);

    if(Math.random() < 0.3) {
      store.alerts.push({ message: "Alerta aleatório gerado", level: "Alerta", color: "text-yellow-400" });
    }

    store.notify();
  }, 3000);
}