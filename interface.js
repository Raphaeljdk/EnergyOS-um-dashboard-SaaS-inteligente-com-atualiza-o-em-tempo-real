/* =====================================================
   INTERFACE MODULE — Dynamic Content Renderer
===================================================== */

export function initInterface(options = {}) {
  const config = {
    animationClass: "fade-in",
    animationThreshold: 0.2,
    ...options
  };

  const state = {
    observers: []
  };

  return {
    renderBenefits: (items) =>
      renderGrid("benefits-grid", items, benefitTemplate, config, state),

    renderCases: (items) =>
      renderGrid("cases-grid", items, caseTemplate, config, state),

    destroy: () => {
      state.observers.forEach(o => o.disconnect());
      state.observers = [];
    }
  };
}

/* ================= GENERIC RENDER ================= */

function renderGrid(id, items, template, config, state) {
  const container = document.getElementById(id);
  if (!container) return;

  clearContainer(container);

  if (!Array.isArray(items) || items.length === 0) {
    container.appendChild(createEmptyState());
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    fragment.appendChild(template(item, config));
  });

  container.appendChild(fragment);

  applyAnimations(container, config, state);
}

function clearContainer(container) {
  container.textContent = "";
}

function createEmptyState() {
  const p = document.createElement("p");
  p.className = "empty-state";
  p.textContent = "Nenhum item disponível no momento.";
  return p;
}

/* ================= TEMPLATES ================= */

function benefitTemplate(item, config) {
  return createCard({
    title: sanitize(item.title),
    description: sanitize(item.description),
    animationClass: config.animationClass
  });
}

function caseTemplate(item, config) {
  return createCard({
    title: sanitize(item.company),
    description: sanitize(item.description),
    highlight: true,
    animationClass: config.animationClass
  });
}

/* ================= CARD FACTORY ================= */

function createCard({
  title,
  description,
  highlight = false,
  animationClass
}) {
  const card = document.createElement("div");
  card.className = `card ${animationClass}`;

  if (highlight) {
    card.classList.add("case-card");
  }

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = description;

  card.appendChild(h3);
  card.appendChild(p);

  return card;
}

/* ================= ANIMATIONS ================= */

function applyAnimations(container, config, state) {
  const elements = container.querySelectorAll(`.${config.animationClass}`);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    { threshold: config.animationThreshold }
  );

  elements.forEach(el => observer.observe(el));

  state.observers.push(observer);
}

/* ================= SECURITY ================= */

function sanitize(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.textContent;
}