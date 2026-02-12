import React from "react";
import { defaultSettings } from "./settings";

type Ctx = {
  settings: typeof defaultSettings;
  patch: (p: Partial<typeof defaultSettings>) => void;
};

const SettingsCtx = React.createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState(() => {
    try {
      const raw = localStorage.getItem("ashkan_settings_v1");
      return raw ? { ...defaultSettings, ...(JSON.parse(raw) as any) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const patch = (p: Partial<typeof defaultSettings>) => {
    const next = { ...settings, ...p } as any;
    setSettings(next);
    localStorage.setItem("ashkan_settings_v1", JSON.stringify(next));
  };

  return <SettingsCtx.Provider value={{ settings, patch }}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const v = React.useContext(SettingsCtx);
  if (!v) return { settings: defaultSettings, patch: (_: any) => {} };
  return v;
}
