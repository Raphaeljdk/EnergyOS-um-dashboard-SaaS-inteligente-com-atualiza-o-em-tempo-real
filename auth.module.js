// /js/modules/auth.module.js

import { setState } from "/js/store.js";
import { setAuthToken } from "/js/core/auth.js";
import { login } from "/js/services/auth.api.js";
import { initLoading } from "/js/modules/loading/loading.js";

export function initAuth() {
  const form = document.querySelector("#loginForm");
  if (!form) return () => {};

  const loading = initLoading();
  const handler = (e) => handleLogin(e, loading);

  form.addEventListener("submit", handler);

  // SPA-ready cleanup
  return () => {
    form.removeEventListener("submit", handler);
  };
}

/* ===================================== */
/* LOGIN FLOW */
/* ===================================== */

async function handleLogin(e, loading) {
  e.preventDefault();

  const form = e.currentTarget;
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const submitBtn = form.querySelector("button[type='submit']");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  clearErrors(form);

  if (!validateEmail(email)) {
    return showFieldError(emailInput, "Email inválido");
  }

  if (!password) {
    return showFieldError(passwordInput, "Senha obrigatória");
  }

  toggleButton(submitBtn, true);
  loading.show();

  try {
    const { user, token } = await login(email, password);

    setAuthToken(token);
    setState({ user });

    redirectToDashboard();

  } catch (error) {
    showToast(error.message || "Falha no login");
  } finally {
    loading.hide();
    toggleButton(submitBtn, false);
  }
}