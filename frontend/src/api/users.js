/**
 * api/users.js
 * ─────────────────────────────────────────────────────────────
 * MOCK_MODE = true  → returns mock users/technicians
 * MOCK_MODE = false → calls real backend
 * ─────────────────────────────────────────────────────────────
 */

import { apiFetch, MOCK_MODE } from "./client.js";
import { MOCK_USERS, MOCK_TECHNICIANS, delay } from "./mockData.js";

export async function getMe() {
  if (MOCK_MODE) {
    await delay();
    return JSON.parse(localStorage.getItem("rc_user") || "null");
  }
  const body = await apiFetch("/users/me");
  return body.data;
}

export async function getAllUsers() {
  if (MOCK_MODE) {
    await delay();
    return [...MOCK_USERS];
  }
  const body = await apiFetch("/users");
  return body.data;
}

export async function getTechnicians() {
  if (MOCK_MODE) {
    await delay();
    return [...MOCK_TECHNICIANS];
  }
  const body = await apiFetch("/users/technicians");
  return body.data;
}

export async function setTechnicianAvailability(technicianProfileId, available) {
  if (MOCK_MODE) {
    await delay();
    const tech = MOCK_TECHNICIANS.find(t => t.id === technicianProfileId);
    if (tech) tech.available = available;
    return tech;
  }
  const body = await apiFetch(`/users/technicians/${technicianProfileId}/availability`, {
    method: "PATCH",
    body: JSON.stringify({ available }),
  });
  return body.data;
}
