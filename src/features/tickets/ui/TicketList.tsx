import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../shared/ui/Card/Card";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/Button/Button";
import { Ticket } from "../../../shared/types/ticket";
import { CreateTicketModal } from "./CreateTicketModal";
import styles from "./TicketList.module.css";

type Props = { tickets: Ticket[]; onCreate: (t: Ticket) => void };

function statusText(s: Ticket["status"]) {
  return s === "open" ? "باز" : s === "pending" ? "در انتظار" : "بسته";
}

function badgeBg(status: Ticket["status"]) {
  if (status === "open") return "rgba(37,99,235,0.22)";
  if (status === "pending") return "rgba(245,158,11,0.18)";
  return "rgba(22,163,74,0.16)";
}

export function TicketList({ tickets, onCreate }: Props) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim();
    if (!query) return tickets;
    return tickets.filter((t) => (t.title + " " + t.id).includes(query));
  }, [q, tickets]);

  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.h}>تیکت‌ها</div>
          <div className={styles.sub}>جستجو، مشاهده و مدیریت تیکت‌ها</div>
        </div>

        <Button onClick={() => setOpen(true)}>تیکت جدید</Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="جستجو با عنوان یا کد تیکت…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="secondary">فیلتر پیشرفته</Button>
      </div>

      <div className={styles.list}>
        {filtered.map((t) => (
          <div key={t.id} className={styles.row}>
            <div className={styles.main}>
              <div className={styles.title}>{t.title}</div>
              <div className={styles.meta}>
                <span className={styles.code}>{t.id}</span>
                <span className={styles.dot}>•</span>
                <span>{t.department}</span>
              </div>
            </div>

            <div className={styles.right}>
              <span className={styles.badge} style={{ background: badgeBg(t.status) }}>
                {statusText(t.status)}
              </span>
              <Button size="sm" variant="ghost" onClick={() => nav(`/tickets/${t.id}`)}>
                مشاهده
              </Button>
            </div>
          </div>
        ))}

        {filtered.length === 0 ? <div className={styles.empty}>نتیجه‌ای پیدا نشد.</div> : null}
      </div>

      <CreateTicketModal isOpen={open} onClose={() => setOpen(false)} onCreate={onCreate} />
    </Card>
  );
}
