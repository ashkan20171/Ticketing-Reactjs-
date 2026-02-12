import { useEffect, useMemo, useState } from "react";
import { Card } from "../Card/Card";
import { computeSlaState, formatDuration } from "../../lib/sla";
import { Ticket } from "../../types/ticket";
import { useSettings } from "../../../app/providers/SettingsProvider";

function barColor(kind: "ok" | "warn" | "bad") {
  if (kind === "bad") return "rgba(239, 68, 68, 0.65)";
  if (kind === "warn") return "rgba(245, 158, 11, 0.6)";
  return "rgba(34, 197, 94, 0.55)";
}

function progressPct(remaining: number, total: number) {
  if (total <= 0) return 0;
  const used = total - remaining;
  const pct = (used / total) * 100;
  return Math.max(0, Math.min(100, pct));
}

export function SlaWidget({ ticket }: { ticket: Ticket }) {
  const { settings } = useSettings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const policy = settings.slaPolicy[ticket.priority];
  const firstTotal = policy.firstResponseMinutes * 60000;
  const resTotal = policy.resolutionMinutes * 60000;

  const sla = useMemo(() => {
    return computeSlaState({
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      status: ticket.status,
      priority: ticket.priority,
      firstResponseAt: ticket.firstResponseAt,
      config: { calendar: settings.workCalendar, policy: settings.slaPolicy },
      now,
    });
  }, [ticket, settings, now]);

  const firstKind: "ok" | "warn" | "bad" =
    sla.firstResponseBreached ? "bad" : sla.atRisk ? "warn" : "ok";
  const resKind: "ok" | "warn" | "bad" =
    sla.resolutionBreached ? "bad" : sla.atRisk ? "warn" : "ok";

  const firstPct = progressPct(sla.firstResponseRemainingMs, firstTotal);
  const resPct = progressPct(sla.resolutionRemainingMs, resTotal);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16 }}>SLA وضعیت</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, lineHeight: 1.7 }}>
            محاسبه بر اساس ساعات کاری • توقف هنگام «در انتظار»
          </div>
        </div>

        <div
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 900,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.04)",
          }}
          title="Priority"
        >
          {ticket.priority.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>First Response</span>
            <b>
              {sla.firstResponseBreached ? "نقض شده" : "باقی‌مانده"}:{" "}
              {formatDuration(sla.firstResponseRemainingMs)}
            </b>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginTop: 8 }}>
            <div style={{ width: `${firstPct}%`, height: "100%", background: barColor(firstKind) }} />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>Resolution</span>
            <b>
              {sla.resolutionBreached ? "نقض شده" : "باقی‌مانده"}:{" "}
              {formatDuration(sla.resolutionRemainingMs)}
            </b>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginTop: 8 }}>
            <div style={{ width: `${resPct}%`, height: "100%", background: barColor(resKind) }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
          <div style={{ padding: 12, borderRadius: 16, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>ساعات کاری</div>
            <div style={{ fontWeight: 900, marginTop: 6 }}>
              {settings.workCalendar.startHour}:00 تا {settings.workCalendar.endHour}:00
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 16, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Pause در Pending</div>
            <div style={{ fontWeight: 900, marginTop: 6 }}>
              {settings.workCalendar.pauseOnPending ? "فعال" : "غیرفعال"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
