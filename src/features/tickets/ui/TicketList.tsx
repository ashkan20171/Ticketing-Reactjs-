import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../../shared/ui/Card/Card";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/Button/Button";
import { Ticket, TicketPriority, TicketStatus } from "../../../shared/types/ticket";
import { CreateTicketModal } from "./CreateTicketModal";
import styles from "./TicketList.module.css";
import { getUser } from "../../../features/auth/model/auth";
import { downloadTextFile, toCsv } from "../../../shared/lib/csv";
import { useToast } from "../../../app/providers/ToastProvider";
import { useSettings } from "../../../app/providers/SettingsProvider";

type Props = { tickets: Ticket[]; onCreate: (t: Ticket) => void };
type SortKey = "newest" | "oldest" | "priority";
type Filters = {
  status: "all" | TicketStatus;
  department: "all" | Ticket["department"];
  priority: "all" | TicketPriority;
  sort: SortKey;
};

function statusText(s: TicketStatus) {
  return s === "open" ? "باز" : s === "pending" ? "در انتظار" : "بسته";
}

function badgeBg(status: TicketStatus) {
  if (status === "open") return "rgba(37,99,235,0.22)";
  if (status === "pending") return "rgba(245,158,11,0.18)";
  return "rgba(22,163,74,0.16)";
}

function priorityRank(p: TicketPriority) {
  if (p === "urgent") return 4;
  if (p === "high") return 3;
  if (p === "normal") return 2;
  return 1;
}

function isSlaBreached(t: Ticket, slaHours: number) {
  if (t.status !== "open") return false;
  const ageMs = Date.now() - new Date(t.createdAt).getTime();
  return ageMs > slaHours * 60 * 60 * 1000;
}

export function TicketList({ tickets, onCreate }: Props) {
  const nav = useNavigate();
  const { toast } = useToast();
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const { settings } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();

  // init from URL
  const initialQ = searchParams.get("q") ?? "";
  const initialStatus = (searchParams.get("status") ?? "all") as Filters["status"];
  const initialDepartment = (searchParams.get("department") ?? "all") as Filters["department"];
  const initialPriority = (searchParams.get("priority") ?? "all") as Filters["priority"];
  const initialSort = (searchParams.get("sort") ?? "newest") as Filters["sort"];
  const initialPage = Number(searchParams.get("page") ?? "1") || 1;

  const [q, setQ] = useState(initialQ);
  const [openCreate, setOpenCreate] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: initialStatus,
    department: initialDepartment,
    priority: initialPriority,
    sort: initialSort,
  });

  // Pagination
  const [page, setPage] = useState(initialPage);
  const pageSize = 5;

  // keep URL in sync
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (filters.status !== "all") sp.set("status", filters.status);
    if (filters.department !== "all") sp.set("department", filters.department);
    if (filters.priority !== "all") sp.set("priority", filters.priority);
    if (filters.sort !== "newest") sp.set("sort", filters.sort);
    if (page !== 1) sp.set("page", String(page));
    setSearchParams(sp, { replace: true });
  }, [q, filters.status, filters.department, filters.priority, filters.sort, page, setSearchParams]);

  // reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [q, filters.status, filters.department, filters.priority, filters.sort]);

  const processed = useMemo(() => {
    const query = q.trim();
    let list = tickets;

    // search
    if (query) {
      list = list.filter((t) => (t.title + " " + t.id).includes(query));
    }

    // filters
    if (filters.status !== "all") list = list.filter((t) => t.status === filters.status);
    if (filters.department !== "all") list = list.filter((t) => t.department === filters.department);
    if (filters.priority !== "all") list = list.filter((t) => t.priority === filters.priority);

    // sort
    return [...list].sort((a, b) => {
      if (filters.sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      const pr = priorityRank(b.priority) - priorityRank(a.priority);
      if (pr !== 0) return pr;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tickets, q, filters]);

  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, page]);

  const resetFilters = () => {
    setFilters({ status: "all", department: "all", priority: "all", sort: "newest" });
  };

  const exportCsv = () => {
    const headers = ["id", "title", "department", "status", "priority", "createdAt", "requesterEmail"];
    const rows = processed.map((t) => ({
      id: t.id,
      title: t.title,
      department: t.department,
      status: t.status,
      priority: t.priority,
      createdAt: t.createdAt,
      requesterEmail: t.requesterEmail,
    }));
    const csv = toCsv(rows as any, headers);
    downloadTextFile(`ashkan-tickets-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    toast({ type: "success", title: "خروجی گرفته شد", message: "فایل CSV دانلود شد." });
  };

  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.h}>تیکت‌ها</div>
          <div className={styles.sub}>جستجو، فیلتر، مرتب‌سازی و مدیریت تیکت‌ها</div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {isAdmin ? (
            <Button variant="secondary" onClick={exportCsv}>
              خروجی CSV
            </Button>
          ) : null}
          <Button onClick={() => setOpenCreate(true)}>تیکت جدید</Button>
        </div>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="جستجو با عنوان یا کد تیکت…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Button variant="secondary" onClick={() => setAdvancedOpen((v) => !v)} aria-expanded={advancedOpen}>
          فیلتر پیشرفته
        </Button>
      </div>

      {advancedOpen ? (
        <div className={styles.advanced}>
          <div className={styles.advancedGrid}>
            <label className={styles.field}>
              <span className={styles.label}>وضعیت</span>
              <select
                className={styles.select}
                value={filters.status}
                onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value as Filters["status"] }))}
              >
                <option value="all">همه</option>
                <option value="open">باز</option>
                <option value="pending">در انتظار</option>
                <option value="closed">بسته</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>دپارتمان</span>
              <select
                className={styles.select}
                value={filters.department}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, department: e.target.value as Filters["department"] }))
                }
              >
                <option value="all">همه</option>
                <option value="فنی">فنی</option>
                <option value="مالی">مالی</option>
                <option value="فروش">فروش</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>اولویت</span>
              <select
                className={styles.select}
                value={filters.priority}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, priority: e.target.value as Filters["priority"] }))
                }
              >
                <option value="all">همه</option>
                <option value="low">کم</option>
                <option value="normal">عادی</option>
                <option value="high">بالا</option>
                <option value="urgent">فوری</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>مرتب‌سازی</span>
              <select
                className={styles.select}
                value={filters.sort}
                onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value as SortKey }))}
              >
                <option value="newest">جدیدترین</option>
                <option value="oldest">قدیمی‌ترین</option>
                <option value="priority">بالاترین اولویت</option>
              </select>
            </label>
          </div>

          <div className={styles.advancedActions}>
            <div className={styles.count}>
              نتیجه: <b>{total}</b>
            </div>

            <div className={styles.actionBtns}>
              <Button variant="ghost" onClick={resetFilters}>
                ریست فیلترها
              </Button>
              <Button variant="secondary" onClick={() => setAdvancedOpen(false)}>
                بستن پنل
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.list}>
        {paged.map((t) => (
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
              {isSlaBreached(t, settings.slaHours) ? <span className={styles.sla}>SLA</span> : null}

              <span className={styles.badge} style={{ background: badgeBg(t.status) }}>
                {statusText(t.status)}
              </span>

              <Button size="sm" variant="ghost" onClick={() => nav(`/tickets/${t.id}`)}>
                مشاهده
              </Button>
            </div>
          </div>
        ))}

        {paged.length === 0 ? <div className={styles.empty}>نتیجه‌ای پیدا نشد.</div> : null}
      </div>

      <div className={styles.pager}>
        <div className={styles.pagerInfo}>
          صفحه <b>{page}</b> از <b>{totalPages}</b>
        </div>

        <div className={styles.pagerBtns}>
          <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            قبلی
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            بعدی
          </Button>
        </div>
      </div>

      <CreateTicketModal isOpen={openCreate} onClose={() => setOpenCreate(false)} onCreate={onCreate} />
    </Card>
  );
}
