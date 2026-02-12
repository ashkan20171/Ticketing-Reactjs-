export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type WorkCalendar = {
  // 0=Sun..6=Sat
  workingDays: number[];
  startHour: number; // 0-23
  endHour: number;   // 0-23 (end exclusive)
  holidays: string[]; // YYYY-MM-DD
  pauseOnPending: boolean;
};

export type SlaPolicy = Record<TicketPriority, { firstResponseMinutes: number; resolutionMinutes: number }>;

export type SlaConfig = {
  calendar: WorkCalendar;
  policy: SlaPolicy;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isHoliday(d: Date, cal: WorkCalendar) {
  return cal.holidays.includes(ymd(d));
}

function isWorkingDay(d: Date, cal: WorkCalendar) {
  return cal.workingDays.includes(d.getDay()) && !isHoliday(d, cal);
}

function clampToWorkStart(d: Date, cal: WorkCalendar) {
  const x = new Date(d);
  x.setHours(cal.startHour, 0, 0, 0);
  return x;
}
function clampToWorkEnd(d: Date, cal: WorkCalendar) {
  const x = new Date(d);
  x.setHours(cal.endHour, 0, 0, 0);
  return x;
}

function nextWorkDayStart(d: Date, cal: WorkCalendar) {
  const x = new Date(d);
  x.setDate(x.getDate() + 1);
  x.setHours(cal.startHour, 0, 0, 0);
  while (!isWorkingDay(x, cal)) {
    x.setDate(x.getDate() + 1);
  }
  return x;
}

export function businessMsBetween(start: Date, end: Date, cal: WorkCalendar) {
  if (end <= start) return 0;

  let cur = new Date(start);
  let total = 0;

  // normalize: move to a valid working window
  while (!isWorkingDay(cur, cal)) {
    cur = nextWorkDayStart(cur, cal);
    if (cur >= end) return 0;
  }

  // If before start hour, jump to start hour; if after end hour, jump to next day
  const dayStart = clampToWorkStart(cur, cal);
  const dayEnd = clampToWorkEnd(cur, cal);
  if (cur < dayStart) cur = dayStart;
  if (cur >= dayEnd) {
    cur = nextWorkDayStart(cur, cal);
    if (cur >= end) return 0;
  }

  while (cur < end) {
    if (!isWorkingDay(cur, cal)) {
      cur = nextWorkDayStart(cur, cal);
      continue;
    }

    const ws = clampToWorkStart(cur, cal);
    const we = clampToWorkEnd(cur, cal);

    const segStart = cur < ws ? ws : cur;
    const segEnd = end < we ? end : we;

    if (segEnd > segStart) total += segEnd.getTime() - segStart.getTime();

    if (end <= we) break;
    cur = nextWorkDayStart(cur, cal);
  }

  return total;
}

export function addBusinessMs(start: Date, addMs: number, cal: WorkCalendar) {
  let remaining = Math.max(0, addMs);
  let cur = new Date(start);

  // normalize to work window
  while (!isWorkingDay(cur, cal)) {
    cur = nextWorkDayStart(cur, cal);
  }
  const ws0 = clampToWorkStart(cur, cal);
  const we0 = clampToWorkEnd(cur, cal);
  if (cur < ws0) cur = ws0;
  if (cur >= we0) cur = nextWorkDayStart(cur, cal);

  while (remaining > 0) {
    if (!isWorkingDay(cur, cal)) {
      cur = nextWorkDayStart(cur, cal);
      continue;
    }

    const ws = clampToWorkStart(cur, cal);
    const we = clampToWorkEnd(cur, cal);
    if (cur < ws) cur = ws;
    if (cur >= we) {
      cur = nextWorkDayStart(cur, cal);
      continue;
    }

    const avail = we.getTime() - cur.getTime();
    if (remaining <= avail) {
      return new Date(cur.getTime() + remaining);
    }
    remaining -= avail;
    cur = nextWorkDayStart(cur, cal);
  }

  return cur;
}

export function formatDuration(ms: number) {
  const sign = ms < 0 ? "-" : "";
  const x = Math.abs(ms);
  const totalMinutes = Math.floor(x / 60000);
  const d = Math.floor(totalMinutes / (60 * 24));
  const h = Math.floor((totalMinutes - d * 24 * 60) / 60);
  const m = totalMinutes % 60;
  if (d > 0) return `${sign}${d}روز ${h}ساعت`;
  if (h > 0) return `${sign}${h}ساعت ${m}دقیقه`;
  return `${sign}${m}دقیقه`;
}

export type SlaState = {
  firstResponseRemainingMs: number;
  resolutionRemainingMs: number;
  firstResponseBreached: boolean;
  resolutionBreached: boolean;
  atRisk: boolean;
};

export function computeSlaState(args: {
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  status: "open" | "pending" | "closed";
  priority: TicketPriority;
  firstResponseAt?: string; // ISO when first agent reply happened
  config: SlaConfig;
  now?: Date;
}): SlaState {
  const now = args.now ?? new Date();
  const created = new Date(args.createdAt);
  const updated = args.updatedAt ? new Date(args.updatedAt) : created;

  const cal = args.config.calendar;
  const policy = args.config.policy[args.priority];

  const firstMs = policy.firstResponseMinutes * 60000;
  const resMs = policy.resolutionMinutes * 60000;

  // elapsed business time from created->now, minus paused time if pending
  const totalElapsed = businessMsBetween(created, now, cal);
  const pendingPaused = (cal.pauseOnPending && args.status === "pending")
    ? businessMsBetween(updated, now, cal)
    : 0;

  const effectiveElapsed = Math.max(0, totalElapsed - pendingPaused);

  // First response: if firstResponseAt exists, use created->firstResponseAt elapsed, else created->now
  const firstCut = args.firstResponseAt ? new Date(args.firstResponseAt) : now;
  const firstElapsedTotal = businessMsBetween(created, firstCut, cal);
  const firstElapsed = Math.max(0, firstElapsedTotal - (cal.pauseOnPending && args.status === "pending" ? pendingPaused : 0));

  const firstRemaining = firstMs - firstElapsed;
  const resRemaining = resMs - effectiveElapsed;

  const firstBreached = firstRemaining < 0;
  const resBreached = resRemaining < 0;

  // atRisk: less than 15% remaining on either metric and not already breached
  const firstRisk = !firstBreached && firstRemaining / firstMs <= 0.15;
  const resRisk = !resBreached && resRemaining / resMs <= 0.15;

  return {
    firstResponseRemainingMs: firstRemaining,
    resolutionRemainingMs: resRemaining,
    firstResponseBreached: firstBreached,
    resolutionBreached: resBreached,
    atRisk: firstRisk || resRisk,
  };
}
