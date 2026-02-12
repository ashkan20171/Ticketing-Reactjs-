export type ThemeMode = "dark" | "light";

export type AppSettings = {
  slaHours: number; // SLA threshold for OPEN tickets
  emailNotifications: boolean; // mock toggle
  theme: ThemeMode;
  slaPolicy: SlaPolicy;
  workCalendar: WorkCalendar;

};

const KEY = "ashkan_settings_v1";

const DEFAULTS: AppSettings = {
  slaHours: 24,
  emailNotifications: false,
  theme: "dark",
};

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULTS;
  try {
    const s = JSON.parse(raw) as Partial<AppSettings>;
    return {
      slaHours: typeof s.slaHours === "number" ? s.slaHours : DEFAULTS.slaHours,
      emailNotifications: typeof s.emailNotifications === "boolean" ? s.emailNotifications : DEFAULTS.emailNotifications,
      theme: s.theme === "light" || s.theme === "dark" ? s.theme : DEFAULTS.theme,
    };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clampSlaHours(v: number) {
  if (Number.isNaN(v)) return DEFAULTS.slaHours;
  return Math.min(168, Math.max(1, Math.round(v)));
}


export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type SlaPolicy = Record<TicketPriority, { firstResponseMinutes: number; resolutionMinutes: number }>;
export type WorkCalendar = {
  workingDays: number[];
  startHour: number;
  endHour: number;
  holidays: string[];
  pauseOnPending: boolean;
};

export const defaultSlaPolicy: SlaPolicy = {
  urgent: { firstResponseMinutes: 15, resolutionMinutes: 240 },
  high: { firstResponseMinutes: 60, resolutionMinutes: 480 },
  normal: { firstResponseMinutes: 240, resolutionMinutes: 1440 },
  low: { firstResponseMinutes: 480, resolutionMinutes: 4320 },
};

export const defaultWorkCalendar: WorkCalendar = {
  workingDays: [1, 2, 3, 4, 5], // Mon-Fri
  startHour: 9,
  endHour: 18,
  holidays: [],
  pauseOnPending: true,
};
