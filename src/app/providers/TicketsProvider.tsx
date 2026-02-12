import React, { createContext, useContext, useMemo, useState } from "react";
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

const TicketsCtx = createContext<Ctx | null>(null);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  // Simulate initial fetch delay (mock)
  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

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
