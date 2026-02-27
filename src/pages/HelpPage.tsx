import { Card } from "../shared/ui/Card/Card";
import { getUser } from "../features/auth/model/auth";
import { useI18n } from "../app/providers/I18nProvider";

function Kbd({ children }: { children: string }) {
  return (
    <kbd
      style={{
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.04)",
        padding: "4px 10px",
        borderRadius: 10,
        fontWeight: 900,
        fontSize: 13,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {children}
    </kbd>
  );
}

export function HelpPage() {
  const user = getUser();
  const isMac = typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac");
  const mod = isMac ? "⌘" : "Ctrl";
  const { t, dir } = useI18n();

  return (
    <div dir={dir} style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 1000 }}>{t("راهنما و میانبرها")}</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              سریع‌تر کار کن؛ مخصوصاً وقتی تعداد تیکت‌ها زیاد می‌شود.
            </div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            {t("کاربر:")} <b style={{ color: "var(--text)" }}>{user?.name ?? "-"}</b>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
        <div style={{ gridColumn: "span 7" }}>
          <Card>
            <div style={{ fontWeight: 950, marginBottom: 10 }}>{t("میانبرهای اصلی")}</div>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{t("باز کردن Command Palette")}</span>
                <Kbd>{mod}+K</Kbd>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{t("بستن پنجره‌ها/منوها")}</span>
                <Kbd>Esc</Kbd>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{t("حرکت بین گزینه‌ها در Command Palette")}</span>
                <Kbd>↑ / ↓</Kbd>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{t("اجرای گزینه انتخاب‌شده")}</span>
                <Kbd>Enter</Kbd>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: "span 5" }}>
          <Card>
            <div style={{ fontWeight: 950, marginBottom: 10 }}>{t("نکته‌های سریع")}</div>
            <ul style={{ margin: 0, paddingRight: 18, color: "var(--muted)", lineHeight: 1.9 }}>
              <li>{t("از جستجوی سریع داخل هدر برای پیدا کردن تیکت با عنوان/کد استفاده کن.")}</li>
              <li>{t("فیلترهای تیکت را به عنوان «نما» ذخیره کن تا همیشه با یک کلیک برگردی.")}</li>
              <li>{t("برای افراد حساس به حرکت، انیمیشن‌ها خودکار کم می‌شوند (Reduced Motion).")}</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
