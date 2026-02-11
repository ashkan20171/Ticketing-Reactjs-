import React from "react";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { useTickets } from "../app/providers/TicketsProvider";
import { useSettings } from "../app/providers/SettingsProvider";
import { getUser } from "../features/auth/model/auth";
import { Ticket } from "../shared/types/ticket";
import { PieChart } from "../shared/ui/PieChart";
import { BarChart } from "../shared/ui/charts/BarChart";
import { LineChart } from "../shared/ui/charts/LineChart";

function isSlaBreached(t: Ticket, slaHours: number) {
  if (t.status !== "open") return false;
  const ageMs = Date.now() - new Date(t.createdAt).getTime();
  return ageMs > slaHours * 60 * 60 * 1000;
}

export function MyDashboardPage() {
  const [range, setRange] = React.useState<"7" | "30" | "all">("30");
  const { tickets } = useTickets();
  const { settings } = useSettings();
  const user = getUser();

  const myTickets = React.useMemo(() => {
    // Admin can see everything here too, but they already have /dashboard.
    if (user?.role === "admin") return tickets;
    return tickets.filter((t) => t.requesterEmail === user?.email);
  }, [tickets, user?.email, user?.role]);

  const visibleTickets = React.useMemo(() => {
    if (range === "all") return myTickets;
    const days = range === "7" ? 7 : 30;
    const from = Date.now() - days * 24 * 60 * 60 * 1000;
    return myTickets.filter((t) => new Date(t.createdAt).getTime() >= from);
  }, [myTickets, range]);

  const stats = React.useMemo(() => {
    const open = visibleTickets.filter((t) => t.status === "open").length;
    const pending = visibleTickets.filter((t) => t.status === "pending").length;
    const closed = visibleTickets.filter((t) => t.status === "closed").length;
    const sla = visibleTickets.filter((t) => isSlaBreached(t, settings.slaHours)).length;
    const total = visibleTickets.length;

    const byDept = {
      "فنی": visibleTickets.filter((t) => t.department === "فنی").length,
      "مالی": visibleTickets.filter((t) => t.department === "مالی").length,
      "فروش": visibleTickets.filter((t) => t.department === "فروش").length,
    };

    const byPriority = {
      low: visibleTickets.filter((t) => t.priority === "low").length,
      normal: visibleTickets.filter((t) => t.priority === "normal").length,
      high: visibleTickets.filter((t) => t.priority === "high").length,
      urgent: visibleTickets.filter((t) => t.priority === "urgent").length,
    };

    return { open, pending, closed, sla, total, byDept, byPriority };
  }, [visibleTickets, settings.slaHours]);

  const trend = React.useMemo(() => {
    const days = range === "7" ? 7 : range === "30" ? 30 : 14;
    const list: { label: string; value: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const count = visibleTickets.filter((t) => t.createdAt.slice(0, 10) === key).length;
      list.push({
        label: d.toLocaleDateString("fa-IR", { month: "2-digit", day: "2-digit" }),
        value: count,
      });
    }
    return list;
  }, [visibleTickets, range]);

  return (
    <div style={{ padding: 12, display: "grid", gap: 14 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>داشبورد شما</div>
            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
              وضعیت تیکت‌های شما • {user?.email}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ fontWeight: 900 }}>بازه:</div>
            <Button variant={range === "7" ? "secondary" : "ghost"} onClick={() => setRange("7")}>۷ روز</Button>
            <Button variant={range === "30" ? "secondary" : "ghost"} onClick={() => setRange("30")}>۳۰ روز</Button>
            <Button variant={range === "all" ? "secondary" : "ghost"} onClick={() => setRange("all")}>همه</Button>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>کل</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.total}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>باز</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.open}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>در انتظار</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.pending}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>SLA</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.sla}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <LineChart title="روند ایجاد تیکت‌های شما" series={trend} />
        </Card>
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>نسبت وضعیت‌ها</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <PieChart open={stats.open} pending={stats.pending} closed={stats.closed} />
            <div style={{ display: "grid", gap: 8, color: "var(--muted)", fontSize: 13 }}>
              <div><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: "#2563eb", marginLeft: 8 }} /> باز: <b style={{ color: "var(--text)" }}>{stats.open}</b></div>
              <div><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: "#f59e0b", marginLeft: 8 }} /> در انتظار: <b style={{ color: "var(--text)" }}>{stats.pending}</b></div>
              <div><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: "#16a34a", marginLeft: 8 }} /> بسته: <b style={{ color: "var(--text)" }}>{stats.closed}</b></div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <BarChart
            title="تیکت‌ها بر اساس دپارتمان"
            items={[
              { label: "فنی", value: stats.byDept["فنی"] },
              { label: "مالی", value: stats.byDept["مالی"] },
              { label: "فروش", value: stats.byDept["فروش"] },
            ]}
          />
        </Card>
        <Card>
          <BarChart
            title="اولویت‌ها"
            items={[
              { label: "Low", value: stats.byPriority.low },
              { label: "Normal", value: stats.byPriority.normal },
              { label: "High", value: stats.byPriority.high },
              { label: "Urgent", value: stats.byPriority.urgent },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
