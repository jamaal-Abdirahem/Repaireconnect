/**
 * api/mockData.js
 * DELETE this file when connecting to real backend.
 */

export const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const MOCK_USERS = [
  { id: "u001", name: "Jane Smith",   phone: "0600000001", role: "CLIENT",     createdAt: "2026-01-10T09:00:00Z" },
  { id: "u002", name: "David Park",   phone: "0600000002", role: "CLIENT",     createdAt: "2026-01-15T11:00:00Z" },
  { id: "u003", name: "Roger Curtis", phone: "0600000003", role: "TECHNICIAN", createdAt: "2026-01-05T08:00:00Z" },
  { id: "u004", name: "Maria Santos", phone: "0600000004", role: "TECHNICIAN", createdAt: "2026-01-06T08:00:00Z" },
  { id: "u005", name: "James Okafor", phone: "0600000005", role: "TECHNICIAN", createdAt: "2026-01-07T08:00:00Z" },
  { id: "u006", name: "Admin User",   phone: "admin",      role: "ADMIN",      createdAt: "2026-01-01T00:00:00Z" },
];

export const MOCK_TECHNICIANS = [
  { id: "t001", userId: "u003", available: true,  location: "Downtown",  user: { name: "Roger Curtis", phone: "0600000003" } },
  { id: "t002", userId: "u004", available: true,  location: "Northside", user: { name: "Maria Santos", phone: "0600000004" } },
  { id: "t003", userId: "u005", available: false, location: "Eastside",  user: { name: "James Okafor", phone: "0600000005" } },
];

export let MOCK_REQUESTS = [
  {
    id: "req004",
    clientName: "Sara Ahmed",
    phone: "0600000007",
    location: "23 Elm Street, near Central Park",
    problem: "Battery dead / won't start — Vehicle: Ford Focus 2019",
    status: "ASSIGNED",
    clientId: "u007",
    technicianId: "t001",
    technician: MOCK_TECHNICIANS[0],
    payment: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "req003",
    clientName: "Jane Smith",
    phone: "0600000001",
    location: "456 Oak Ave, Westside",
    problem: "Engine overheating — Vehicle: Toyota Camry 2021",
    status: "PAID",
    clientId: "u001",
    technicianId: "t001",
    technician: MOCK_TECHNICIANS[0],
    payment: { id: "pay001", amount: 180, status: "SUCCESS", createdAt: "2026-03-10T15:00:00Z" },
    createdAt: "2026-03-10T12:00:00Z",
    updatedAt: "2026-03-10T15:00:00Z",
  },
];

export function getRequestById(id) {
  return MOCK_REQUESTS.find(r => r.id === id) || null;
}

export function updateRequest(id, changes) {
  MOCK_REQUESTS = MOCK_REQUESTS.map(r =>
    r.id === id ? { ...r, ...changes, updatedAt: new Date().toISOString() } : r
  );
  return getRequestById(id);
}

export function addRequest(req) {
  MOCK_REQUESTS = [req, ...MOCK_REQUESTS];
  return req;
}
