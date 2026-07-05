import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminSeoSettingsPage from "@/src/views/admin/AdminSeoSettingsPage";

export default function AdminSeoRoute() {
  return <PageFrame><ProtectedAdminPage permission="seo"><AdminSeoSettingsPage /></ProtectedAdminPage></PageFrame>;
}
