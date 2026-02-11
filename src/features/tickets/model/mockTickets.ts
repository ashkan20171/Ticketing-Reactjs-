import { Ticket } from "../../../shared/types/ticket";

export const mockTickets: Ticket[] = [
  {
    id: "TK-1001",
    title: "مشکل ورود به حساب کاربری",
    department: "فنی",
    status: "open",
    priority: "high",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-02-11T08:30:00.000Z",
    messages: [
      {
        id: "m1",
        author: "user",
        text: "سلام، وارد حسابم نمیشه و خطای نامعتبر میده.",
        createdAt: "2026-02-10T09:05:00.000Z",
      },
      {
        id: "m2",
        author: "agent",
        text: "سلام. لطفاً ایمیل حساب و اسکرین‌شات خطا رو ارسال کنید.",
        createdAt: "2026-02-10T09:20:00.000Z",
      },
    ],
  },
  {
    id: "TK-1002",
    title: "درخواست فاکتور رسمی",
    department: "مالی",
    status: "pending",
    priority: "normal",
    createdAt: "2026-02-09T10:30:00.000Z",
    updatedAt: "2026-02-10T12:00:00.000Z",
    messages: [
      {
        id: "m3",
        author: "user",
        text: "برای پرداخت سازمانی، فاکتور رسمی لازم دارم.",
        createdAt: "2026-02-09T10:35:00.000Z",
      },
      {
        id: "m4",
        author: "agent",
        text: "شماره اقتصادی و اطلاعات حقوقی رو ارسال کنید تا صادر کنیم.",
        createdAt: "2026-02-09T11:10:00.000Z",
      },
    ],
  },
  {
    id: "TK-1003",
    title: "استعلام قیمت سرویس سازمانی",
    department: "فروش",
    status: "closed",
    priority: "low",
    createdAt: "2026-02-06T14:20:00.000Z",
    updatedAt: "2026-02-07T09:10:00.000Z",
    messages: [
      {
        id: "m5",
        author: "user",
        text: "قیمت پلن سازمانی برای 30 کاربر چنده؟",
        createdAt: "2026-02-06T14:22:00.000Z",
      },
      {
        id: "m6",
        author: "agent",
        text: "ارسال شد. اگر سوالی بود در خدمتیم.",
        createdAt: "2026-02-06T15:10:00.000Z",
      },
    ],
  },
];
