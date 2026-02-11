import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../shared/ui/Modal/Modal";
import { getUser, logout } from "../../features/auth/model/auth";
import { useToast } from "./ToastProvider";
import { useSettings } from "./SettingsProvider";
import { useConfirm } from "./ConfirmProvider";

type Cmd = {
  id: string;
  title: string;
  hint?: string;
  keywords?: string;
  run: () => void | Promise<void>;
  adminOnly?: boolean;
};

export function CommandPalette() {
  const nav = useNavigate();
  const { toast } = useToast();
  const { settings, setTheme } = useSettings();
  const { confirm } = useConfirm();

  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const cmds = useMemo<Cmd[]>(() => {
    const base: Cmd[] = [
      { id: "go_tickets", title: "رفتن به تیکت‌ها", hint: "G T", keywords: "tickets list", run: () => nav("/") },
      { id: "go_my_dashboard", title: "رفتن به داشبورد من", hint: "G M", keywords: "my dashboard analytics", run: () => nav("/my-dashboard") },
      { id: "new_ticket", title: "ایجاد تیکت جدید", hint: "N", keywords: "create ticket", run: () => (document.getElementById("btn-new-ticket") as HTMLButtonElement | null)?.click() },
      { id: "toggle_theme", title: settings.theme === "dark" ? "تغییر به Light" : "تغییر به Dark", hint: "T", keywords: "theme dark light", run: () => setTheme(settings.theme === "dark" ? "light" : "dark") },
      { id: "logout", title: "خروج از سیستم", hint: "L", keywords: "logout exit", run: async () => {
        const ok = await confirm({ title: "خروج", message: "آیا از خروج مطمئن هستید؟", danger: true, confirmText: "خروج" });
        if (!ok) return;
        logout();
        toast({ type: "info", title: "خروج انجام شد" });
        nav("/login", { replace: true });
      }},
    ];

    const admin: Cmd[] = [
      { id: "go_dashboard", title: "رفتن به داشبورد", hint: "G D", keywords: "dashboard analytics", run: () => nav("/dashboard"), adminOnly: true },
      { id: "go_settings", title: "رفتن به تنظیمات", hint: "G S", keywords: "settings", run: () => nav("/settings"), adminOnly: true },
      { id: "go_users", title: "رفتن به کاربران", hint: "G U", keywords: "users roles", run: () => nav("/users"), adminOnly: true },
      { id: "go_logs", title: "رفتن به لاگ‌ها", hint: "G L", keywords: "logs audit", run: () => nav("/logs"), adminOnly: true },
    ];

    return isAdmin ? [...admin, ...base] : base;
  }, [nav, isAdmin, settings.theme, setTheme, toast, confirm]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s
      ? cmds.filter((c) => (c.title + " " + (c.keywords ?? "")).toLowerCase().includes(s))
      : cmds;
    return list;
  }, [cmds, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+K
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((p) => !p);
        return;
      }

      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((p) => Math.min(p + 1, Math.max(0, filtered.length - 1)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((p) => Math.max(p - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[active];
        if (!item) return;
        Promise.resolve(item.run()).finally(() => {
          setOpen(false);
          setQ("");
          setActive(0);
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active]);

  // reset active when filtered changes
  useEffect(() => {
    setActive(0);
  }, [q, open]);

  return (
    <Modal
      open={open}
      onClose={() => { setOpen(false); setQ(""); setActive(0); }}
      title="Command Palette"
      width={720}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: 12 }}>
          <span>Ctrl+K برای باز/بستن • Enter اجرا • Esc بستن</span>
          <span>{user?.email ?? ""}</span>
        </div>
      }
    >
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جستجو دستور... (مثلاً dashboard, settings, logout)"
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 14,
          border: "1px solid var(--border)",
          background: "rgba(255,255,255,0.05)",
          color: "var(--text)",
          outline: "none",
        }}
      />

      <div style={{ marginTop: 12, display: "grid", gap: 8, maxHeight: 360, overflow: "auto" }}>
        {filtered.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => {
              Promise.resolve(c.run()).finally(() => {
                setOpen(false);
                setQ("");
                setActive(0);
              });
            }}
            style={{
              textAlign: "right",
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: idx === active ? "rgba(37,99,235,0.18)" : "rgba(255,255,255,0.03)",
              padding: "10px 12px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              color: "var(--text)",
            }}
          >
            <span style={{ fontWeight: 800 }}>{c.title}</span>
            {c.hint ? (
              <span style={{
                fontSize: 12,
                color: "var(--muted)",
                border: "1px solid var(--border)",
                padding: "3px 8px",
                borderRadius: 999,
              }}>
                {c.hint}
              </span>
            ) : null}
          </button>
        ))}
        {filtered.length === 0 ? (
          <div style={{ color: "var(--muted)", padding: 10 }}>چیزی پیدا نشد.</div>
        ) : null}
      </div>
    </Modal>
  );
}
