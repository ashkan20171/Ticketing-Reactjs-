import { useMemo, useState } from "react";
import { Card } from "../shared/ui/Card/Card";
import { Button } from "../shared/ui/Button/Button";
import { useToast } from "../app/providers/ToastProvider";
import { useLogs } from "../app/providers/LogsProvider";
import { getUser } from "../features/auth/model/auth";
import { clampSlaHours } from "../features/settings/model/settings";
import { useSettings } from "../app/providers/SettingsProvider";

export function SettingsPage() {
  const { addLog } = useLogs();
  const actor = getUser();
  const { toast } = useToast();
  const { settings, setSlaHours, setEmailNotifications, setTheme } = useSettings();

  const [slaInput, setSlaInput] = useState(String(settings.slaHours));

  const slaParsed = useMemo(() => clampSlaHours(Number(slaInput)), [slaInput]);

  const save = () => {
    setSlaHours(slaParsed);
    toast({ type: "success", title: "ذخیره شد", message: "تنظیمات با موفقیت ذخیره شد." });
    addLog({ action: "UPDATE_SETTINGS", message: `SLA hours set to ${slaParsed}`, actorEmail: actor?.email });
  };

  return (
    <div style={{ padding: 12, display: "grid", gap: 12, maxWidth: 920 }}>
      <Card>
        <div style={{ fontWeight: 900, fontSize: 16 }}>تنظیمات سیستم</div>
        <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13, lineHeight: 1.8 }}>
          این تنظیمات به صورت محلی (LocalStorage) ذخیره می‌شوند و برای نسخه‌ی بک‌اند آماده هستند.
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>SLA</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12, alignItems: "end" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>حداکثر ساعت مجاز برای تیکت‌های باز</span>
            <input
              value={slaInput}
              onChange={(e) => setSlaInput(e.target.value)}
              inputMode="numeric"
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text)",
                outline: "none",
              }}
              placeholder="مثلاً 24"
            />
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              بازه مجاز: 1 تا 168 ساعت. مقدار اعمال‌شده: <b>{slaParsed}</b>
            </span>
          </label>

          <Button variant="secondary" onClick={save}>ذخیره SLA</Button>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>اعلان‌ها (Mock)</div>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => {
              setEmailNotifications(e.target.checked);
              toast({
                type: "info",
                title: "اعلان‌ها",
                message: e.target.checked ? "اعلان ایمیلی فعال شد (دمو)" : "اعلان ایمیلی غیرفعال شد (دمو)",
              });
              addLog({ action: "TOGGLE_EMAIL_NOTIF", message: `Email notifications: ${e.target.checked}`, actorEmail: actor?.email });
            }}
          />
          <span style={{ color: "var(--text)" }}>فعال‌سازی اعلان ایمیلی</span>
        </label>
      </Card>

      <Card>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>ظاهر (Theme)</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            variant={settings.theme === "dark" ? "secondary" : "ghost"}
            onClick={() => {
              setTheme("dark");
              toast({ type: "success", title: "تم تغییر کرد", message: "Dark فعال شد." });
              addLog({ action: "CHANGE_THEME", message: "Theme set to dark", actorEmail: actor?.email });
            }}
          >
            Dark
          </Button>
          <Button
            variant={settings.theme === "light" ? "secondary" : "ghost"}
            onClick={() => {
              setTheme("light");
              toast({ type: "success", title: "تم تغییر کرد", message: "Light فعال شد." });
              addLog({ action: "CHANGE_THEME", message: "Theme set to light", actorEmail: actor?.email });
            }}
          >
            Light
          </Button>
        </div>
      </Card>
    </div>
  );
}
