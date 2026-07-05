import PageFrame from "@/src/components/app/PageFrame";
import ProtectedAdminPage from "@/src/components/app/ProtectedAdminPage";
import AdminCityPagesPage from "@/src/views/admin/AdminCityPagesPage";

export default function AdminCityPagesRoute() {
  return <PageFrame><ProtectedAdminPage permission="city-pages"><AdminCityPagesPage /></ProtectedAdminPage></PageFrame>;
}
