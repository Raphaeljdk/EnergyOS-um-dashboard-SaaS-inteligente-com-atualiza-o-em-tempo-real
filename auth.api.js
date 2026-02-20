// /js/services/auth.api.js

import { createApiClient } from "./api.service.js";

const api = createApiClient();

export async function login(email, password) {
  const data = await api.post("/auth/login", {
    email,
    password
  });

  return {
    user: data.user,
    token: data.token
  };
}