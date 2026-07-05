import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminBlogEditorPage from "@/src/views/admin/AdminBlogEditorPage";

export default function AdminNewBlogRoute() {
  return <PageFrame><ProtectedAdminPage permission="blogs"><AdminBlogEditorPage /></ProtectedAdminPage></PageFrame>;
}
