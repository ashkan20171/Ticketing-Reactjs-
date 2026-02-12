import React from "react";

export type NotificationType = "info" | "warn" | "error" | "success";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO
  read: boolean;
  href?: string;
};

type Ctx = {
  items: AppNotification[];
  unreadCount: number;
  push: (n: Omit<AppNotification, "id" | "createdAt" | "read"> & { id?: string; createdAt?: string }) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
};

const KEY = "ashkan_notifications_v1";
const MAX = 40;

const NotificationsCtx = React.createContext<Ctx | null>(null);

function load(): AppNotification[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as AppNotification[];
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, MAX);
  } catch {
    return [];
  }
}

function save(items: AppNotification[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<AppNotification[]>(() => load());

  React.useEffect(() => {
    save(items);
  }, [items]);

  const unreadCount = React.useMemo(() => items.filter((x) => !x.read).length, [items]);

  const push: Ctx["push"] = (n) => {
    const id = n.id ?? `n-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const createdAt = n.createdAt ?? new Date().toISOString();
    setItems((prev) => [{ id, createdAt, read: false, ...n }, ...prev].slice(0, MAX));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, read: true } : x)));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
  };

  const clear = () => setItems([]);

  return (
    <NotificationsCtx.Provider value={{ items, unreadCount, push, markRead, markAllRead, clear }}>
      {children}
    </NotificationsCtx.Provider>
  );
}

export function useNotifications() {
  const v = React.useContext(NotificationsCtx);
  if (!v) {
    return {
      items: [] as AppNotification[],
      unreadCount: 0,
      push: () => {},
      markRead: () => {},
      markAllRead: () => {},
      clear: () => {},
    };
  }
  return v;
}
