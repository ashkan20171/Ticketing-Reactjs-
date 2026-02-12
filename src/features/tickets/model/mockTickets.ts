import { Ticket } from "../../../shared/types/ticket";

const now = Date.now();
const iso = (ms: number) => new Date(ms).toISOString();

export const mockTickets: Ticket[] = [
  {
    id: "TCK-1001",
    title: "مشکل ورود به سیستم",
    department: "فروش",
    status: "open",
    priority: "high",
    requesterEmail: "user1@example.com",
    createdAt: iso(now - 2 * 60 * 60 * 1000),
    updatedAt: iso(now - 30 * 60 * 1000),
    firstResponseAt: iso(now - 90 * 60 * 1000),
    messages: [
      { id: "m1", author: "user", text: "سلام، وارد پنل نمی‌تونم بشم.", createdAt: iso(now - 2 * 60 * 60 * 1000) },
      { id: "m2", author: "agent", text: "سلام، لطفاً خطای نمایش داده شده رو ارسال کنید.", createdAt: iso(now - 90 * 60 * 1000) },
      { id: "m3", author: "user", text: "پیغام invalid token میاد.", createdAt: iso(now - 80 * 60 * 1000) },
    ],
  },
  {
    id: "TCK-1002",
    title: "خطا در پرداخت",
    department: "مالی",
    status: "pending",
    priority: "urgent",
    requesterEmail: "user2@example.com",
    createdAt: iso(now - 5 * 60 * 60 * 1000),
    updatedAt: iso(now - 20 * 60 * 1000),
    firstResponseAt: iso(now - 4.5 * 60 * 60 * 1000),
    messages: [
      { id: "m1", author: "user", text: "پرداخت انجام میشه ولی فاکتور صادر نمیشه.", createdAt: iso(now - 5 * 60 * 60 * 1000) },
      { id: "m2", author: "agent", text: "در حال بررسی لاگ‌های درگاه هستیم.", createdAt: iso(now - 4.5 * 60 * 60 * 1000) },
      { id: "m3", author: "agent", text: "برای جلوگیری از خطا، تیکت در انتظار تایید مالی قرار گرفت.", createdAt: iso(now - 20 * 60 * 1000) },
    ],
  },
  {
    id: "TCK-1003",
    title: "درخواست تغییر رمز",
    department: "فنی",
    status: "closed",
    priority: "normal",
    requesterEmail: "user3@example.com",
    createdAt: iso(now - 48 * 60 * 60 * 1000),
    updatedAt: iso(now - 24 * 60 * 60 * 1000),
    firstResponseAt: iso(now - 47 * 60 * 60 * 1000),
    messages: [
      { id: "m1", author: "user", text: "امکان تغییر رمز ندارم.", createdAt: iso(now - 48 * 60 * 60 * 1000) },
      { id: "m2", author: "agent", text: "تنظیمات شما بروزرسانی شد. لطفاً دوباره تلاش کنید.", createdAt: iso(now - 47 * 60 * 60 * 1000) },
      { id: "m3", author: "user", text: "حل شد، ممنون.", createdAt: iso(now - 46.5 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "TCK-1004",
    title: "کندی سیستم در ساعات اوج",
    department: "فنی",
    status: "open",
    priority: "low",
    requesterEmail: "user1@example.com",
    createdAt: iso(now - 10 * 60 * 60 * 1000),
    updatedAt: iso(now - 2 * 60 * 60 * 1000),
    messages: [
      { id: "m1", author: "user", text: "ساعت ۹ تا ۱۱ سیستم خیلی کند میشه.", createdAt: iso(now - 10 * 60 * 60 * 1000) },
      { id: "m2", author: "agent", text: "در حال بررسی منابع سرور هستیم.", createdAt: iso(now - 2 * 60 * 60 * 1000) },
    ],
  },
];
