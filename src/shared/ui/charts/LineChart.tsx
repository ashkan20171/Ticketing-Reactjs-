type Point = { label: string; value: number };

function pointsToPolyline(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function LineChart({
  title,
  series,
}: {
  title: string;
  series: Point[];
}) {
  const w = 520;
  const h = 160;
  const pad = 18;

  const max = Math.max(1, ...series.map((s) => s.value));
  const min = Math.min(0, ...series.map((s) => s.value));

  const xs = series.map((_, i) =>
    pad + (i * (w - pad * 2)) / Math.max(1, series.length - 1)
  );
  const ys = series.map((s) => {
    const t = (s.value - min) / Math.max(1e-6, max - min);
    return pad + (1 - t) * (h - pad * 2);
  });

  const pts = xs.map((x, i) => ({ x, y: ys[i] }));
  const poly = pointsToPolyline(pts);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>

      <div style={{ overflowX: "auto" }}>
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={title}
          style={{
            display: "block",
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {/* grid */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={pad}
              x2={w - pad}
              y1={pad + t * (h - pad * 2)}
              y2={pad + t * (h - pad * 2)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}

          {/* line */}
          <polyline
            points={poly}
            fill="none"
            stroke="rgba(37,99,235,0.75)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1200,
              strokeDashoffset: 1200,
              animation: "dash 1s ease forwards",
            }}
          />

          {/* points */}
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="rgba(37,99,235,0.95)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          color: "var(--muted)",
          fontSize: 12,
        }}
      >
        {series.map((p) => (
          <span key={p.label}>
            {p.label}: <b style={{ color: "var(--text)" }}>{p.value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
