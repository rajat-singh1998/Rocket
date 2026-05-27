import { FileText, MapPinned, NotebookText } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders } from "../../utils/adminAuth";
import "./AdminDashboardPage.css";

const summaryCards = [
  { key: "cityPages", label: "City Pages", icon: MapPinned },
  { key: "otherPages", label: "Other Pages", icon: FileText },
  { key: "blogs", label: "Blogs", icon: NotebookText }
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ cityPages: 0, otherPages: 0, blogs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCounts() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/dashboard-counts"), {
          headers: {
            ...getAdminAuthHeaders()
          }
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Unable to load dashboard counts.");
        }

        if (!ignore) {
          setCounts(data.counts || {});
        }
      } catch (countsError) {
        if (!ignore) {
          setError(countsError.message || "Unable to load dashboard counts.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCounts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AdminLayout title="Dashboard" description="Content overview for the website.">
      {error ? <p className="admin-dashboard__message admin-dashboard__message--error">{error}</p> : null}

      <section className="admin-dashboard__stats-grid">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.key} className="admin-dashboard__stat-card">
              <span className="admin-dashboard__stat-icon">
                <Icon size={22} />
              </span>
              <p className="admin-dashboard__stat-label">{item.label}</p>
              <p className="admin-dashboard__stat-value">{loading ? "..." : Number(counts[item.key] || 0).toLocaleString()}</p>
            </article>
          );
        })}
      </section>
    </AdminLayout>
  );
}
