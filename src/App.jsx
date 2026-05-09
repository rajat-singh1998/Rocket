import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CreditAccountPage from "./pages/public/CreditAccountPage";
import ContactPage from "./pages/public/ContactPage";
import FaqPage from "./pages/public/FaqPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/public/TermsConditionsPage";
import HomePage from "./pages/public/HomePage";
import ServicesPage from "./pages/public/ServicesPage";
import BlogPage from "./pages/public/BlogPage";
import BlogPostPage from "./pages/public/BlogPostPage";
import HowItWorksPage from "./pages/public/HowItWorksPage";
import AboutPage from "./pages/public/AboutPage";
import CityPage from "./pages/public/CityPage";
import CustomPage from "./pages/public/CustomPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminBlogsPage from "./pages/admin/AdminBlogsPage";
import AdminBlogEditorPage from "./pages/admin/AdminBlogEditorPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import AdminCityPagesPage from "./pages/admin/AdminCityPagesPage";
import AdminPlaceholderPage from "./pages/admin/AdminPlaceholderPage";
import { isAdminAuthenticated } from "./utils/adminAuth";

function ProtectedAdminRoute({ children }) {
  return isAdminAuthenticated() ? children : <Navigate to="/admin/login" replace />;
}

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
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/cities/:slug" element={<CityPage />} />
        <Route path="/credit-account" element={<CreditAccountPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>} />
        <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrdersPage /></ProtectedAdminRoute>} />
        <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsersPage /></ProtectedAdminRoute>} />
        <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfilePage /></ProtectedAdminRoute>} />
        <Route path="/admin/content" element={<ProtectedAdminRoute><AdminContentPage /></ProtectedAdminRoute>} />
        <Route path="/admin/city-pages" element={<ProtectedAdminRoute><AdminCityPagesPage /></ProtectedAdminRoute>} />
        <Route path="/admin/blogs" element={<ProtectedAdminRoute><AdminBlogsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/blogs/new" element={<ProtectedAdminRoute><AdminBlogEditorPage /></ProtectedAdminRoute>} />
        <Route path="/admin/blogs/:id" element={<ProtectedAdminRoute><AdminBlogEditorPage /></ProtectedAdminRoute>} />
        <Route
          path="/admin/contacts"
          element={<ProtectedAdminRoute><AdminPlaceholderPage title="Contacts" description="Review contact requests and incoming enquiries." /></ProtectedAdminRoute>}
        />
        <Route path="/:slug" element={<CustomPage />} />
      </Routes>
    </>
  );
}




