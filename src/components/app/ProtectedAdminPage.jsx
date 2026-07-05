import { useEffect, useState } from "react";
import { Navigate } from "../../lib/router";
import { hasAdminPermission, isAdminAuthenticated } from "../../utils/adminAuth";

export default function ProtectedAdminPage({ permission, children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      setStatus("login");
      return;
    }

    if (permission && !hasAdminPermission(permission)) {
      setStatus("profile");
      return;
    }

    setStatus("allowed");
  }, [permission]);

  if (status === "checking") {
    return null;
  }

  if (status === "login") {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === "profile") {
    return <Navigate to="/admin/profile" replace />;
  }

  return children;
}
