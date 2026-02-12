import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockTickets } from "../features/tickets/model/mockTickets";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { getUser } from "../features/auth/model/auth";
import { SlaWidget } from "../shared/ui/SlaWidget";
import { Timeline } from "../shared/ui/Timeline";

function statusFa(s: string) {
  if (s === "open") return "باز";
  if (s === "pending") return "در انتظار";
  return "بسته";
}

function prioFa(p: string) {
  if (p === "urgent") return "فوری";
  if (p === "high") return "بالا";
  if (p === "normal") return "عادی";
  return "کم";
}

export function TicketDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const ticket = useMemo(() => mockTickets.find((t) => t.id === id), [id]);
  const user = getUser();
  const canInternal = user?.role === "admin" || user?.role === "agent";

  if (!ticket) return <Card>پیدا نشد</Card>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>{ticket.title}</h2>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
              {ticket.id} • {ticket.department} • {statusFa(ticket.status)} • اولویت: {prioFa(ticket.priority)}
            </div>
          </div>
          <Button variant="secondary" onClick={() => nav(-1)}>بازگشت</Button>
        </div>
      </Card>

      <SlaWidget ticket={ticket} />

      <Card>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>گفتگو</div>
        <div style={{ display: "grid", gap: 10 }}>
          {ticket.messages.map((m) => (
            <div
              key={m.id}
              style={{
                padding: 12,
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: m.author === "agent" ? "rgba(59,130,246,0.10)" : "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 900, fontSize: 13 }}>
                  {m.author === "agent" ? "اپراتور" : m.author === "system" ? "سیستم" : "کاربر"}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {new Date(m.createdAt).toLocaleString("fa-IR", { hour: "2-digit", minute: "2-digit", year: "numeric", month: "2-digit", day: "2-digit" })}
                </div>
              </div>
              <div style={{ marginTop: 6, lineHeight: 1.8, color: "var(--text)" }}>{m.text}</div>
            </div>
          ))}
        </div>
      </Card>

      <Timeline ticket={ticket} />

      {canInternal && (
        <Card>
          <strong>یادداشت داخلی</strong>
          <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>فقط مدیر/اپراتور می‌بیند.</div>
          <div style={{ marginTop: 10, padding: 12, borderRadius: 16, border: "1px dashed var(--border)", color: "var(--muted)", fontSize: 13 }}>
            این قسمت در نسخه بک‌اند به یادداشت‌های داخلی واقعی وصل می‌شود.
          </div>
        </Card>
      )}
    </div>
  );
}
