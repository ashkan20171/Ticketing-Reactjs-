
export function randomToken(prefix: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${hex}_${Date.now()}`;
}

export function now() {
  return Date.now();
}
