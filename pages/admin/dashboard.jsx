import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminDashboardPage from "@/src/views/admin/AdminDashboardPage";

export default function AdminDashboardRoute() {
  return <PageFrame><ProtectedAdminPage permission="dashboard"><AdminDashboardPage /></ProtectedAdminPage></PageFrame>;
}
