import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../model/auth";

export function RequireAdmin() {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
