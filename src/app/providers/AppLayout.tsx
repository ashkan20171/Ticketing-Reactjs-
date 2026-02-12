import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { getUser, logout } from "../../features/auth/model/auth";
import { Button } from "../../shared/ui/Button/Button";
import { TopLoader } from "../../shared/ui/TopLoader";
import { CommandPalette } from "./CommandPalette";
import { useTickets } from "./TicketsProvider";
import { useNotifications } from "./NotificationsProvider";
import { useState } from "react";

export function AppLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const { loading: ticketsLoading } = useTickets();
  const nav = useNavigate();
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const { items, unreadCount, markAllRead, markRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className={styles.shell} dir="rtl">
      <TopLoader loading={ticketsLoading} />
      <CommandPalette />
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>A</span>
          <div>
            <div className={styles.title}>Ashkan Ticketing</div>
            <div className={styles.subtitle}>سیستم تیکتینگ سازمانی حرفه‌ای</div>
          </div>
        </div>

        <div className={styles.right}>
          {user ? (
            <>
              
              <div className={styles.notifWrap}>
                <button
                  type="button"
                  className={styles.notifBtn}
                  onClick={() => setNotifOpen((p) => !p)}
                  aria-label="اعلان‌ها"
                  title="اعلان‌ها"
                >
                  🔔
                  {unreadCount > 0 ? <span className={styles.notifBadge}>{unreadCount}</span> : null}
                </button>

                {notifOpen ? (
                  <div className={styles.notifPanel} role="dialog" aria-label="اعلان‌ها">
                    <div className={styles.notifHeader}>
                      <div style={{ fontWeight: 900 }}>اعلان‌ها</div>
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
                        <div className={styles.notifEmpty}>فعلاً اعلانی ندارید.</div>
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
            <Button size="sm" variant="secondary" onClick={() => nav("/login")}>
              ورود
            </Button>
          )}
        </div>
      </header>

      <div className={[styles.body, isLogin ? styles.bodyLogin : ""].join(" ")}>
        {!isLogin ? (
        <aside className={styles.sidebar}>
          <div className={styles.navTitle}>پنل</div>
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
            {isAdmin ? "مدیر سیستم: گزارش‌ها و خروجی‌ها" : "کاربر/اپراتور: مدیریت تیکت‌ها"}
          </div>
        </aside>
      ) : null}

        <main className={[styles.main, isLogin ? styles.mainLogin : ""].join(" ")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
