// /js/services/user.api.js

import { createApiClient } from "./api.service.js";
import { getAuthToken, clearAuthToken } from "../core/auth.js";

const api = createApiClient({
  getToken: getAuthToken
});

/* ============================= */
/*  User Endpoints */
/* ============================= */

export async function getUser() {
  return handleAuth(() => api.get("/user"));
}

export async function updateUser(data) {
  return handleAuth(() => api.put("/user", sanitizePayload(data)));
}

export async function deleteUser() {
  return handleAuth(() => api.delete("/user"));
}

/* ============================= */
/*  Auth Guard */
/* ============================= */

async function handleAuth(requestFn) {
  try {
    return await requestFn();
  } catch (error) {
    if (error.status === 401) {
      clearAuthToken();
      redirectToLogin();
    }
    throw error;
  }
}

/* ============================= */
/*  Utils */
/* ============================= */

function sanitizePayload(data = {}) {
  // evita enviar campos undefined
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );
}

function redirectToLogin() {
  window.location.href = "/login.html";
}