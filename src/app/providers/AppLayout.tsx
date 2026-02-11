import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { getUser, logout } from "../../features/auth/model/auth";
import { Button } from "../../shared/ui/Button/Button";
import { TopLoader } from "../../shared/ui/TopLoader";
import { useTickets } from "./TicketsProvider";

export function AppLayout() {
  const { loading: ticketsLoading } = useTickets();
  const nav = useNavigate();
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className={styles.shell} dir="rtl">
      <TopLoader loading={ticketsLoading} />
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

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.navTitle}>پنل</div>
          <NavLink to="/" end className={({ isActive }) => [styles.navItem, isActive ? styles.active : ""].join(" ")}>
            تیکت‌ها
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
            </>
          ) : null}

          <div className={styles.navHint}>
            {isAdmin ? "مدیر سیستم: گزارش‌ها و خروجی‌ها" : "کاربر/اپراتور: مدیریت تیکت‌ها"}
          </div>
        </aside>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
