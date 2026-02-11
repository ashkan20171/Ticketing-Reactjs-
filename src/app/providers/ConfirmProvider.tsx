import { createContext, useContext, useMemo, useState } from "react";
import { Modal } from "../../shared/ui/Modal/Modal";
import { Button } from "../../shared/ui/Button/Button";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

type Ctx = {
  confirm: (o: ConfirmOptions) => Promise<boolean>;
};

const ConfirmCtx = createContext<Ctx | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const api = useMemo<Ctx>(() => ({
    confirm: (o) => {
      setOpts(o);
      setOpen(true);
      return new Promise<boolean>((res) => setResolver(() => res));
    },
  }), []);

  const close = (v: boolean) => {
    setOpen(false);
    resolver?.(v);
    setResolver(null);
    setTimeout(() => setOpts(null), 150);
  };

  return (
    <ConfirmCtx.Provider value={api}>
      {children}

      <Modal
        open={open}
        title={opts?.title ?? "تأیید عملیات"}
        onClose={() => close(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button variant="ghost" onClick={() => close(false)}>
              {opts?.cancelText ?? "انصراف"}
            </Button>
            <Button variant={opts?.danger ? "danger" : "secondary"} onClick={() => close(true)}>
              {opts?.confirmText ?? "تأیید"}
            </Button>
          </div>
        }
      >
        <div style={{ color: "var(--muted)", lineHeight: 1.8 }}>{opts?.message}</div>
      </Modal>
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const v = useContext(ConfirmCtx);
  if (!v) throw new Error("useConfirm must be used inside ConfirmProvider");
  return v;
}
