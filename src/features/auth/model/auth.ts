export type Role = "user" | "agent" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const KEY = "ashkan_auth_v1";

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setUser(user: AuthUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(KEY);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  await new Promise(r => setTimeout(r, 400));
  if (!email.includes("@")) throw new Error("ایمیل معتبر نیست.");
  if (password.length < 4) throw new Error("رمز عبور حداقل ۴ کاراکتر باشد.");

  const role =
    email === "admin@example.com" ? "admin" :
    email === "agent@example.com" ? "agent" : "user";

  const user: AuthUser = {
    id: "u-" + Date.now(),
    name: role === "admin" ? "مدیر سیستم" : role === "agent" ? "اپراتور" : "کاربر",
    email,
    role
  };

  setUser(user);
  return user;
}
