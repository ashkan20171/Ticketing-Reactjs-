import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../providers/AppLayout";
import { TicketsPage } from "../../pages/TicketsPage";
import { TicketDetailsPage } from "../../pages/TicketDetailsPage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { LoginPage } from "../../pages/LoginPage";
import { RequireAuth } from "../../features/auth/ui/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      {
        element: <RequireAuth />,
        children: [
          { index: true, element: <TicketsPage /> },
          { path: "tickets/:id", element: <TicketDetailsPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
