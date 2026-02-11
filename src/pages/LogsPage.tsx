import { useMemo, useState } from "react";
import { Card } from "../shared/ui/Card/Card";
import { Input } from "../shared/ui/Input/Input";
import { Button } from "../shared/ui/Button/Button";
import { useLogs } from "../app/providers/LogsProvider";

export function LogsPage() {
  const { logs, clear } = useLogs();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return logs;
    return logs.filter(l =>
      (l.action + " " + l.message + " " + (l.actorEmail ?? "")).toLowerCase().includes(s)
    );
  }, [logs, q]);

  return (
    <div style={{ padding: 12, display: "grid", gap: 12 }}>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", gap: 12, alignItems:"center" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>لاگ عملیات</div>
            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
              ثبت فعالیت‌های مهم سیستم (دمو - LocalStorage)
            </div>
          </div>
          <Button variant="secondary" onClick={clear}>پاک کردن</Button>
        </div>
      </Card>

      <Card>
        <Input placeholder="جستجو در لاگ..." value={q} onChange={(e)=>setQ(e.target.value)} />
      </Card>

      <Card>
        <div style={{ display:"grid", gap: 10 }}>
          {filtered.map(l => (
            <div key={l.id} style={{
              padding: 12,
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.03)"
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap: 12 }}>
                <div style={{ fontWeight: 900 }}>{l.action}</div>
                <div style={{ color:"var(--muted)", fontSize: 12 }}>{new Date(l.createdAt).toLocaleString("fa-IR")}</div>
              </div>
              <div style={{ marginTop: 6, color:"var(--muted)", fontSize: 13, lineHeight: 1.8 }}>
                {l.message}
              </div>
              {l.actorEmail ? (
                <div style={{ marginTop: 6, fontSize: 12, color:"var(--muted)" }}>
                  Actor: {l.actorEmail} • Level: {l.level}
                </div>
              ) : null}
            </div>
          ))}
          {filtered.length === 0 ? <div style={{ color:"var(--muted)" }}>لاگی وجود ندارد.</div> : null}
        </div>
      </Card>
    </div>
  );
}
