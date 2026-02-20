// /js/services/api.service.js

import { ENV } from "/js/core/env.js";

const API_BASE = ENV.apiBaseUrl;

export function createApiClient(options = {}) {
  const config = {
    baseUrl: API_BASE,
    timeout: 10000,
    getToken: null, // função opcional para auth
    ...options
  };

  async function request(endpoint, { method = "GET", body, headers = {} } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeout);

    try {
      const token = config.getToken?.();

      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timer);

      const data = await safeParseJSON(response);

      if (!response.ok) {
        throw createApiError(response.status, data);
      }

      return data;

    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      throw error;
    }
  }

  return {
    get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
    post: (endpoint, body, options) =>
      request(endpoint, { ...options, method: "POST", body }),
    put: (endpoint, body, options) =>
      request(endpoint, { ...options, method: "PUT", body }),
    patch: (endpoint, body, options) =>
      request(endpoint, { ...options, method: "PATCH", body }),
    delete: (endpoint, options) =>
      request(endpoint, { ...options, method: "DELETE" })
  };
}

/* ========================= */
/* Utils */
/* ========================= */

async function safeParseJSON(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function createApiError(status, data) {
  const error = new Error(data?.message || "API request failed");
  error.status = status;
  error.data = data;
  return error;
}