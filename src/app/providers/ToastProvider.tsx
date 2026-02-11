import { createContext, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastCtx = {
  toast: (t: Omit<Toast, "id">) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const api = useMemo<ToastCtx>(() => ({
    toast: (t) => {
      const id = `t-${Date.now()}`;
      const toast: Toast = { id, ...t };
      setItems((p) => [toast, ...p]);
      setTimeout(() => {
        setItems((p) => p.filter((x) => x.id !== id));
      }, 3000);
    },
  }), []);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div style={{ position:"fixed", left:20, bottom:20, display:"grid", gap:10 }}>
        {items.map(t => (
          <div key={t.id}
            style={{
              borderRadius:14,
              padding:12,
              background:
                t.type==="success" ? "rgba(22,163,74,.15)" :
                t.type==="error" ? "rgba(220,38,38,.15)" :
                "rgba(37,99,235,.15)",
              border:"1px solid rgba(255,255,255,.1)"
            }}>
            <strong>{t.title}</strong>
            {t.message && <div style={{fontSize:12, marginTop:6}}>{t.message}</div>}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used inside ToastProvider");
  return v;
}
