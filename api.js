/* =====================================================
   DATA API SERVICE — Robust Fetch Layer
===================================================== */

const DEFAULT_CONFIG = {
  baseUrl: "./data.json",
  timeout: 5000,
  retries: 2,
  retryDelay: 400,
  devDelay: 600
};

export function createDataService(options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options };

  async function get(path = "") {
    if (isDevelopment()) {
      await delay(config.devDelay);
    }

    return request({
      url: buildUrl(config.baseUrl, path),
      method: "GET",
      retries: config.retries,
      timeout: config.timeout,
      retryDelay: config.retryDelay
    });
  }

  return { get };
}

/* ================= CORE REQUEST ================= */

async function request({
  url,
  method,
  retries,
  timeout,
  retryDelay,
  headers = {}
}) {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, {
        method,
        headers,
        timeout
      });

      if (!response.ok) {
        throw createHttpError(response);
      }

      return await safeJson(response);

    } catch (error) {
      if (attempt === retries) {
        throw enhanceError(error);
      }

      await delay(retryDelay * (attempt + 1)); // backoff linear
      attempt++;
    }
  }
}

/* ================= FETCH WITH TIMEOUT ================= */

async function fetchWithTimeout(url, { method, headers, timeout }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      method,
      headers,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Timeout da requisição");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/* ================= ERROR HANDLING ================= */

function createHttpError(response) {
  const error = new Error(`HTTP ${response.status}`);
  error.status = response.status;
  return error;
}

function enhanceError(error) {
  if (error.status) return error;

  return new Error(`Erro de rede: ${error.message}`);
}

/* ================= UTIL ================= */

async function safeJson(response) {
  try {
    const data = await response.json();
    if (!data || typeof data !== "object") {
      throw new Error("Resposta inválida da API");
    }
    return data;
  } catch {
    throw new Error("Falha ao interpretar JSON");
  }
}

function buildUrl(base, path) {
  return path ? `${base}${path}` : base;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isDevelopment() {
  return location.hostname === "localhost" ||
         location.hostname === "127.0.0.1";
}