import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminUsersPage from "@/src/views/admin/AdminUsersPage";

export default function AdminUsersRoute() {
  return <PageFrame><ProtectedAdminPage permission="users"><AdminUsersPage /></ProtectedAdminPage></PageFrame>;
}
