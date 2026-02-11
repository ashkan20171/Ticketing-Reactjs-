import { useMemo, useState } from "react";
import { Card } from "../shared/ui/Card/Card";
import { Input } from "../shared/ui/Input/Input";
import { Button } from "../shared/ui/Button/Button";
import { useUsers } from "../app/providers/UsersProvider";
import { useToast } from "../app/providers/ToastProvider";
import { useConfirm } from "../app/providers/ConfirmProvider";
import { useLogs } from "../app/providers/LogsProvider";
import { getUser } from "../features/auth/model/auth";
import { Role } from "../features/auth/model/auth";

export function UsersPage() {
  const { confirm } = useConfirm();
  const { users, setRole, toggleActive } = useUsers();
  const { toast } = useToast();
  const { addLog } = useLogs();
  const actor = getUser();

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(u => (u.name + " " + u.email).toLowerCase().includes(s));
  }, [users, q]);

  const changeRole = (email: string, role: Role) => {
    setRole(email, role);
    toast({ type: "success", title: "نقش تغییر کرد", message: `${email} → ${role}` });
    addLog({ action: "CHANGE_ROLE", message: `Role of ${email} changed to ${role}`, actorEmail: actor?.email });
  };

  const toggle = async (email: string) => {
    const ok = await confirm({ title: "تغییر وضعیت کاربر", message: `آیا مطمئن هستید وضعیت ${email} تغییر کند؟`, danger: true, confirmText: "تأیید" });
    if (!ok) return;
    toggleActive(email);
    toast({ type: "info", title: "وضعیت کاربر تغییر کرد", message: email });
    addLog({ action: "TOGGLE_USER", message: `User ${email} active toggled`, actorEmail: actor?.email });
  };

  return (
    <div style={{ padding: 12, display: "grid", gap: 12 }}>
      <Card>
        <div style={{ fontWeight: 900, fontSize: 16 }}>مدیریت کاربران</div>
        <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
          تغییر نقش و فعال/غیرفعال‌سازی کاربران (دمو - LocalStorage)
        </div>
      </Card>

      <Card>
        <Input placeholder="جستجو نام یا ایمیل..." value={q} onChange={(e)=>setQ(e.target.value)} />
      </Card>

      <Card>
        <div style={{ display:"grid", gap: 10 }}>
          {filtered.map(u => (
            <div key={u.email}
              style={{
                display:"grid",
                gridTemplateColumns:"1fr 220px 140px",
                gap: 10,
                alignItems:"center",
                padding: 12,
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.03)"
              }}>
              <div>
                <div style={{ fontWeight: 900 }}>{u.name}</div>
                <div style={{ color:"var(--muted)", fontSize: 13, marginTop: 6 }}>{u.email} • {u.role} • {u.active ? "فعال" : "غیرفعال"}</div>
              </div>

              <select
                value={u.role}
                onChange={(e)=>changeRole(u.email, e.target.value as Role)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text)"
                }}
                disabled={u.email === "admin@example.com"}
                title={u.email === "admin@example.com" ? "ادمین اصلی قابل تغییر نیست" : ""}
              >
                <option value="user">user</option>
                <option value="agent">agent</option>
                <option value="admin">admin</option>
              </select>

              <Button variant="secondary" onClick={()=>toggle(u.email)} disabled={u.email === "admin@example.com"}>
                {u.active ? "غیرفعال" : "فعال"}
              </Button>
            </div>
          ))}
          {filtered.length === 0 ? <div style={{ color:"var(--muted)" }}>کاربری پیدا نشد.</div> : null}
        </div>
      </Card>
    </div>
  );
}
