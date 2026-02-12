import { AppRouter } from "./app/router/AppRouter";
import "./app/styles/tokens.css";
import "./app/styles/global.css";
import { ToastProvider } from "./app/providers/ToastProvider";
import { TicketsProvider } from "./app/providers/TicketsProvider";
import { SettingsProvider } from "./app/providers/SettingsProvider";
import { LogsProvider } from "./app/providers/LogsProvider";
import { UsersProvider } from "./app/providers/UsersProvider";
import { ConfirmProvider } from "./app/providers/ConfirmProvider";
import { UserPrefsProvider } from "./app/providers/UserPrefsProvider";
import { NotificationsProvider } from "./app/providers/NotificationsProvider";

export default function App() {
  return (
    <ToastProvider>
      <LogsProvider>
        <UsersProvider>
          <ConfirmProvider>
          <UserPrefsProvider>
          <SettingsProvider>
            <NotificationsProvider>
            <TicketsProvider>
              <AppRouter />
            </TicketsProvider>
            </NotificationsProvider>
          </SettingsProvider>
          </UserPrefsProvider>
          </ConfirmProvider>
        </UsersProvider>
      </LogsProvider>
    </ToastProvider>
  );
}
