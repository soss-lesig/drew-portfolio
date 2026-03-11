import { Outlet } from "react-router";
import ProtectedRoute from "../ProtectedRoute";

export default function AdminLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
