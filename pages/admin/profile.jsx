import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminProfilePage from "@/src/views/admin/AdminProfilePage";

export default function AdminProfileRoute() {
  return <PageFrame><ProtectedAdminPage><AdminProfilePage /></ProtectedAdminPage></PageFrame>;
}
