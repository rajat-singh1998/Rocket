import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminContactsPage from "@/src/views/admin/AdminContactsPage";

export default function AdminContactsRoute() {
  return <PageFrame><ProtectedAdminPage permission="contacts"><AdminContactsPage /></ProtectedAdminPage></PageFrame>;
}
