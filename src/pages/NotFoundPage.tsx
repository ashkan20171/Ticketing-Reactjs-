import { useI18n } from "../app/providers/I18nProvider";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ margin: 0 }}>{t("یافت نشد")}</h2>
      <p style={{ marginTop: 8, opacity: 0.8 }}>{t("صفحه مورد نظر وجود ندارد.")}</p>
    </div>
  );
}
