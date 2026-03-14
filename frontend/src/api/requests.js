/**
 * api/requests.js
 * ─────────────────────────────────────────────────────────────
 * MOCK_MODE = true  → mutates in-memory MOCK_REQUESTS
 * MOCK_MODE = false → calls real backend
 * ─────────────────────────────────────────────────────────────
 */

import { apiFetch, MOCK_MODE } from "./client.js";
import {
  MOCK_REQUESTS, MOCK_TECHNICIANS, delay,
  getRequestById, updateRequest, addRequest,
} from "./mockData.js";

export async function getRequests() {
  if (MOCK_MODE) {
    await delay();
    const user = JSON.parse(localStorage.getItem("rc_user") || "null");
    if (!user) return [];
    if (user.role === "CLIENT") return MOCK_REQUESTS.filter(r => r.clientId === user.id);
    return [...MOCK_REQUESTS];
  }
  const body = await apiFetch("/requests");
  return body.data;
}

export async function getTechnicianRequests() {
  if (MOCK_MODE) {
    await delay();
    const user = JSON.parse(localStorage.getItem("rc_user") || "null");
    if (!user) return [];
    const tech = MOCK_TECHNICIANS.find(t => t.userId === user.id);
    if (!tech) return [];
    return MOCK_REQUESTS.filter(r => r.technicianId === tech.id);
  }
  const body = await apiFetch("/requests/technician");
  return body.data;
}

export async function getRequest(id) {
  if (MOCK_MODE) {
    await delay();
    return getRequestById(id);
  }
  const body = await apiFetch(`/requests/${id}`);
  return body.data;
}

export async function createRequest(data) {
  if (MOCK_MODE) {
    await delay();
    const user = JSON.parse(localStorage.getItem("rc_user") || "null");
    const newReq = {
      id: "req" + Date.now(),
      clientName: data.clientName,
      phone: data.phone,
      location: data.location,
      vehicleType: data.vehicleType || "OTHER",
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      problem: data.problem,
      status: "REPORTED",
      clientId: user?.id || "u001",
      technicianId: null,
      technician: null,
      payment: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return addRequest(newReq);
  }
  const body = await apiFetch("/requests", { method: "POST", body: JSON.stringify(data) });
  return body.data;
}

export async function assignRequest(requestId, technicianId) {
  if (MOCK_MODE) {
    await delay();
    const tech = MOCK_TECHNICIANS.find(t => t.id === technicianId);
    return updateRequest(requestId, { status: "ASSIGNED", technicianId, technician: tech });
  }
  const body = await apiFetch(`/requests/${requestId}/assign`, {
    method: "POST", body: JSON.stringify({ technicianId }),
  });
  return body.data;
}

export async function markArrived(requestId) {
  if (MOCK_MODE) {
    await delay();
    return updateRequest(requestId, { status: "ARRIVED" });
  }
  const body = await apiFetch(`/requests/${requestId}/arrived`, { method: "POST" });
  return body.data;
}

export async function submitEstimate(requestId, report, budget) {
  if (MOCK_MODE) {
    await delay();
    return updateRequest(requestId, { status: "ESTIMATED", problemReport: report, budget });
  }
  const body = await apiFetch(`/requests/${requestId}/estimate`, {
    method: "POST", body: JSON.stringify({ report, budget }),
  });
  return body.data;
}

export async function approveEstimate(requestId) {
  if (MOCK_MODE) {
    await delay();
    return updateRequest(requestId, { status: "APPROVED" });
  }
  const body = await apiFetch(`/requests/${requestId}/approve-estimate`, { method: "POST" });
  return body.data;
}

export async function startWork(requestId) {
  if (MOCK_MODE) {
    await delay();
    return updateRequest(requestId, { status: "IN_PROGRESS" });
  }
  const body = await apiFetch(`/requests/${requestId}/start-work`, { method: "POST" });
  return body.data;
}

export async function markComplete(requestId) {
  if (MOCK_MODE) {
    await delay();
    return updateRequest(requestId, { status: "COMPLETED" });
  }
  const body = await apiFetch(`/requests/${requestId}/complete`, { method: "POST" });
  return body.data;
}

export async function approveRequest(requestId) {
  if (MOCK_MODE) {
    await delay();
    return { success: true, message: "Service approved" };
  }
  return apiFetch(`/requests/${requestId}/approve`, { method: "POST" });
}

export async function payRequest(requestId, amount) {
  if (MOCK_MODE) {
    await delay();
    return updateRequest(requestId, {
      status: "PAID",
      payment: { id: "pay" + Date.now(), amount, status: "SUCCESS", createdAt: new Date().toISOString() },
    });
  }
  const body = await apiFetch(`/requests/${requestId}/pay`, {
    method: "POST", body: JSON.stringify({ amount }),
  });
  return body.data;
}
