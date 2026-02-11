export type TicketStatus = "open" | "pending" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type TicketMessage = {
  id: string;
  author: "user" | "agent";
  text: string;
  createdAt: string;
};

export type Ticket = {
  id: string;
  title: string;
  department: "فنی" | "مالی" | "فروش";
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  requesterEmail: string;
};
