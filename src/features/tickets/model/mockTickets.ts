import { Ticket } from "../../../shared/types/ticket";

export const mockTickets: Ticket[] = [
  {
    id: "TK-1001",
    title: "مشکل ورود به حساب کاربری",
    department: "فنی",
    status: "open",
    priority: "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requesterEmail: "user1@example.com",
    messages: [{ id:"m1", author:"user", text:"نمیتونم وارد شم", createdAt:new Date().toISOString() }]
  },
  {
    id: "TK-1002",
    title: "درخواست فاکتور رسمی",
    department: "مالی",
    status: "pending",
    priority: "normal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requesterEmail: "user2@example.com",
    messages: [{ id:"m2", author:"user", text:"فاکتور میخوام", createdAt:new Date().toISOString() }]
  }
];
