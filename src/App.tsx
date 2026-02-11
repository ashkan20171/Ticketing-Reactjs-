import { AppRouter } from "./app/router/AppRouter";
import "./app/styles/tokens.css";
import "./app/styles/global.css";
import { ToastProvider } from "./app/providers/ToastProvider";
import { TicketsProvider } from "./app/providers/TicketsProvider";

export default function App() {
  return (
    <ToastProvider>
      <TicketsProvider>
        <AppRouter />
      </TicketsProvider>
    </ToastProvider>
  );
}
