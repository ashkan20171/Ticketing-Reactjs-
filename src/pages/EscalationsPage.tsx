import { useMemo, useState } from "react";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { useToast } from "../app/providers/ToastProvider";
import { useLogs } from "../app/providers/LogsProvider";
import { getUser } from "../features/auth/model/auth";
import { defaultEscalationRules, useEscalationRules } from "../app/providers/EscalationRulesProvider";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function EscalationsPage() {
  const { toast } = useToast();
  const { addLog } = useLogs();
  const actor = getUser();
  const { rules, setRules } = useEscalationRules();

  const [draft, setDraft] = useState(() => rules);

  const save = () => {
    const next = {
      ...draft,
      checkIntervalMs: clamp(Math.round(draft.checkIntervalMs), 1000, 60000),
      atRiskThresholdPct: clamp(draft.atRiskThresholdPct, 0.05, 0.5),
    };
    setRules(next);
    toast({ type: "success", title: "ذخیره شد", message: "قوانین Escalation ذخیره شد." });
    addLog({ action: "UPDATE_ESCALATION_RULES", message: JSON.stringify(next), actorEmail: actor?.email });
  };

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(rules), [draft, rules]);

  return (
    <div style={{ padding: 12, display: "grid", gap: 12, maxWidth: 980 }}>
      <Card>
        <div style={{ fontWeight: 900, fontSize: 16 }}>قوانین Escalation</div>
        <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13, lineHeight: 1.8 }}>
          قوانین escalation مشخص می‌کند چه زمانی سیستم هشدار دهد و آیا روی نقض SLA اولویت را افزایش دهد یا نه.
        </div>
      </Card>

      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={draft.enabled}
              onChange={(e) => setDraft((p) => ({ ...p, enabled: e.target.checked }))}
            />
            <span style={{ fontWeight: 900 }}>فعال بودن مانیتورینگ SLA</span>
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>بازه بررسی (ms)</span>
              <input
                value={draft.checkIntervalMs}
                onChange={(e) => setDraft((p) => ({ ...p, checkIntervalMs: Number(e.target.value) }))}
                inputMode="numeric"
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              <span style={{ fontSize: 12, color: "var(--muted)" }}>1000 تا 60000</span>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>آستانه «در خطر»</span>
              <input
                value={draft.atRiskThresholdPct}
                onChange={(e) => setDraft((p) => ({ ...p, atRiskThresholdPct: Number(e.target.value) }))}
                inputMode="decimal"
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              <span style={{ fontSize: 12, color: "var(--muted)" }}>۰.۰۵ تا ۰.۵ (مثلاً ۰.۱۵)</span>
            </label>
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={draft.notifyAtRisk}
              onChange={(e) => setDraft((p) => ({ ...p, notifyAtRisk: e.target.checked }))}
            />
            <span>ارسال اعلان برای «در خطر»</span>
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={draft.notifyBreach}
              onChange={(e) => setDraft((p) => ({ ...p, notifyBreach: e.target.checked }))}
            />
            <span>ارسال اعلان برای «نقض SLA»</span>
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={draft.autoEscalateOnBreach}
              onChange={(e) => setDraft((p) => ({ ...p, autoEscalateOnBreach: e.target.checked }))}
            />
            <span>افزایش خودکار اولویت هنگام نقض SLA</span>
          </label>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={() => setDraft(defaultEscalationRules)}>
              پیش‌فرض‌ها
            </Button>
            <Button variant="secondary" onClick={save} disabled={!dirty}>
              ذخیره قوانین
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
