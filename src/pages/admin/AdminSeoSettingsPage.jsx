import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders, logoutAdmin } from "../../utils/adminAuth";
import "./AdminContentPage.css";

function Field({ label, value, onChange, textarea = false, readOnly = false }) {
  return (
    <label className="admin-content__field admin-content__field--full">
      <span>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={onChange} readOnly={readOnly} />
      ) : (
        <input type="text" value={value} onChange={onChange} readOnly={readOnly} />
      )}
    </label>
  );
}

export default function AdminSeoSettingsPage() {
  const navigate = useNavigate();
  const [seoPages, setSeoPages] = useState({});
  const [selectedKey, setSelectedKey] = useState("");
  const [form, setForm] = useState({ key: "", label: "", path: "", metaTitle: "", metaDescription: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSeoPages() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/seo-pages"), {
          headers: getAdminAuthHeaders()
        });
        const data = await response.json();

        if (response.status === 401) {
          logoutAdmin();
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load SEO settings.");
        }

        const nextPages = data.pages || {};
        setSeoPages(nextPages);

        const sortedKeys = Object.values(nextPages)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((item) => item.key);

        if (sortedKeys.length > 0) {
          const firstPage = nextPages[sortedKeys[0]];
          setSelectedKey(firstPage.key);
          setForm({
            key: firstPage.key,
            label: firstPage.label,
            path: firstPage.path,
            metaTitle: firstPage.metaTitle || "",
            metaDescription: firstPage.metaDescription || ""
          });
        }
      } catch (loadError) {
        setError(loadError.message || "Failed to load SEO settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSeoPages();
  }, [navigate]);

  const pageList = useMemo(() => {
    return Object.values(seoPages || {}).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [seoPages]);

  const currentPageLink = useMemo(() => {
    if (!form.path) {
      return "";
    }

    if (typeof window === "undefined") {
      return form.path;
    }

    return `${window.location.origin}${form.path}`;
  }, [form.path]);

  function selectPage(page) {
    setSelectedKey(page.key);
    setForm({
      key: page.key,
      label: page.label,
      path: page.path,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || ""
    });
    setMessage("");
    setError("");
  }

  function handleFieldChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
    setMessage("");
    setError("");
  }

  async function handleSave() {
    try {
      if (!form.key) {
        throw new Error("Select a page first.");
      }

      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(buildApiUrl(`/api/admin/seo-pages/${form.key}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders()
        },
        body: JSON.stringify({
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription
        })
      });
      const data = await response.json();

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to update SEO settings.");
      }

      setSeoPages(data.pages || {});
      setForm((current) => ({
        ...current,
        metaTitle: data.page?.metaTitle || current.metaTitle,
        metaDescription: data.page?.metaDescription || current.metaDescription
      }));
      setMessage(data.message || "SEO settings updated successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to update SEO settings.");
    } finally {
      setSaving(false);
    }
  }

  const actions = form.key ? (
    <button type="button" className="admin-content__save-top-button" onClick={handleSave} disabled={saving || loading}>
      <Save size={13} />
      <span>{saving ? "Saving..." : "Save Changes"}</span>
    </button>
  ) : null;

  return (
    <AdminLayout title="SEO Settings" actions={actions}>
      <div className="admin-content__grid admin-content__grid--editor-layout">
        <section className="admin-content__card admin-content__card--sections">
          <h2 className="admin-content__card-title">Pages</h2>
          <div className="admin-content__sections-list">
            {pageList.map((page) => (
              <button
                key={page.key}
                type="button"
                className={`admin-content__section-item ${selectedKey === page.key ? "admin-content__section-item--active" : ""}`}
                onClick={() => selectPage(page)}
              >
                <span className="admin-content__section-item-icon" />
                <span>{page.label}</span>
                <span className="admin-city-cms__toggle-placeholder" />
              </button>
            ))}
          </div>
        </section>

        <section className="admin-content__card admin-content__card--editor admin-content__card--editor-clean">
          {error ? <p className="admin-content__status admin-content__status--error">{error}</p> : null}
          {message ? <p className="admin-content__status admin-content__status--success">{message}</p> : null}

          {loading ? (
            <p className="admin-content__empty-text">Loading SEO settings...</p>
          ) : !form.key ? (
            <p className="admin-content__empty-text">No SEO pages found.</p>
          ) : (
            <>
              <h2 className="admin-content__editor-title">Editing: {form.label}</h2>

              <div className="admin-content__editor-fields">
                <Field label="Page Name" value={form.label} onChange={() => {}} readOnly />
                <Field label="Route" value={form.path} onChange={() => {}} readOnly />
                <Field label="Meta Title" value={form.metaTitle} onChange={(event) => handleFieldChange("metaTitle", event.target.value)} />
                <Field
                  label="Meta Description"
                  value={form.metaDescription}
                  onChange={(event) => handleFieldChange("metaDescription", event.target.value)}
                  textarea
                />
              </div>

              {currentPageLink ? (
                <div className="admin-content__preview-link-row">
                  <div>
                    <p className="admin-content__preview-label">Frontend Link</p>
                    <a href={currentPageLink} target="_blank" rel="noreferrer" className="admin-content__preview-link">
                      {currentPageLink}
                    </a>
                  </div>
                  <a href={currentPageLink} target="_blank" rel="noreferrer" className="admin-content__preview-button">
                    <ExternalLink size={14} />
                    <span>View Page</span>
                  </a>
                </div>
              ) : null}

              <div className="admin-content__footer-actions">
                <button type="button" className="admin-content__cancel-button" onClick={() => selectPage(seoPages[form.key])}>
                  Cancel
                </button>
                <button type="button" className="admin-content__update-button" onClick={handleSave} disabled={saving || loading}>
                  {saving ? "Saving..." : "Update SEO"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
