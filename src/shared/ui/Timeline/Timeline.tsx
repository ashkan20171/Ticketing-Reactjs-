import { Card } from "../Card/Card";
import { Ticket } from "../../types/ticket";

function fmt(d: string) {
  try {
    const x = new Date(d);
    return x.toLocaleString("fa-IR", { hour: "2-digit", minute: "2-digit", year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return d;
  }
}

type Item = { at: string; title: string; desc?: string };

export function Timeline({ ticket }: { ticket: Ticket }) {
  const items: Item[] = [];

  items.push({ at: ticket.createdAt, title: "ایجاد تیکت", desc: "تیکت توسط کاربر ثبت شد." });

  if (ticket.firstResponseAt) {
    items.push({ at: ticket.firstResponseAt, title: "اولین پاسخ", desc: "اولین پاسخ اپراتور ثبت شد." });
  }

  if (ticket.status === "pending") {
    items.push({ at: ticket.updatedAt, title: "در انتظار", desc: "تیکت در وضعیت در انتظار قرار گرفت." });
  }

  if (ticket.status === "closed") {
    items.push({ at: ticket.updatedAt, title: "بسته شد", desc: "تیکت با موفقیت بسته شد." });
  } else if (ticket.updatedAt !== ticket.createdAt) {
    items.push({ at: ticket.updatedAt, title: "به‌روزرسانی", desc: "تغییراتی در تیکت اعمال شد." });
  }

  // Sort asc
  items.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <Card>
      <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>Timeline</div>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: "grid", gridTemplateColumns: "14px 1fr", gap: 12 }}>
            <div style={{ display: "grid", justifyItems: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: "rgba(59,130,246,0.85)" }} />
              {idx !== items.length - 1 ? (
                <div style={{ width: 2, height: "100%", background: "rgba(255,255,255,0.10)" }} />
              ) : null}
            </div>

            <div style={{ padding: 12, borderRadius: 16, border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 900 }}>{it.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{fmt(it.at)}</div>
              </div>
              {it.desc ? <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>{it.desc}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
