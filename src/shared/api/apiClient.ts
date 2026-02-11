
export async function apiDelay<T>(fn: () => T, ms = 500): Promise<T> {
  await new Promise(r => setTimeout(r, ms));
  const user = localStorage.getItem("ashkan_user");
  if (!user) throw new Error("401");
  return fn();
}
