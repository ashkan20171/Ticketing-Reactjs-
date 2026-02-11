import { AppRouter } from "./app/router/AppRouter";
import "./app/styles/tokens.css";
import "./app/styles/global.css";
import { ToastProvider } from "./app/providers/ToastProvider";
import { TicketsProvider } from "./app/providers/TicketsProvider";
import { SettingsProvider } from "./app/providers/SettingsProvider";
import { LogsProvider } from "./app/providers/LogsProvider";
import { UsersProvider } from "./app/providers/UsersProvider";

export default function App() {
  return (
    <ToastProvider>
      <LogsProvider>
        <UsersProvider>
          <SettingsProvider>
            <TicketsProvider>
              <AppRouter />
            </TicketsProvider>
          </SettingsProvider>
        </UsersProvider>
      </LogsProvider>
    </ToastProvider>
  );
}
