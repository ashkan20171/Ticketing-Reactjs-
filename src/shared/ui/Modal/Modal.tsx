import { useEffect } from "react";

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  width = 520,
}: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(2,6,23,0.60)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(100%, " + width + "px)",
          borderRadius: 20,
          border: "1px solid var(--border)",
          background: "rgba(17,24,39,0.85)",
          boxShadow: "0 22px 70px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        {title ? (
          <div style={{ padding: 14, borderBottom: "1px solid var(--border)", fontWeight: 900 }}>
            {title}
          </div>
        ) : null}

        <div style={{ padding: 14 }}>{children}</div>

        {footer ? (
          <div style={{ padding: 14, borderTop: "1px solid var(--border)" }}>{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
