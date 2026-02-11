import { createContext, useContext, useMemo, useState } from "react";
import { AppUser } from "../../features/users/model/user";
import { Role } from "../../features/auth/model/auth";

type Ctx = {
  users: AppUser[];
  setRole: (email: string, role: Role) => void;
  toggleActive: (email: string) => void;
};

const KEY = "ashkan_users_v1";

const seed: AppUser[] = [
  { id: "u-admin", name: "مدیر سیستم", email: "admin@example.com", role: "admin", active: true },
  { id: "u-agent", name: "اپراتور فنی", email: "agent@example.com", role: "agent", active: true, department: "فنی" },
  { id: "u-1", name: "کاربر ۱", email: "user1@example.com", role: "user", active: true },
  { id: "u-2", name: "کاربر ۲", email: "user2@example.com", role: "user", active: true },
];

function loadUsers(): AppUser[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return seed;
  try { return JSON.parse(raw) as AppUser[]; } catch { return seed; }
}

function saveUsers(items: AppUser[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

const UsersCtx = createContext<Ctx | null>(null);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => loadUsers());

  const api = useMemo<Ctx>(() => ({
    users,
    setRole: (email, role) => {
      setUsers((p) => {
        const next = p.map((u) => u.email === email ? { ...u, role } : u);
        saveUsers(next);
        return next;
      });
    },
    toggleActive: (email) => {
      setUsers((p) => {
        const next = p.map((u) => u.email === email ? { ...u, active: !u.active } : u);
        saveUsers(next);
        return next;
      });
    },
  }), [users]);

  return <UsersCtx.Provider value={api}>{children}</UsersCtx.Provider>;
}

export function useUsers() {
  const v = useContext(UsersCtx);
  if (!v) throw new Error("useUsers must be used inside UsersProvider");
  return v;
}
