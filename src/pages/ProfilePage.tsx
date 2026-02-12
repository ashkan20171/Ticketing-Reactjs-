import React from "react";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { Input } from "../shared/ui/Input/Input";
import { getUser, setUserDisplayName } from "../features/auth/model/auth";
import { useUserPrefs } from "../app/providers/UserPrefsProvider";
import { useToast } from "../app/providers/ToastProvider";

function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", padding: "10px 0" }}>
      <div>
        <div style={{ fontWeight: 900 }}>{label}</div>
        {hint ? <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>{hint}</div> : null}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 52,
          height: 30,
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: checked ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.06)",
          position: "relative",
          cursor: "pointer",
        }}
        aria-label={label}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            right: checked ? 24 : 3,
            width: 24,
            height: 24,
            borderRadius: 999,
            background: "rgba(255,255,255,0.85)",
            transition: "all 180ms ease",
          }}
        />
      </button>
    </div>
  );
}

export function ProfilePage() {
  const user = getUser();
  const { prefs, patch } = useUserPrefs();
  const { toast } = useToast();

  const [name, setName] = React.useState(user?.displayName ?? "");

  return (
    <div style={{ padding: 12, display: "grid", gap: 12, maxWidth: 980 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>پروفایل</div>
            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>{user?.email}</div>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            border: "1px solid var(--border)",
            background: "rgba(37,99,235,0.18)",
            display: "grid", placeItems: "center", fontWeight: 900
          }}>
            {(user?.displayName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>اطلاعات پایه</div>
        <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
          <Input label="نام نمایشی" placeholder="مثلاً اشکان" value={name} onChange={(e) => setName(e.target.value)} />
          <div style={{ display: "flex", gap: 10 }}>
            <Button
              variant="secondary"
              onClick={() => {
                setUserDisplayName(name.trim());
                toast({ type: "success", title: "ذخیره شد" });
              }}
            >
              ذخیره
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>تنظیمات تجربه کاربری</div>
        <Switch checked={prefs.showQuickStats} onChange={(v) => patch({ showQuickStats: v })} label="نمایش Quick Stats" hint="کارت‌های آمار سریع در صفحه تیکت‌ها" />
        <div style={{ borderTop: "1px solid var(--border)" }} />
        <Switch checked={prefs.compactMode} onChange={(v) => patch({ compactMode: v })} label="حالت فشرده" hint="فاصله‌های کمتر و نمایش فشرده لیست‌ها" />
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>اعلان‌ها</div>
        <Switch checked={prefs.notifyInApp} onChange={(v) => patch({ notifyInApp: v })} label="اعلان داخل سیستم" />
        <div style={{ borderTop: "1px solid var(--border)" }} />
        <Switch checked={prefs.notifyEmail} onChange={(v) => patch({ notifyEmail: v })} label="ارسال ایمیل" hint="در نسخه واقعی، به سرویس ایمیل وصل می‌شود" />
      </Card>
    </div>
  );
}
