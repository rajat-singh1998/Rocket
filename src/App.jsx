import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CreditAccountPage from "./pages/public/CreditAccountPage";
import HomePage from "./pages/public/HomePage";
import ServicesPage from "./pages/public/ServicesPage";
import LoadSizesPage from "./pages/public/LoadSizesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPlaceholderPage from "./pages/admin/AdminPlaceholderPage";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const target = document.getElementById(id);
      if (target) {
        window.setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 20);
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/load-sizes" element={<LoadSizesPage />} />
        <Route path="/credit-account" element={<CreditAccountPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route
          path="/admin/content"
          element={<AdminPlaceholderPage title="Content" description="Manage website sections and homepage content." />}
        />
        <Route
          path="/admin/blogs"
          element={<AdminPlaceholderPage title="Blogs" description="Manage blog posts and editorial content." />}
        />
        <Route
          path="/admin/contacts"
          element={<AdminPlaceholderPage title="Contacts" description="Review contact requests and incoming enquiries." />}
        />
      </Routes>
    </>
  );
}
