import { createContext, useContext, useMemo, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warn";

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  createdAt: number;
  ttlMs?: number;
};

type Ctx = {
  toasts: ToastItem[];
  toast: (t: Omit<ToastItem, "id" | "createdAt">) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastCtx = createContext<Ctx | null>(null);

function icon(type: ToastType) {
  if (type === "success") return "✅";
  if (type === "error") return "⛔";
  if (type === "warn") return "⚠️";
  return "ℹ️";
}

function border(type: ToastType) {
  if (type === "success") return "rgba(34,197,94,0.45)";
  if (type === "error") return "rgba(239,68,68,0.55)";
  if (type === "warn") return "rgba(245,158,11,0.55)";
  return "rgba(59,130,246,0.45)";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const api = useMemo<Ctx>(() => ({
    toasts,
    toast: (t) => {
      const id = `ts-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const item: ToastItem = {
        id,
        type: t.type,
        title: t.title,
        message: t.message,
        createdAt: Date.now(),
        ttlMs: t.ttlMs ?? 3200,
      };

      setToasts((p) => {
        const next = [item, ...p].slice(0, 5); // max 5 visible
        return next;
      });

      window.setTimeout(() => {
        setToasts((p) => p.filter((x) => x.id !== id));
      }, item.ttlMs);
    },
    dismiss: (id) => setToasts((p) => p.filter((x) => x.id !== id)),
    clear: () => setToasts([]),
  }), [toasts]);

  return (
    <ToastCtx.Provider value={api}>
      {children}

      <div style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        display: "grid",
        gap: 10,
        zIndex: 9999,
        width: "min(360px, calc(100vw - 32px))",
      }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            borderRadius: 16,
            border: `1px solid ${border(t.type)}`,
            background: "rgba(17,24,39,0.78)",
            backdropFilter: "blur(10px)",
            padding: 12,
            boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
            color: "var(--text)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{icon(t.type)}</span>
                <div style={{ fontWeight: 900 }}>{t.title}</div>
              </div>
              <button
                onClick={() => api.dismiss(t.id)}
                style={{
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--muted)",
                  borderRadius: 12,
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
                aria-label="بستن"
              >
                ✕
              </button>
            </div>
            {t.message ? (
              <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
                {t.message}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const v = useContext(ToastCtx);
  if (!v) throw new Error("useToast must be used inside ToastProvider");
  return v;
}
