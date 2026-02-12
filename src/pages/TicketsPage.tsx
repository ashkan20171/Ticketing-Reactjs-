import { useMemo, useState } from "react";
import { TicketList } from "../features/tickets/ui/TicketList";
import { useUserPrefs } from "../app/providers/UserPrefsProvider";
import { getUser } from "../features/auth/model/auth";
import { mockTickets } from "../features/tickets/model/mockTickets";
import { Ticket } from "../shared/types/ticket";

export function TicketsPage() {
  const { prefs } = useUserPrefs();
  const user = getUser();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const visibleTickets = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return tickets;

    // اگر نقش "agent" را بعداً اضافه کنیم، این بخش فعال می‌شود
    if ((user as any).role === "agent") {
      const dept = (user as any).department;
      return tickets.filter((t) => t.department === dept);
    }

    return tickets.filter((t) => t.requesterEmail === user.email);
  }, [tickets, user]);

  return (
    <div style={{ padding: 12 }}>
      {/* Quick Stats در نسخه v17 از مسیر Profile کنترل می‌شود (prefs.showQuickStats) */}
      <TicketList tickets={visibleTickets} onCreate={(t) => setTickets((p) => [t, ...p])} />
    </div>
  );
}
