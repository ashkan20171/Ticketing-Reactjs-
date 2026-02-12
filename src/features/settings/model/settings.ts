export type ThemeMode = "dark" | "light";

export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type SlaPolicy = Record<TicketPriority, { firstResponseMinutes: number; resolutionMinutes: number }>;

export type WorkCalendar = {
  // 0=Sun..6=Sat
  workingDays: number[];
  startHour: number; // 0-23
  endHour: number; // 0-23 (end exclusive)
  holidays: string[]; // YYYY-MM-DD
  pauseOnPending: boolean;
};

export type AppSettings = {
  // legacy: keeps UI compatibility
  slaHours: number;
  emailNotifications: boolean;
  theme: ThemeMode;

  // enterprise SLA
  slaPolicy: SlaPolicy;
  workCalendar: WorkCalendar;
};

const KEY = "ashkan_settings_v1";

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

const DEFAULTS: AppSettings = {
  slaHours: 24,
  emailNotifications: false,
  theme: "dark",
  slaPolicy: defaultSlaPolicy,
  workCalendar: defaultWorkCalendar,
};

export function clampSlaHours(v: number) {
  if (Number.isNaN(v)) return DEFAULTS.slaHours;
  return Math.min(168, Math.max(1, Math.round(v)));
}

function asArrayNumber(v: unknown): number[] | null {
  if (!Array.isArray(v)) return null;
  const nums = v.map((x) => Number(x)).filter((n) => Number.isFinite(n));
  return nums.length ? nums : [];
}

function asStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const arr = v.filter((x) => typeof x === "string") as string[];
  return arr;
}

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULTS;

  try {
    const s = JSON.parse(raw) as Partial<AppSettings> & {
      slaPolicy?: any;
      workCalendar?: any;
    };

    const slaPolicy: SlaPolicy = {
      urgent: {
        firstResponseMinutes: Number(s?.slaPolicy?.urgent?.firstResponseMinutes) || DEFAULTS.slaPolicy.urgent.firstResponseMinutes,
        resolutionMinutes: Number(s?.slaPolicy?.urgent?.resolutionMinutes) || DEFAULTS.slaPolicy.urgent.resolutionMinutes,
      },
      high: {
        firstResponseMinutes: Number(s?.slaPolicy?.high?.firstResponseMinutes) || DEFAULTS.slaPolicy.high.firstResponseMinutes,
        resolutionMinutes: Number(s?.slaPolicy?.high?.resolutionMinutes) || DEFAULTS.slaPolicy.high.resolutionMinutes,
      },
      normal: {
        firstResponseMinutes: Number(s?.slaPolicy?.normal?.firstResponseMinutes) || DEFAULTS.slaPolicy.normal.firstResponseMinutes,
        resolutionMinutes: Number(s?.slaPolicy?.normal?.resolutionMinutes) || DEFAULTS.slaPolicy.normal.resolutionMinutes,
      },
      low: {
        firstResponseMinutes: Number(s?.slaPolicy?.low?.firstResponseMinutes) || DEFAULTS.slaPolicy.low.firstResponseMinutes,
        resolutionMinutes: Number(s?.slaPolicy?.low?.resolutionMinutes) || DEFAULTS.slaPolicy.low.resolutionMinutes,
      },
    };

    const wd = asArrayNumber(s?.workCalendar?.workingDays);
    const hol = asStringArray(s?.workCalendar?.holidays);

    const workCalendar: WorkCalendar = {
      workingDays: wd ?? DEFAULTS.workCalendar.workingDays,
      startHour: Number.isFinite(Number(s?.workCalendar?.startHour)) ? Math.max(0, Math.min(23, Number(s?.workCalendar?.startHour))) : DEFAULTS.workCalendar.startHour,
      endHour: Number.isFinite(Number(s?.workCalendar?.endHour)) ? Math.max(1, Math.min(24, Number(s?.workCalendar?.endHour))) : DEFAULTS.workCalendar.endHour,
      holidays: hol ?? DEFAULTS.workCalendar.holidays,
      pauseOnPending: typeof s?.workCalendar?.pauseOnPending === "boolean" ? s.workCalendar!.pauseOnPending : DEFAULTS.workCalendar.pauseOnPending,
    };

    return {
      slaHours: typeof s.slaHours === "number" ? clampSlaHours(s.slaHours) : DEFAULTS.slaHours,
      emailNotifications: typeof s.emailNotifications === "boolean" ? s.emailNotifications : DEFAULTS.emailNotifications,
      theme: s.theme === "light" || s.theme === "dark" ? s.theme : DEFAULTS.theme,
      slaPolicy,
      workCalendar,
    };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
