import { useMemo } from "react";
import { TicketList } from "../features/tickets/ui/TicketList";
import { useUserPrefs } from "../app/providers/UserPrefsProvider";
import { getUser } from "../features/auth/model/auth";
import { useTickets } from "../app/providers/TicketsProvider";
import { Card } from "../shared/ui/Card/Card";
import { Skeleton } from "../shared/ui/Skeleton";

export function TicketsPage() {
  const { prefs } = useUserPrefs();
  const user = getUser();
  const { tickets, loading, addTicket } = useTickets();

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
      {loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <div style={{ display: "grid", gap: 10 }}>
                <Skeleton h={18} w="58%" />
                <Skeleton h={14} w="92%" />
                <Skeleton h={14} w="70%" />
                <div style={{ display: "flex", gap: 10 }}>
                  <Skeleton h={28} w={92} r={999} />
                  <Skeleton h={28} w={74} r={999} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <TicketList tickets={visibleTickets} onCreate={(t) => addTicket(t)} />
      )}
    </div>
  );
}
