import React from "react";
import { getUser } from "../../features/auth/model/auth";

export type UserPrefs = {
  compactMode: boolean;
  showQuickStats: boolean;
  notifyEmail: boolean;
  notifyInApp: boolean;
};

const DEFAULT: UserPrefs = {
  compactMode: false,
  showQuickStats: true,
  notifyEmail: true,
  notifyInApp: true,
};

function key(email: string) {
  return `ashkan_prefs:${email}`;
}

function load(email: string): UserPrefs {
  try {
    const raw = localStorage.getItem(key(email));
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as Partial<UserPrefs>) };
  } catch {
    return DEFAULT;
  }
}

function save(email: string, prefs: UserPrefs) {
  localStorage.setItem(key(email), JSON.stringify(prefs));
}

type Ctx = { prefs: UserPrefs; setPrefs: (p: UserPrefs) => void; patch: (p: Partial<UserPrefs>) => void };

const PrefsCtx = React.createContext<Ctx | null>(null);

export function UserPrefsProvider({ children }: { children: React.ReactNode }) {
  const user = getUser();
  const email = user?.email ?? "guest";
  const [prefs, setPrefsState] = React.useState<UserPrefs>(() => load(email));

  React.useEffect(() => {
    setPrefsState(load(email));
  }, [email]);

  const setPrefs = (p: UserPrefs) => {
    setPrefsState(p);
    if (email !== "guest") save(email, p);
  };

  const patch = (p: Partial<UserPrefs>) => setPrefs({ ...prefs, ...p });

  return <PrefsCtx.Provider value={{ prefs, setPrefs, patch }}>{children}</PrefsCtx.Provider>;
}

export function useUserPrefs() {
  const v = React.useContext(PrefsCtx);
  if (!v) throw new Error("useUserPrefs must be used inside UserPrefsProvider");
  return v;
}
