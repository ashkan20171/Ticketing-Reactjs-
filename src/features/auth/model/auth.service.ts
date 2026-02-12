
import type { AuthUser } from "./auth.types";
import { randomToken, now } from "./token.service";
import { saveSession, readSession, clearSession } from "./auth.storage";

const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 7 * 24 * 60 * 60 * 1000;

let accessToken: string | null = null;
let accessExpiresAt = 0;

export async function login(email: string, password: string, remember: boolean): Promise<AuthUser> {
  await new Promise(r => setTimeout(r, 300));

  if (!email.includes("@")) throw new Error("ایمیل معتبر نیست");
  if (password.length < 4) throw new Error("رمز عبور کوتاه است");

  const role =
    email === "admin@example.com" ? "admin" :
    email === "agent@example.com" ? "agent" : "user";

  const user: AuthUser = {
    id: "u-" + Date.now(),
    name: role === "admin" ? "مدیر سیستم" : role === "agent" ? "اپراتور" : "کاربر",
    email,
    role
  };

  accessToken = randomToken("access");
  accessExpiresAt = now() + ACCESS_TTL;

  const refreshToken = randomToken("refresh");

  saveSession(user, {
    refreshToken,
    refreshExpiresAt: now() + REFRESH_TTL
  }, remember);

  return user;
}

export function getAccessToken() {
  if (!accessToken || now() > accessExpiresAt) return null;
  return accessToken;
}

export function getUser() {
  const s = readSession();
  return s?.user ?? null;
}

export function logout() {
  accessToken = null;
  clearSession();
}
