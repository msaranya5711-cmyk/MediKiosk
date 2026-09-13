import { API_BASE_URL } from "../constants/config.js";

/**
 * Exchanges a verified Google credential for our own backend session token.
 * role is "patient" or "staff".
 */
export async function exchangeGoogleCredential(credential, role) {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Google sign-in failed.");
  return data;
}

export async function loginStaff({ abhaId, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ abhaId, password }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function signupStaff({ name, staffId, password, confirmPassword }) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, staffId, password, confirmPassword }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function startPatientSession(abhaId) {
  const res = await fetch(`${API_BASE_URL}/auth/patient-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ abhaId }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}
