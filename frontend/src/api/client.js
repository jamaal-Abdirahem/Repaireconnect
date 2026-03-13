/**
 * api/client.js
 * ─────────────────────────────────────────────────────────────
 * Base HTTP client — ready to connect to the real backend.
 *
 * TO CONNECT BACKEND:
 *   1. Set BASE_URL to your backend URL (e.g. http://localhost:5000/api)
 *   2. Remove MOCK_MODE = true  (or set it to false)
 *   3. Every portal will automatically start making real API calls.
 * ─────────────────────────────────────────────────────────────
 */

export const BASE_URL = "http://localhost:5000/api";

// ── Set to false when backend is ready ───────────────────────
export const MOCK_MODE = true;
// ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("rc_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let body;
  try {
    body = await res.json();
  } catch {
    throw new ApiError("Server returned non-JSON response", res.status);
  }

  if (!res.ok) {
    throw new ApiError(body?.message || "Something went wrong", res.status);
  }

  return body;
}
