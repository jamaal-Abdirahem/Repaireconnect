/**
 * api/auth.js
 * ─────────────────────────────────────────────────────────────
 * MOCK_MODE = true  → uses mock users, no network call
 * MOCK_MODE = false → calls real backend POST /auth/login
 * ─────────────────────────────────────────────────────────────
 */

import { apiFetch, MOCK_MODE } from "./client.js";
import { MOCK_USERS, delay } from "./mockData.js";

export async function login(credentials) {
  if (MOCK_MODE) {
    await delay();
    const user = MOCK_USERS.find(u => u.phone === credentials.phone);
    if (!user) throw new Error("User not found.");
    // In mock mode any password works
    localStorage.setItem("rc_token", "mock_token");
    localStorage.setItem("rc_user", JSON.stringify(user));
    return { token: "mock_token", user };
  }

  const body = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  if (body.token) {
    localStorage.setItem("rc_token", body.token);
    localStorage.setItem("rc_user", JSON.stringify(body.user));
  }
  return body;
}

export async function register(data) {
  if (MOCK_MODE) {
    await delay();
    return { success: true, message: "User created successfully" };
  }
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  localStorage.removeItem("rc_token");
  localStorage.removeItem("rc_user");
}

export function getStoredSession() {
  try {
    const token = localStorage.getItem("rc_token");
    const user  = JSON.parse(localStorage.getItem("rc_user") || "null");
    if (!token || !user) return null;
    return { token, user };
  } catch {
    return null;
  }
}
