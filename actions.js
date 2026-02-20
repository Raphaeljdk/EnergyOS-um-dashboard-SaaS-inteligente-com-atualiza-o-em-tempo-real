/* =====================================================
   ACTIONS MODULE — UI Interactions
===================================================== */

export function initActions(options = {}) {
  const config = {
    scrollTarget: "#planos",
    demoUrl: "/demo.html",
    checkoutBase: "/checkout.html",
    ...options
  };

  const state = {
    listeners: []
  };

  initSmoothScroll(config, state);
  initDelegatedClicks(config, state);

  return function destroyActions() {
    state.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });

    state.listeners = [];
  };
}

/* ============================= */
/*  SCROLL SUAVE */
/* ============================= */

function initSmoothScroll(config, state) {
  const startBtn = document.querySelector("#startBtn");
  if (!startBtn) return;

  const handler = (e) => {
    e.preventDefault();

    const section = document.querySelector(config.scrollTarget);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  startBtn.addEventListener("click", handler);

  state.listeners.push({
    target: startBtn,
    event: "click",
    handler
  });
}

/* ============================= */
/*  EVENT DELEGATION */
/* ============================= */

function initDelegatedClicks(config, state) {
  const handler = (e) => {
    const target = e.target.closest("button, a");
    if (!target) return;

    if (target.matches("#freeTrialBtn, #ctaBtn")) {
      e.preventDefault();
      openSignupModal();
    }

    if (target.matches("#demoBtn")) {
      e.preventDefault();
      window.location.href = config.demoUrl;
    }

    if (target.matches(".plan-btn")) {
      e.preventDefault();
      simulateCheckout(target.dataset.plan, target, config);
    }
  };

  document.addEventListener("click", handler);

  state.listeners.push({
    target: document,
    event: "click",
    handler
  });
}

/* ============================= */
/*  MODAL */
/* ============================= */

let activeModal = null;

function openSignupModal() {
  if (activeModal) return;

  activeModal = createModal();
  document.body.appendChild(activeModal);
  document.body.style.overflow = "hidden";

  const close = () => closeModal();

  activeModal.addEventListener("click", (e) => {
    if (e.target === activeModal) close();
  });

  activeModal.querySelector("[data-close]")
    .addEventListener("click", close);

  activeModal.querySelector("form")
    .addEventListener("submit", handleSignup);
}

function closeModal() {
  if (!activeModal) return;

  activeModal.remove();
  document.body.style.overflow = "";
  activeModal = null;
}

function createModal() {
  const modal = document.createElement("div");

  modal.className =
    "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";

  modal.innerHTML = `
    <div class="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
      <button data-close
        class="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
        ✕
      </button>

      <h3 class="text-2xl font-bold mb-4">Criar Conta Gratuita</h3>

      <p class="text-slate-500 text-sm mb-6">
        Comece a reduzir seus custos agora.
      </p>

      <form class="space-y-4">
        <input type="text" placeholder="Nome" required
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500">

        <input type="email" placeholder="Email" required
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500">

        <button type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition">
          Criar Conta
        </button>
      </form>
    </div>
  `;

  return modal;
}

function handleSignup(e) {
  e.preventDefault();

  const btn = e.target.querySelector("button");
  btn.textContent = "Criando...";
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = "Conta criada ✓";
    btn.classList.replace("bg-green-500", "bg-emerald-600");

    setTimeout(closeModal, 1200);
  }, 1500);
}

/* ============================= */
/*  CHECKOUT */
/* ============================= */

function simulateCheckout(plan, button, config) {
  if (!plan) return;

  button.textContent = "Processando...";
  button.disabled = true;

  setTimeout(() => {
    window.location.href =
      `${config.checkoutBase}?plan=${encodeURIComponent(plan)}`;
  }, 1000);
}
export function animateKPI(id, value) {
  const el = document.getElementById(id);
  el.textContent = value;
}

export function updateCharts(kpis) {
  // aqui você atualizaria seus charts
}

export function renderAlerts(alerts) {
  const ul = document.getElementById('alertsList');
  ul.innerHTML = "";
  alerts.slice(-5).forEach(alert => {
    const li = document.createElement('li');
    li.className = `bg-[#0F172A] p-4 rounded-xl border border-white/10 flex justify-between items-center`;
    li.innerHTML = `<div>${alert.message}</div><span class="${alert.color} font-semibold">${alert.level}</span>`;
    ul.appendChild(li);
  });
}
export function animateKPI(id, value) {
  const el = document.getElementById(id);
  if(el) el.textContent = typeof value === 'number' ? value.toFixed(2) : value;
}

export function renderAlerts(alerts) {
  const ul = document.getElementById('alertsList');
  if(!ul) return;
  ul.innerHTML = "";
  alerts.slice(-5).forEach(alert => {
    const li = document.createElement('li');
    li.className = `bg-[#0F172A] p-4 rounded-xl border border-white/10 flex justify-between items-center`;
    li.innerHTML = `<div>${alert.message}</div><span class="${alert.color} font-semibold">${alert.level}</span>`;
    ul.appendChild(li);
  });
}