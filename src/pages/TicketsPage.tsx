import { useMemo, useState } from "react";
import { TicketList } from "../features/tickets/ui/TicketList";
import { mockTickets } from "../features/tickets/model/mockTickets";
import { Ticket } from "../shared/types/ticket";
import { getUser } from "../features/auth/model/auth";

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const user = getUser();

  const visibleTickets = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return tickets;
    if (user.role === "agent")
      return tickets.filter(t => t.department === user.department);
    return tickets.filter(t => t.requesterEmail === user.email);
  }, [tickets, user]);

  return (
    <div style={{ padding: 12 }}>
      <TicketList
        tickets={visibleTickets}
        onCreate={(t) => setTickets((p) => [t, ...p])}
      />
    </div>
  );
}
