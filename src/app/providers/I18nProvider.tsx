import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "fa" | "en";
type Dict = Record<string, string>;

const EN: Dict = {
  "Level": "Level",
  "Actor": "Actor",
  "پاک کن": "Clear",
  "پاک شد": "Cleared",
  "آیا مطمئن هستید؟ این عملیات برگشت‌پذیر نیست.": "Are you sure? This action cannot be undone.",
  "تم تغییر کرد": "Theme changed",
  "Light فعال شد.": "Light mode enabled.",
  "لاگ عملیات": "System Logs",
  "ثبت فعالیت‌های مهم سیستم (دمو - LocalStorage)": "Important system activities (Demo - LocalStorage)",
  "پاک کردن لاگ‌ها": "Clear logs",
  "پاک کردن": "Clear",
  "جستجو در لاگ...": "Search logs...",
  "لاگی وجود ندارد.": "No logs found."
};

const FA: Dict = {};

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({
  lang: "fa",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("app_lang") as Lang) || "fa";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", lang);
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    return (key: string) => {
      if (lang === "en") return EN[key] ?? key;
      return key;
    };
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}