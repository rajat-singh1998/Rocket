import AdminLayout from "../../components/layout/AdminLayout";
import "./AdminPlaceholderPage.css";

export default function AdminPlaceholderPage({ title, description }) {
  return (
    <AdminLayout title={title} description={description}>
      <section className="admin-placeholder__card">
        <h2 className="admin-placeholder__title">{title}</h2>
        <p className="admin-placeholder__text">
          This page shell is ready in the correct Rocket project. We can now connect the real CMS or API data without changing the layout structure.
        </p>
        <div className="admin-placeholder__grid">
          <div className="admin-placeholder__mini-card">
            <p className="admin-placeholder__mini-title">Layout</p>
            <p className="admin-placeholder__mini-text">Built and ready for real content.</p>
          </div>
          <div className="admin-placeholder__mini-card">
            <p className="admin-placeholder__mini-title">Status</p>
            <p className="admin-placeholder__mini-text">Frontend ready, backend pending.</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
