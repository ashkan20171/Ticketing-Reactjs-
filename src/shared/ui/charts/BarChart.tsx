type BarItem = { label: string; value: number };

export function BarChart({
  title,
  items,
}: {
  title: string;
  items: BarItem[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((it) => {
          const pct = Math.round((it.value / max) * 100);
          return (
            <div key={it.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "var(--muted)",
                }}
              >
                <span>{it.label}</span>
                <span>{it.value}</span>
              </div>

              <div
                style={{
                  marginTop: 8,
                  height: 10,
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.03)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: pct + "%",
                    height: "100%",
                    background: "rgba(37,99,235,0.35)",
                    transition: "width .6s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
