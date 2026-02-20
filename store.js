/* =====================================================
   GLOBAL STORE — Lightweight Reactive State Manager
===================================================== */

const initialState = Object.freeze({
  user: null,
  environment: null,
  loading: false,
  simulation: null,
  plan: "free",
  simulationCount: 0
});

let state = { ...initialState };

const listeners = new Set();

/* ============================= */
/* Core */
/* ============================= */

export function getState() {
  return { ...state }; // evita mutação externa
}

export function setState(partial) {
  if (typeof partial !== "object") return;

  const nextState = { ...state, ...partial };

  if (shallowEqual(state, nextState)) return;

  state = nextState;
  notify();
}

export function resetState() {
  state = { ...initialState };
  notify();
}

/* ============================= */
/* Subscription */
/* ============================= */

export function subscribe(listener) {
  if (typeof listener !== "function") return;

  listeners.add(listener);

  // retorna função de unsubscribe
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach(listener => {
    try {
      listener(getState());
    } catch (error) {
      console.error("[Store] Listener error:", error);
    }
  });
}

/* ============================= */
/* Utils */
/* ============================= */

function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
// estado global
export const store = {
  kpis: { consumption: 0, efficiency: 0, cost: 0, alerts: 0 },
  alerts: [],
  subscribers: [],
  subscribe(fn) { this.subscribers.push(fn); },
  notify() { this.subscribers.forEach(fn => fn(this)); }
};
