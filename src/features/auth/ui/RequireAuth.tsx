import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../model/auth";

export function RequireAuth() {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
