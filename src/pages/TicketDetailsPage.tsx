import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockTickets } from "../features/tickets/model/mockTickets";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { Input } from "../shared/ui/Input/Input";
import { TicketMessage } from "../shared/types/ticket";

function statusText(s: string) {
  if (s === "open") return "باز";
  if (s === "pending") return "در انتظار";
  return "بسته";
}
function priorityText(p: string) {
  if (p === "low") return "کم";
  if (p === "normal") return "عادی";
  if (p === "high") return "بالا";
  return "فوری";
}

export function TicketDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const ticket = useMemo(() => mockTickets.find((t) => t.id === id), [id]);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<TicketMessage[]>(ticket?.messages ?? []);

  if (!ticket) {
    return (
      <Card>
        <h2 style={{ marginTop: 0 }}>تیکت پیدا نشد</h2>
        <Button onClick={() => nav("/")}>بازگشت</Button>
      </Card>
    );
  }

  const send = () => {
    const v = text.trim();
    if (!v) return;
    const msg: TicketMessage = {
      id: `m-${Date.now()}`,
      author: "user",
      text: v,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>{ticket.title}</h2>
            <div style={{ marginTop: 6, opacity: 0.8, fontSize: 13 }}>
              {ticket.id} • {ticket.department}
            </div>
          </div>
          <Button variant="secondary" onClick={() => nav("/")}>بازگشت</Button>
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.author === "user" ? "flex-start" : "flex-end",
                maxWidth: "75%",
                padding: 12,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: m.author === "user" ? "rgba(37,99,235,0.14)" : "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
                {m.author === "user" ? "کاربر" : "اپراتور"} • {new Date(m.createdAt).toLocaleString("fa-IR")}
              </div>
              <div style={{ lineHeight: 1.8 }}>{m.text}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
          <Input
            placeholder="پاسخ خود را بنویسید…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <Button onClick={send}>ارسال</Button>
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>جزئیات</h3>
        <div style={{ display: "grid", gap: 10, fontSize: 14, opacity: 0.95 }}>
          <div>وضعیت: <b>{statusText(ticket.status)}</b></div>
          <div>اولویت: <b>{priorityText(ticket.priority)}</b></div>
          <div>ایجاد: <b>{new Date(ticket.createdAt).toLocaleString("fa-IR")}</b></div>
          <div>آخرین بروزرسانی: <b>{new Date(ticket.updatedAt).toLocaleString("fa-IR")}</b></div>
        </div>

        <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
          <Button variant="secondary">تغییر وضعیت</Button>
          <Button variant="secondary">ارجاع به دپارتمان</Button>
          <Button variant="secondary">یادداشت داخلی</Button>
        </div>
      </Card>
    </div>
  );
}
