import { Ticket } from "../../../shared/types/ticket";

const now = Date.now();
const mk = (daysAgo: number) => new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();

export const mockTickets: Ticket[] = [
  {
    id: "TK-1001",
    title: "مشکل ورود به حساب کاربری",
    department: "فنی",
    status: "open",
    priority: "high",
    createdAt: mk(1),
    updatedAt: mk(1),
    requesterEmail: "user@example.com",
    messages: [{ id: "m1", author: "user", text: "نمیتونم وارد شم", createdAt: mk(1) }],
  },
  {
    id: "TK-1002",
    title: "درخواست فاکتور رسمی",
    department: "مالی",
    status: "pending",
    priority: "normal",
    createdAt: mk(4),
    updatedAt: mk(3),
    requesterEmail: "user@example.com",
    messages: [{ id: "m2", author: "user", text: "فاکتور رسمی می‌خوام", createdAt: mk(4) }],
  },
  {
    id: "TK-1003",
    title: "سوال درباره قیمت سرویس",
    department: "فروش",
    status: "closed",
    priority: "low",
    createdAt: mk(10),
    updatedAt: mk(8),
    requesterEmail: "client@example.com",
    messages: [{ id: "m3", author: "user", text: "قیمت پلن سازمانی چقدره؟", createdAt: mk(10) }],
  },
  {
    id: "TK-1004",
    title: "قطعی سرویس و خطای 500",
    department: "فنی",
    status: "open",
    priority: "urgent",
    createdAt: mk(0),
    updatedAt: mk(0),
    requesterEmail: "vip@example.com",
    messages: [{ id: "m4", author: "user", text: "سرویس بالا نمیاد و خطای ۵۰۰ میده", createdAt: mk(0) }],
  },
];
