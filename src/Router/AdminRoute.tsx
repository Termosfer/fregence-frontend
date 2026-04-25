import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const AdminRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Həm token olmalıdır, həm də rol ADMIN olmalıdır
  if (!token || role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;