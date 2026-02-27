import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { getUser, logout } from "../../features/auth/model/auth";
import { Button } from "../../shared/ui/Button/Button";
import { Modal } from "../../shared/ui/Modal/Modal";
import { TopLoader } from "../../shared/ui/TopLoader";
import { CommandPalette } from "./CommandPalette";
import { useTickets } from "./TicketsProvider";
import { useNotifications } from "./NotificationsProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "./SettingsProvider";
import { useI18n } from "./I18nProvider";

export function AppLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const { loading: ticketsLoading } = useTickets();
  const nav = useNavigate();
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const { items, unreadCount, markAllRead, markRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const { settings, setTheme } = useSettings();
  const { t, lang, setLang, dir } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerQ, setHeaderQ] = useState("");

  const initials = useMemo(() => {
    const name = user?.displayName || user?.name || "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const a = (parts[0]?.[0] || "U").toUpperCase();
    const b = (parts[1]?.[0] || "").toUpperCase();
    return (a + b).slice(0, 2);
  }, [user]);

  const themeIcon = useMemo(() => (settings.theme === "dark" ? "☀️" : "🌙"), [settings.theme]);

  // Close popovers on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = notifRef.current;
      const uel = userMenuRef.current;
      if (notifOpen && el && !el.contains(e.target as Node)) setNotifOpen(false);
      if (userMenuOpen && uel && !uel.contains(e.target as Node)) setUserMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setUserMenuOpen(false);
        setSidebarOpen(false);
        setLogoutOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [notifOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
        setLogoutOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.shell} dir={dir}>
      <TopLoader loading={ticketsLoading} />
      <CommandPalette />
      <header className={styles.header}>
        <div className={styles.leftHeader}>
          {!isLogin ? (
            <button
              type="button"
              className={styles.menuBtn}
              aria-label={t("باز کردن منو")}
              title={t("منو")}
              onClick={() => setSidebarOpen((p) => !p)}
            >
              ☰
            </button>
          ) : null}

          <div className={styles.brand}>
            <span className={styles.logo}>A</span>
            <div>
              <div className={styles.title}>Ashkan Ticketing</div>
              <div className={styles.subtitle}>{t("سیستم تیکتینگ سازمانی حرفه‌ای")}</div>
            </div>
          </div>

          {!isLogin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = headerQ.trim();
                if (!q) return;
                nav(`/?q=${encodeURIComponent(q)}`);
              }}
            >
              <input
                className={styles.quickSearch}
                value={headerQ}
                onChange={(e) => setHeaderQ(e.target.value)}
                placeholder={t("جستجوی سریع تیکت… (عنوان یا کد)")}
                aria-label={t("جستجوی سریع")}
              />
            </form>
          ) : null}
        </div>

        <div className={styles.right}>
          {user ? (
            <>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setTheme(settings.theme === "dark" ? "light" : "dark")}
                aria-label={settings.theme === "dark" ? t("تغییر به حالت روشن") : t("تغییر به حالت تیره")}
                title={settings.theme === "dark" ? t("حالت روشن") : t("حالت تیره")}
              >
                {themeIcon}
              </button>

              <div className={styles.userMenuWrap} ref={userMenuRef}>
                <button
                  type="button"
                  className={styles.userBtn}
                  onClick={() => setUserMenuOpen((p) => !p)}
                  aria-label={t("منوی کاربر")}
                  title={t("کاربر")}
                  aria-expanded={userMenuOpen}
                >
                  <span className={styles.avatar} aria-hidden="true">{initials}</span>
                  <span className={styles.userName}>{user.displayName || user.name}</span>
                  <span className={styles.caret} aria-hidden="true">▾</span>
                </button>

                {userMenuOpen ? (
                  <div className={styles.userMenu} role="menu" aria-label={t("منوی کاربر")}>
                    <div className={styles.userMeta}>
                      <div className={styles.userMetaName}>{user.displayName || user.name}</div>
                      <div className={styles.userMetaSub}>
                        {user.email} • {isAdmin ? t("مدیر") : t("کاربر")}
                      </div>
                    </div>
                    <div className={styles.menuSep} />

                    <button type="button" className={styles.menuItem} role="menuitem" onClick={() => { setUserMenuOpen(false); nav("/profile"); }}>
                      {t("پروفایل")}
                    </button>
                    <button type="button" className={styles.menuItem} role="menuitem" onClick={() => { setUserMenuOpen(false); nav("/help"); }}>
                      {t("راهنما و میانبرها")}
                    </button>
                    {isAdmin ? (
                      <button type="button" className={styles.menuItem} role="menuitem" onClick={() => { setUserMenuOpen(false); nav("/settings"); }}>
                        {t("تنظیمات")}
                      </button>
                    ) : null}

                    <div className={styles.menuSep} />
                    <div className={styles.menuSectionTitle}>{t("زبان")}</div>
                    <div className={styles.langRow} role="group" aria-label={t("زبان")}>
                      <button
                        type="button"
                        className={[styles.langBtn, lang === "fa" ? styles.langBtnActive : ""].join(" ")}
                        onClick={() => setLang("fa")}
                      >
                        {t("فارسی")}
                      </button>
                      <button
                        type="button"
                        className={[styles.langBtn, lang === "en" ? styles.langBtnActive : ""].join(" ")}
                        onClick={() => setLang("en")}
                      >
                        English
                      </button>
                    </div>
                    <div className={styles.menuSep} />
                    <button
                      type="button"
                      className={[styles.menuItem, styles.dangerItem].join(" ")}
                      role="menuitem"
                      onClick={() => { setUserMenuOpen(false); setLogoutOpen(true); }}
                    >
                      {t("خروج")}
                    </button>
                  </div>
                ) : null}
              </div>

<div className={styles.notifWrap} ref={notifRef}>
                <button
                  type="button"
                  className={[styles.iconBtn, styles.notifBtn].join(" ")}
                  onClick={() => setNotifOpen((p) => !p)}
                  aria-label={t("اعلان‌ها")}
                  title={t("اعلان‌ها")}
                  aria-expanded={notifOpen}
                >
                  🔔
                  {unreadCount > 0 ? <span className={styles.notifBadge}>{unreadCount}</span> : null}
                </button>

                {notifOpen ? (
                  <div className={styles.notifPanel} role="dialog" aria-label={t("اعلان‌ها")}>
                    <div className={styles.notifHeader}>
                      <div style={{ fontWeight: 900 }}>{t("اعلان‌ها")}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" className={styles.notifLink} onClick={markAllRead}>
                          خوانده شد
                        </button>
                        <button type="button" className={styles.notifLink} onClick={() => setNotifOpen(false)}>
                          بستن
                        </button>
                      </div>
                    </div>

                    <div className={styles.notifList}>
                      {items.length === 0 ? (
                        <div className={styles.notifEmpty}>{t("فعلاً اعلانی ندارید.")}</div>
                      ) : (
                        items.slice(0, 10).map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            className={[styles.notifItem, n.read ? styles.notifRead : ""].join(" ")}
                            onClick={() => {
                              markRead(n.id);
                              setNotifOpen(false);
                              if (n.href) nav(n.href);
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                              <div style={{ fontWeight: 900, fontSize: 13 }}>{n.title}</div>
                              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                                {new Date(n.createdAt).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                            <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                              {n.message}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <span className={styles.pill}>{user.name} • {user.role}</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  logout();
                  nav("/login", { replace: true });
                }}
              >
                خروج
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setTheme(settings.theme === "dark" ? "light" : "dark")}
                aria-label={settings.theme === "dark" ? t("تغییر به حالت روشن") : t("تغییر به حالت تیره")}
                title={settings.theme === "dark" ? t("حالت روشن") : t("حالت تیره")}
              >
                {themeIcon}
              </button>
              <Button size="sm" variant="secondary" onClick={() => nav("/login")}>
                ورود
              </Button>
            </>
          )}
        </div>
      </header>

      {sidebarOpen ? <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} /> : null}

      <div className={[styles.body, isLogin ? styles.bodyLogin : ""].join(" ")}>
        {!isLogin ? (
        <aside className={[styles.sidebar, sidebarOpen ? styles.sidebarOpen : ""].join(" ")}>
          <div className={styles.navTitle}>{t("پنل")}</div>
          <NavLink to="/" end className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
            تیکت‌ها
          </NavLink>
          <NavLink to="/my-dashboard" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
            داشبورد من
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
            پروفایل
          </NavLink>

          {isAdmin ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
                داشبورد
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
                تنظیمات
              </NavLink>
              <NavLink to="/users" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
                کاربران
              </NavLink>
              <NavLink to="/logs" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
                لاگ‌ها
              </NavLink>
              <NavLink to="/escalations" className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
                قوانین Escalation
              </NavLink>
            </>
          ) : null}

          <div className={styles.navHint}>
            {isAdmin ? t("مدیر سیستم: گزارش‌ها و خروجی‌ها") : t("کاربر/اپراتور: مدیریت تیکت‌ها")}
          </div>
        </aside>
      ) : null}

        <main className={[styles.main, isLogin ? styles.mainLogin : ""].join(" ")}>
          <Outlet />
        </main>
      </div>

      <Modal
        open={logoutOpen}
        title={t("خروج از حساب")}
        onClose={() => setLogoutOpen(false)}
        footer={
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-start" }}>
            <Button variant="danger" onClick={() => { setLogoutOpen(false); logout(); nav("/login", { replace: true }); }}>
              خروج
            </Button>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              انصراف
            </Button>
          </div>
        }
      >
        <div style={{ color: "var(--text)" }}>
          {t("مطمئنی می‌خوای خارج بشی؟")}
        </div>
      </Modal>

    </div>
  );
}
