import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminBlogsPage from "@/src/views/admin/AdminBlogsPage";

export default function AdminBlogsRoute() {
  return <PageFrame><ProtectedAdminPage permission="blogs"><AdminBlogsPage /></ProtectedAdminPage></PageFrame>;
}
