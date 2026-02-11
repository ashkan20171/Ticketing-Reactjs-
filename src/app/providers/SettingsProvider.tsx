import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppSettings, loadSettings, saveSettings, ThemeMode } from "../../features/settings/model/settings";

type Ctx = {
  settings: AppSettings;
  setSlaHours: (h: number) => void;
  setEmailNotifications: (v: boolean) => void;
  setTheme: (t: ThemeMode) => void;
};

const SettingsCtx = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    // apply theme to document
    document.documentElement.setAttribute("data-theme", settings.theme);
    saveSettings(settings);
  }, [settings]);

  const api = useMemo<Ctx>(() => ({
    settings,
    setSlaHours: (h) => setSettings((p) => ({ ...p, slaHours: h })),
    setEmailNotifications: (v) => setSettings((p) => ({ ...p, emailNotifications: v })),
    setTheme: (t) => setSettings((p) => ({ ...p, theme: t })),
  }), [settings]);

  return <SettingsCtx.Provider value={api}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const v = useContext(SettingsCtx);
  if (!v) throw new Error("useSettings must be used inside SettingsProvider");
  return v;
}
