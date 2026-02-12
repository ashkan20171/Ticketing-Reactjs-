
import type { AuthUser, AuthTokens } from "./auth.types";

const REFRESH_KEY = "ashkan_refresh_v18";

export function saveSession(user: AuthUser, tokens: AuthTokens, remember: boolean) {
  const payload = JSON.stringify({ user, tokens });
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(REFRESH_KEY, payload);
}

export function readSession() {
  const raw =
    localStorage.getItem(REFRESH_KEY) ||
    sessionStorage.getItem(REFRESH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}
