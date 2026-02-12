import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { computeSlaState, formatDuration } from "../../shared/lib/sla";
import { useSettings } from "./SettingsProvider";
import { useToast } from "./ToastProvider";
import { useLogs } from "./LogsProvider";
import { useNotifications } from "./NotificationsProvider";
import { getUser } from "../../features/auth/model/auth";
import { Ticket, TicketMessage, TicketStatus } from "../../shared/types/ticket";
import { mockTickets } from "../../features/tickets/model/mockTickets";

type Ctx = {
  tickets: Ticket[];
  loading: boolean;
  addTicket: (t: Ticket) => void;
  setStatus: (id: string, status: TicketStatus, actor: "user" | "agent") => void;
  addMessage: (id: string, msg: TicketMessage) => void;
  getById: (id: string) => Ticket | undefined;
};


function nextPriority(p: Ticket["priority"]): Ticket["priority"] {
  if (p === "low") return "normal";
  if (p === "normal") return "high";
  if (p === "high") return "urgent";
  return "urgent";
}

function prioFa(p: Ticket["priority"]) {
  if (p === "urgent") return "فوری";
  if (p === "high") return "بالا";
  if (p === "normal") return "عادی";
  return "کم";
}

const TicketsCtx = createContext<Ctx | null>(null);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  // Simulate initial fetch delay (mock)
  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const { settings } = useSettings();
  const { toast } = useToast();
  const { addLog } = useLogs();
  const { push } = useNotifications();
  const actor = getUser();

  // prevent toast spam across re-renders
  const notifiedRef = useRef<Record<string, { atRisk?: boolean; breached?: boolean }>>({});

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setTickets((prev) => {
        let changed = false;
        const next = prev.map((t) => {
          if (t.status === "closed") return t;

          const sla = computeSlaState({
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            status: t.status,
            priority: t.priority,
            firstResponseAt: t.firstResponseAt,
            config: { calendar: settings.workCalendar, policy: settings.slaPolicy },
          });

          const key = t.id;
          const seen = notifiedRef.current[key] ?? {};
          const worst = Math.min(sla.firstResponseRemainingMs, sla.resolutionRemainingMs);

          // At risk notification (once)
          if (sla.atRisk && !seen.atRisk && !sla.firstResponseBreached && !sla.resolutionBreached) {
            notifiedRef.current[key] = { ...seen, atRisk: true };
            toast({
              type: "warn",
              title: "SLA در خطر",
              message: `${t.id} • ${t.title} • باقی‌مانده: ${formatDuration(worst)}`,
              ttlMs: 5200,
            });
            push({
              type: "warn",
              title: "SLA در خطر",
              message: `${t.id} • ${t.title} • باقی‌مانده: ${formatDuration(worst)}`,
              href: `/tickets/${t.id}`,
            });
            addLog({
              level: "warn",
              action: "SLA_AT_RISK",
              message: `SLA at risk for ${t.id} (${t.title}). Remaining: ${formatDuration(worst)}`,
              actorEmail: actor?.email,
            });
          }

          const breached = sla.firstResponseBreached || sla.resolutionBreached;
          if (breached && !seen.breached) {
            notifiedRef.current[key] = { ...seen, breached: true };

            // auto escalation: bump priority (unless urgent) + add system message
            const newP = nextPriority(t.priority);
            const nowIso = new Date().toISOString();
            const msgText =
              newP !== t.priority
                ? `⛔ SLA نقض شد. اولویت به «${prioFa(newP)}» افزایش یافت. (${formatDuration(worst)})`
                : `⛔ SLA نقض شد. (${formatDuration(worst)})`;

            toast({
              type: "error",
              title: "SLA نقض شد",
              message: `${t.id} • ${t.title} • ${msgText}`,
              ttlMs: 6200,
            });
            push({
              type: "error",
              title: "SLA نقض شد",
              message: `${t.id} • ${t.title} • ${msgText}`,
              href: `/tickets/${t.id}`,
            });
            addLog({
              level: "error",
              action: "SLA_BREACHED",
              message: `SLA breached for ${t.id} (${t.title}). ${msgText}`,
              actorEmail: actor?.email,
            });

            changed = true;
            return {
              ...t,
              priority: newP,
              updatedAt: nowIso,
              messages: [
                ...t.messages,
                { id: `m-${Date.now()}`, author: "system", text: msgText, createdAt: nowIso },
              ],
            };
          }

          return t;
        });

        return changed ? next : prev;
      });
    }, 5000); // check every 5s

    return () => window.clearInterval(interval);
  }, [settings, toast, addLog, push, actor]);


  const api = useMemo<Ctx>(() => ({
    tickets,
    loading,
    addTicket: (t) => setTickets((p) => [t, ...p]),
    getById: (id) => tickets.find((t) => t.id === id),
    addMessage: (id, msg) => {
      setTickets((p) =>
        p.map((t) =>
          t.id === id
            ? { ...t, updatedAt: new Date().toISOString(), messages: [...t.messages, msg] }
            : t
        )
      );
    },
    setStatus: (id, status, actor) => {
      setTickets((p) =>
        p.map((t) => {
          if (t.id !== id) return t;
          const now = new Date().toISOString();
          const sysMsg: TicketMessage = {
            id: `m-${Date.now()}`,
            author: actor,
            text: `وضعیت تیکت به «${status}» تغییر کرد.`,
            createdAt: now,
          };
          return { ...t, status, updatedAt: now, messages: [...t.messages, sysMsg] };
        })
      );
    },
  }), [tickets, loading]);

  return <TicketsCtx.Provider value={api}>{children}</TicketsCtx.Provider>;
}

export function useTickets() {
  const v = useContext(TicketsCtx);
  if (!v) throw new Error("useTickets must be used inside TicketsProvider");
  return v;
}
