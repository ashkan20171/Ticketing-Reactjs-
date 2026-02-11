import { Outlet, useNavigate } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { getUser, logout } from "../../features/auth/model/auth";
import { Button } from "../../shared/ui/Button/Button";

export function AppLayout() {
  const nav = useNavigate();
  const user = getUser();

  return (
    <div className={styles.shell} dir="rtl">
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
              <Button size="sm" variant="secondary" onClick={()=>{ logout(); nav("/login",{replace:true}); }}>
                خروج
              </Button>
            </>
          ) : (
            <Button size="sm" variant="secondary" onClick={()=>nav("/login")}>
              ورود
            </Button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
