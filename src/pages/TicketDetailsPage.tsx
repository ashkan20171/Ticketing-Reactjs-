import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockTickets } from "../features/tickets/model/mockTickets";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { getUser } from "../features/auth/model/auth";

export function TicketDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const ticket = useMemo(()=>mockTickets.find(t=>t.id===id),[id]);
  const user = getUser();
  const canInternal = user?.role==="admin"||user?.role==="agent";

  if(!ticket) return <Card>پیدا نشد</Card>;

  return (
    <div style={{ display:"grid", gap:16 }}>
      <Card>
        <h2>{ticket.title}</h2>
        {ticket.messages.map(m=><div key={m.id}>{m.text}</div>)}
      </Card>

      {canInternal && (
        <Card>
          <strong>یادداشت داخلی</strong>
          <div style={{marginTop:8, fontSize:13}}>فقط مدیر/اپراتور می‌بیند.</div>
        </Card>
      )}

      <Button onClick={()=>nav("/")}>بازگشت</Button>
    </div>
  );
}
