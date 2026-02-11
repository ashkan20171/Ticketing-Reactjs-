import { useState } from "react";
import { TicketList } from "../features/tickets/ui/TicketList";
import { mockTickets } from "../features/tickets/model/mockTickets";
import { Ticket } from "../shared/types/ticket";

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  return (
    <div style={{ padding: 12 }}>
      <TicketList tickets={tickets} onCreate={(t) => setTickets((p) => [t, ...p])} />
    </div>
  );
}
