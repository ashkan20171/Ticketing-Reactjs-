type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, style, ...rest }: Props) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label ? <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span> : null}

      <textarea
        style={{
          minHeight: 110,
          resize: "vertical",
          padding: 10,
          borderRadius: 14,
          border: "1px solid var(--border)",
          background: "rgba(255,255,255,0.05)",
          color: "var(--text)",
          outline: "none",
          ...style,
        }}
        {...rest}
      />

      {error ? <span style={{ fontSize: 12, color: "var(--danger-500)" }}>{error}</span> : null}
    </label>
  );
}
