import { useMemo, useState } from "react";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { useToast } from "../app/providers/ToastProvider";
import { useLogs } from "../app/providers/LogsProvider";
import { getUser } from "../features/auth/model/auth";
import { clampSlaHours, TicketPriority } from "../features/settings/model/settings";
import { useSettings } from "../app/providers/SettingsProvider";

const daysFa: Record<number, string> = {
  0: "یکشنبه",
  1: "دوشنبه",
  2: "سه‌شنبه",
  3: "چهارشنبه",
  4: "پنجشنبه",
  5: "جمعه",
  6: "شنبه",
};

function safeNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function SettingsPage() {
  const { addLog } = useLogs();
  const actor = getUser();
  const { toast } = useToast();
  const { settings, setSlaHours, setEmailNotifications, setTheme, setSlaPolicy, setWorkCalendar } = useSettings();

  // legacy
  const [slaInput, setSlaInput] = useState(String(settings.slaHours));
  const slaParsed = useMemo(() => clampSlaHours(Number(slaInput)), [slaInput]);

  // enterprise SLA policy editor
  const [policyDraft, setPolicyDraft] = useState(() => settings.slaPolicy);
  const [calendarDraft, setCalendarDraft] = useState(() => settings.workCalendar);
  const [holidayInput, setHolidayInput] = useState("");

  const saveLegacySlaHours = () => {
    setSlaHours(slaParsed);
    toast({ type: "success", title: "ذخیره شد", message: "تنظیمات SLA (قدیمی) ذخیره شد." });
    addLog({ action: "UPDATE_SETTINGS", message: `SLA hours set to ${slaParsed}`, actorEmail: actor?.email });
  };

  const saveEnterpriseSla = () => {
    // validate calendar
    const startHour = Math.max(0, Math.min(23, Math.floor(calendarDraft.startHour)));
    const endHour = Math.max(startHour + 1, Math.min(24, Math.floor(calendarDraft.endHour)));
    const workingDays = Array.from(new Set(calendarDraft.workingDays)).sort((a, b) => a - b);
    const holidays = Array.from(new Set(calendarDraft.holidays)).filter(Boolean);

    const nextCal = {
      ...calendarDraft,
      startHour,
      endHour,
      workingDays,
      holidays,
    };

    setSlaPolicy(policyDraft);
    setWorkCalendar(nextCal);

    toast({ type: "success", title: "ذخیره شد", message: "SLA Enterprise و تقویم کاری ذخیره شد." });
    addLog({ action: "UPDATE_SETTINGS", message: `SLA policy/calendar updated`, actorEmail: actor?.email });
  };

  const setPolicyValue = (priority: TicketPriority, field: "firstResponseMinutes" | "resolutionMinutes", value: number) => {
    setPolicyDraft((p) => ({
      ...p,
      [priority]: {
        ...p[priority],
        [field]: Math.max(1, Math.floor(value)),
      },
    }));
  };

  const toggleWorkingDay = (day: number) => {
    setCalendarDraft((c) => {
      const has = c.workingDays.includes(day);
      const next = has ? c.workingDays.filter((d) => d !== day) : [...c.workingDays, day];
      return { ...c, workingDays: next };
    });
  };

  const addHoliday = () => {
    const v = holidayInput.trim();
    // basic YYYY-MM-DD check
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      toast({ type: "warning", title: "فرمت تاریخ", message: "فرمت تعطیلی باید YYYY-MM-DD باشد." });
      return;
    }
    setCalendarDraft((c) => ({ ...c, holidays: Array.from(new Set([...c.holidays, v])) }));
    setHolidayInput("");
  };

  const removeHoliday = (v: string) => {
    setCalendarDraft((c) => ({ ...c, holidays: c.holidays.filter((x) => x !== v) }));
  };

  return (
    <div style={{ padding: 12, display: "grid", gap: 12, maxWidth: 980 }}>
      <Card>
        <div style={{ fontWeight: 900, fontSize: 16 }}>تنظیمات سیستم</div>
        <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13, lineHeight: 1.8 }}>
          این تنظیمات محلی هستند (LocalStorage) و برای نسخه‌ی بک‌اند آماده‌اند.
          <br />
          SLA Enterprise بر اساس <b>ساعات کاری</b> محاسبه می‌شود و در وضعیت <b>در انتظار (Pending)</b> متوقف می‌شود.
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>SLA (Legacy)</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12, alignItems: "end" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>حداکثر ساعت مجاز برای تیکت‌های باز</span>
            <input
              value={slaInput}
              onChange={(e) => setSlaInput(e.target.value)}
              inputMode="numeric"
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text)",
                outline: "none",
              }}
              placeholder="مثلاً 24"
            />
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              بازه مجاز: 1 تا 168 ساعت. مقدار اعمال‌شده: <b>{slaParsed}</b>
            </span>
          </label>

          <Button variant="secondary" onClick={saveLegacySlaHours}>ذخیره SLA</Button>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>SLA Enterprise</div>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>ساعت شروع روز کاری</span>
              <input
                value={calendarDraft.startHour}
                onChange={(e) => setCalendarDraft((c) => ({ ...c, startHour: safeNum(e.target.value) }))}
                inputMode="numeric"
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text)",
                  outline: "none",
                }}
                placeholder="9"
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>ساعت پایان روز کاری</span>
              <input
                value={calendarDraft.endHour}
                onChange={(e) => setCalendarDraft((c) => ({ ...c, endHour: safeNum(e.target.value) }))}
                inputMode="numeric"
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text)",
                  outline: "none",
                }}
                placeholder="18"
              />
            </label>
          </div>

          <div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>روزهای کاری</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[6, 0, 1, 2, 3, 4, 5].map((d) => {
                const active = calendarDraft.workingDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleWorkingDay(d)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 999,
                      border: "1px solid var(--border)",
                      background: active ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.03)",
                      color: "var(--text)",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {daysFa[d]}
                  </button>
                );
              })}
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={calendarDraft.pauseOnPending}
              onChange={(e) => setCalendarDraft((c) => ({ ...c, pauseOnPending: e.target.checked }))}
            />
            <span style={{ color: "var(--text)" }}>توقف SLA در وضعیت «در انتظار»</span>
          </label>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>تعطیلات (YYYY-MM-DD)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 10, alignItems: "end" }}>
              <input
                value={holidayInput}
                onChange={(e) => setHolidayInput(e.target.value)}
                placeholder="مثلاً 2026-03-21"
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              <Button variant="secondary" onClick={addHoliday}>افزودن تعطیلی</Button>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {calendarDraft.holidays.length === 0 ? (
                <span style={{ color: "var(--muted)", fontSize: 12 }}>تعطیلی ثبت نشده</span>
              ) : (
                calendarDraft.holidays.map((h) => (
                  <span
                    key={h}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => removeHoliday(h)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "var(--muted)",
                        cursor: "pointer",
                        fontWeight: 900,
                      }}
                      aria-label="حذف"
                      title="حذف"
                    >
                      ✕
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Policy (دقیقه)</div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "right", padding: "10px 8px", color: "var(--muted)", fontSize: 12 }}>اولویت</th>
                    <th style={{ textAlign: "right", padding: "10px 8px", color: "var(--muted)", fontSize: 12 }}>First Response (min)</th>
                    <th style={{ textAlign: "right", padding: "10px 8px", color: "var(--muted)", fontSize: 12 }}>Resolution (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {(["urgent", "high", "normal", "low"] as TicketPriority[]).map((p) => (
                    <tr key={p}>
                      <td style={{ padding: "10px 8px", fontWeight: 900 }}>{p}</td>
                      <td style={{ padding: "10px 8px" }}>
                        <input
                          value={policyDraft[p].firstResponseMinutes}
                          onChange={(e) => setPolicyValue(p, "firstResponseMinutes", safeNum(e.target.value))}
                          inputMode="numeric"
                          style={{
                            width: 160,
                            padding: "10px 12px",
                            borderRadius: 14,
                            border: "1px solid var(--border)",
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--text)",
                            outline: "none",
                          }}
                        />
                      </td>
                      <td style={{ padding: "10px 8px" }}>
                        <input
                          value={policyDraft[p].resolutionMinutes}
                          onChange={(e) => setPolicyValue(p, "resolutionMinutes", safeNum(e.target.value))}
                          inputMode="numeric"
                          style={{
                            width: 160,
                            padding: "10px 12px",
                            borderRadius: 14,
                            border: "1px solid var(--border)",
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--text)",
                            outline: "none",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <Button variant="secondary" onClick={saveEnterpriseSla}>ذخیره SLA Enterprise</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>اعلان‌ها (Mock)</div>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => {
              setEmailNotifications(e.target.checked);
              toast({
                type: "info",
                title: "اعلان‌ها",
                message: e.target.checked ? "اعلان ایمیلی فعال شد (دمو)" : "اعلان ایمیلی غیرفعال شد (دمو)",
              });
              addLog({ action: "TOGGLE_EMAIL_NOTIF", message: `Email notifications: ${e.target.checked}`, actorEmail: actor?.email });
            }}
          />
          <span style={{ color: "var(--text)" }}>فعال‌سازی اعلان ایمیلی</span>
        </label>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>ظاهر (Theme)</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            variant={settings.theme === "dark" ? "secondary" : "ghost"}
            onClick={() => {
              setTheme("dark");
              toast({ type: "success", title: "تم تغییر کرد", message: "Dark فعال شد." });
              addLog({ action: "CHANGE_THEME", message: "Theme set to dark", actorEmail: actor?.email });
            }}
          >
            Dark
          </Button>

          <Button
            variant={settings.theme === "light" ? "secondary" : "ghost"}
            onClick={() => {
              setTheme("light");
              toast({ type: "success", title: "تم تغییر کرد", message: "Light فعال شد." });
              addLog({ action: "CHANGE_THEME", message: "Theme set to light", actorEmail: actor?.email });
            }}
          >
            Light
          </Button>
        </div>
      </Card>
    </div>
  );
}
