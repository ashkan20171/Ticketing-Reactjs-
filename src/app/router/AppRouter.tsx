import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../providers/AppLayout";
import { TicketsPage } from "../../pages/TicketsPage";
import { MyDashboardPage } from "../../pages/MyDashboardPage";
import { ProfilePage } from "../../pages/ProfilePage";
import { TicketDetailsPage } from "../../pages/TicketDetailsPage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import React, { Suspense, lazy } from 'react';

const DashboardPage = lazy(()=>import('../../pages/DashboardPage').then(m=>({default:m.DashboardPage}))); 
import { SettingsPage } from "../../pages/SettingsPage";
import { UsersPage } from "../../pages/UsersPage";
import { LogsPage } from "../../pages/LogsPage";
import { RequireAdmin } from "../../features/auth/ui/RequireAdmin";
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
          { path: "my-dashboard", element: <MyDashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "tickets/:id", element: <TicketDetailsPage /> },
          {
            element: <RequireAdmin />,
            children: [
              { path: "dashboard", element: <Suspense fallback={<div style={{padding:20}}>Loading...</div>}><DashboardPage /></Suspense> },
              { path: "settings", element: <SettingsPage /> },
              { path: "users", element: <UsersPage /> },
              { path: "logs", element: <LogsPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
