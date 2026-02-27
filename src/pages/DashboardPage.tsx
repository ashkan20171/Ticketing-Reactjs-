import React from "react";
import { useI18n } from "../app/providers/I18nProvider";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { useTickets } from "../app/providers/TicketsProvider";
import { useSettings } from "../app/providers/SettingsProvider";
import { Ticket } from "../shared/types/ticket";
import { PieChart } from "../shared/ui/PieChart";
import { BarChart } from "../shared/ui/charts/BarChart";
import { LineChart } from "../shared/ui/charts/LineChart";
import { Skeleton } from "../shared/ui/Skeleton";

function isSlaBreached(t: Ticket, slaHours: number) {
  if (t.status !== "open") return false;
  const ageMs = Date.now() - new Date(t.createdAt).getTime();
  return ageMs > slaHours * 60 * 60 * 1000;
}

export function DashboardPage() {
  const { t, lang } = useI18n();
  const [range, setRange] = React.useState<"7" | "30" | "all">("30");
  const { tickets, loading } = useTickets();
  const { settings } = useSettings();

  const visibleTickets = React.useMemo(() => {
    if (range === "all") return tickets;
    const days = range === "7" ? 7 : 30;
    const from = Date.now() - days * 24 * 60 * 60 * 1000;
    return tickets.filter((t) => new Date(t.createdAt).getTime() >= from);
  }, [tickets, range]);

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

    return { open, pending, closed, sla, total, byDept };
  }, [visibleTickets, settings.slaHours]);

  const trend = React.useMemo(() => {
    const days = range === "7" ? 7 : range === "30" ? 30 : 14;
    const list: { label: string; value: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const count = visibleTickets.filter((t) => t.createdAt.slice(0, 10) === key).length;
      list.push({
        label: d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", { month: "2-digit", day: "2-digit" }),
        value: count,
      });
    }

    return list;
  }, [visibleTickets, range]);

  return (
    <div style={{ padding: 12, display: "grid", gap: 14 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontWeight: 900 }}>{t("بازه گزارش:")}</div>
        <Button variant={range === "7" ? "secondary" : "ghost"} onClick={() => setRange("7")}>
          {t("۷ روز")}
        </Button>
        <Button variant={range === "30" ? "secondary" : "ghost"} onClick={() => setRange("30")}>
          {t("۳۰ روز")}
        </Button>
        <Button variant={range === "all" ? "secondary" : "ghost"} onClick={() => setRange("all")}>
          {t("همه")}
        </Button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          <Card>
            <div style={{ display: "grid", gap: 10 }}>
              <Skeleton h={20} w="42%" />
              <Skeleton h={14} w="86%" />
              <Skeleton h={14} w="74%" />
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <div style={{ display: "grid", gap: 10 }}>
                  <Skeleton h={16} w="60%" />
                  <Skeleton h={34} w="40%" />
                  <Skeleton h={12} w="80%" />
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <Skeleton h={260} />
          </Card>
        </div>
      ) : null}

      {!loading ? (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12 }}>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{t("کل")}</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.total}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{t("باز")}</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.open}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{t("در انتظار")}</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.pending}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{t("بسته")}</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.closed}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>SLA</div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.sla}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <BarChart
            title={t("مقایسه وضعیت‌ها")}
            items={[
              { label: t("باز"), value: stats.open },
              { label: t("در انتظار"), value: stats.pending },
              { label: t("بسته"), value: stats.closed },
            ]}
          />
        </Card>
        <Card>
          <BarChart
            title={t("مقایسه دپارتمان‌ها")}
            items={[
              { label: t("فنی"), value: stats.byDept["فنی"] },
              { label: t("مالی"), value: stats.byDept["مالی"] },
              { label: t("فروش"), value: stats.byDept["فروش"] },
            ]}
          />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <LineChart title={t("روند ایجاد تیکت")} series={trend} />
        </Card>
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>{t("نسبت وضعیت‌ها")}</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <PieChart open={stats.open} pending={stats.pending} closed={stats.closed} />
            <div style={{ display: "grid", gap: 8, color: "var(--muted)", fontSize: 13 }}>
              <div>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: "#2563eb", marginLeft: 8 }} />{" "}
                {t("باز")}: <b style={{ color: "var(--text)" }}>{stats.open}</b>
              </div>
              <div>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: "#f59e0b", marginLeft: 8 }} />{" "}
                {t("در انتظار")}: <b style={{ color: "var(--text)" }}>{stats.pending}</b>
              </div>
              <div>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: "#16a34a", marginLeft: 8 }} />{" "}
                {t("بسته")}: <b style={{ color: "var(--text)" }}>{stats.closed}</b>
              </div>
            </div>
          </div>
        </Card>
      </div>
          ) : null}

</div>
  );
}
