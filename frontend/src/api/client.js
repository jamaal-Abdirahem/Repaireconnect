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

export const BASE_URL = import.meta.env.VITE_API_URL || "https://service-dispatch-backend-2.onrender.com/api";

// ── Set to false when backend is ready ───────────────────────
export const MOCK_MODE = false;
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

  // Auto-logout on expired / invalid token — clears localStorage and Redux state
  if (res.status === 401) {
    localStorage.removeItem("rc_token");
    localStorage.removeItem("rc_user");
    // Dynamically import to avoid circular dependency at module load time
    import("../store/store.js").then(({ default: store }) => {
      import("../store/slices/authSlice.js").then(({ logoutUser }) => {
        store.dispatch(logoutUser());
      });
    });
  }

  if (!res.ok) {
    throw new ApiError(body?.message || "Something went wrong", res.status);
  }

  return body;
}
