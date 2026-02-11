export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function escapeCsv(v: string) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows: Record<string, any>[], headers: string[]) {
  const head = headers.map(escapeCsv).join(",");
  const body = rows
    .map((r) => headers.map((h) => escapeCsv(r[h])).join(","))
    .join("\n");
  return `${head}\n${body}\n`;
}
