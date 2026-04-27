import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FilePlus2, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders, logoutAdmin } from "../../utils/adminAuth";
import "./AdminContentPage.css";

const initialPageForm = {
  id: "",
  name: "",
  slug: "",
  title: "",
  sections: [
    { heading: "Section 1", content: "" },
    { heading: "Section 2", content: "" },
    { heading: "Section 3", content: "" }
  ]
};

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toPageForm(page) {
  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    title: page.title,
    sections:
      Array.isArray(page.sections) && page.sections.length > 0
        ? page.sections
        : initialPageForm.sections
  };
}

function getEditorItems(pageForm) {
  return [
    { key: "details", label: "Page Details" },
    ...pageForm.sections.map((section, index) => ({
      key: `section-${index}`,
      label: section.heading?.trim() || `Section ${index + 1}`
    }))
  ];
}

export default function AdminContentPage() {
  const navigate = useNavigate();
  const [customPages, setCustomPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [pageForm, setPageForm] = useState(initialPageForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [activeEditor, setActiveEditor] = useState("details");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPages() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/content/pages"), {
          headers: getAdminAuthHeaders()
        });
        const data = await response.json();

        if (response.status === 401) {
          logoutAdmin();
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load pages.");
        }

        setCustomPages(data.pages || []);
      } catch (loadError) {
        setError(loadError.message || "Failed to load pages.");
      } finally {
        setLoading(false);
      }
    }

    loadPages();
  }, [navigate]);

  const editorItems = useMemo(() => getEditorItems(pageForm), [pageForm]);

  const currentPageLink = useMemo(() => {
    if (!pageForm.slug) {
      return "";
    }

    if (typeof window === "undefined") {
      return `/${pageForm.slug}`;
    }

    return `${window.location.origin}/${pageForm.slug}`;
  }, [pageForm.slug]);

  const activeSectionIndex = activeEditor.startsWith("section-")
    ? Number(activeEditor.replace("section-", ""))
    : -1;

  const activeSection = activeSectionIndex >= 0 ? pageForm.sections[activeSectionIndex] : null;

  const resetStatus = () => {
    setMessage("");
    setError("");
  };

  const handlePageChange = (field, value) => {
    setPageForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && !slugEdited) {
        next.slug = slugify(value);
      }

      return next;
    });

    if (field === "slug") {
      setSlugEdited(true);
    }

    resetStatus();
  };

  const handleSectionChange = (index, field, value) => {
    setPageForm((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      )
    }));
    resetStatus();
  };

  const handleSelectPage = (page) => {
    setSelectedPageId(page.id);
    setPageForm(toPageForm(page));
    setSlugEdited(true);
    setActiveEditor("details");
    resetStatus();
  };

  const handleCreateNewPage = () => {
    setSelectedPageId("");
    setPageForm(initialPageForm);
    setSlugEdited(false);
    setActiveEditor("details");
    resetStatus();
  };

  const handleCreatePage = async () => {
    try {
      setSaving(true);
      resetStatus();

      if (!pageForm.name.trim()) {
        throw new Error("Page name is required.");
      }

      const response = await fetch(buildApiUrl("/api/admin/content/pages"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders()
        },
        body: JSON.stringify({
          name: pageForm.name,
          slug: pageForm.slug,
          title: pageForm.title || pageForm.name
        })
      });
      const data = await response.json();

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to create page.");
      }

      setCustomPages(data.pages || []);
      setSelectedPageId(data.page.id);
      setPageForm(toPageForm(data.page));
      setSlugEdited(true);
      setActiveEditor("details");
      setMessage(data.message || "Page created successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to create page.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContent = async () => {
    try {
      setSaving(true);
      resetStatus();

      if (!pageForm.id) {
        throw new Error("Create the page first.");
      }

      const response = await fetch(buildApiUrl(`/api/admin/content/pages/${pageForm.id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders()
        },
        body: JSON.stringify({
          name: pageForm.name,
          slug: pageForm.slug,
          title: pageForm.title || pageForm.name,
          sections: pageForm.sections
        })
      });
      const data = await response.json();

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to save page content.");
      }

      setCustomPages(data.pages || []);
      setPageForm(toPageForm(data.page));
      setMessage(data.message || "Page updated successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to save page content.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async () => {
    try {
      if (!pageForm.id) {
        return;
      }

      setDeleting(true);
      resetStatus();

      const response = await fetch(buildApiUrl(`/api/admin/content/pages/${pageForm.id}`), {
        method: "DELETE",
        headers: getAdminAuthHeaders()
      });
      const data = await response.json();

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to delete page.");
      }

      setCustomPages(data.pages || []);
      handleCreateNewPage();
      setMessage(data.message || "Page deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete page.");
    } finally {
      setDeleting(false);
    }
  };

  const actions = pageForm.id ? (
    <button
      type="button"
      className="admin-content__save-top-button"
      onClick={handleSaveContent}
      disabled={saving || loading}
    >
      <Save size={13} />
      <span>{saving ? "Saving..." : "Save Changes"}</span>
    </button>
  ) : null;

  return (
    <AdminLayout title="Content Management" actions={actions}>
      <div className="admin-content__topbar">
        <div className="admin-content__pages-toolbar">
          <p className="admin-content__toolbar-label">Created Pages</p>
          <div className="admin-content__toolbar-list">
            {loading ? <span className="admin-content__toolbar-empty">Loading pages...</span> : null}
            {!loading && customPages.length === 0 ? <span className="admin-content__toolbar-empty">No pages yet</span> : null}
            {customPages.map((page) => (
              <button
                key={page.id}
                type="button"
                className={`admin-content__toolbar-pill ${selectedPageId === page.id ? "admin-content__toolbar-pill--active" : ""}`}
                onClick={() => handleSelectPage(page)}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="admin-content__new-page-button" onClick={handleCreateNewPage}>
          <FilePlus2 size={14} />
          <span>New Page</span>
        </button>
      </div>

      <div className="admin-content__grid admin-content__grid--editor-layout">
        <section className="admin-content__card admin-content__card--sections">
          <h2 className="admin-content__card-title">Page Sections</h2>

          {!pageForm.id ? (
            <p className="admin-content__empty-text admin-content__empty-text--panel">
              Create a page first, then its sections will appear here.
            </p>
          ) : (
            <div className="admin-content__sections-list">
              {editorItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`admin-content__section-item ${activeEditor === item.key ? "admin-content__section-item--active" : ""}`}
                  onClick={() => setActiveEditor(item.key)}
                >
                  <span className="admin-content__section-item-icon" />
                  <span>{item.label}</span>
                  <span className="admin-content__section-item-toggle" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="admin-content__card admin-content__card--editor admin-content__card--editor-clean">
          {error ? <p className="admin-content__status admin-content__status--error">{error}</p> : null}
          {message ? <p className="admin-content__status admin-content__status--success">{message}</p> : null}

          {!pageForm.id ? (
            <>
              <h2 className="admin-content__editor-title">Create New Page</h2>

              <div className="admin-content__editor-fields">
                <label className="admin-content__field admin-content__field--full">
                  <span>Page Name</span>
                  <input
                    type="text"
                    value={pageForm.name}
                    onChange={(event) => handlePageChange("name", event.target.value)}
                    placeholder="Enter page name"
                  />
                </label>

                <label className="admin-content__field">
                  <span>Slug</span>
                  <input
                    type="text"
                    value={pageForm.slug}
                    onChange={(event) => handlePageChange("slug", slugify(event.target.value))}
                    placeholder="enter-page-slug"
                  />
                </label>

                <label className="admin-content__field">
                  <span>Page Title</span>
                  <input
                    type="text"
                    value={pageForm.title}
                    onChange={(event) => handlePageChange("title", event.target.value)}
                    placeholder="Frontend page title"
                  />
                </label>
              </div>

              <div className="admin-content__footer-actions">
                <button type="button" className="admin-content__cancel-button" onClick={handleCreateNewPage}>
                  Cancel
                </button>
                <button type="button" className="admin-content__update-button" onClick={handleCreatePage} disabled={saving || loading}>
                  {saving ? "Creating..." : "Create Page"}
                </button>
              </div>
            </>
          ) : activeEditor === "details" ? (
            <>
              <h2 className="admin-content__editor-title">Editing: Page Details</h2>

              <div className="admin-content__editor-fields">
                <label className="admin-content__field admin-content__field--full">
                  <span>Page Name</span>
                  <input type="text" value={pageForm.name} onChange={(event) => handlePageChange("name", event.target.value)} />
                </label>

                <label className="admin-content__field">
                  <span>Slug</span>
                  <input type="text" value={pageForm.slug} onChange={(event) => handlePageChange("slug", slugify(event.target.value))} />
                </label>

                <label className="admin-content__field">
                  <span>Page Title</span>
                  <input type="text" value={pageForm.title} onChange={(event) => handlePageChange("title", event.target.value)} />
                </label>
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
                <button type="button" className="admin-content__delete-button" onClick={handleDeletePage} disabled={deleting || saving}>
                  <Trash2 size={14} />
                  <span>{deleting ? "Deleting..." : "Delete Page"}</span>
                </button>
                <button type="button" className="admin-content__cancel-button" onClick={() => handleSelectPage(toPageForm(pageForm))}>
                  Cancel
                </button>
                <button type="button" className="admin-content__update-button" onClick={handleSaveContent} disabled={saving || loading || deleting}>
                  {saving ? "Saving..." : "Update Details"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="admin-content__editor-title">Editing: {activeSection?.heading || "Section"}</h2>

              <div className="admin-content__editor-fields">
                <label className="admin-content__field admin-content__field--full">
                  <span>Headline</span>
                  <input
                    type="text"
                    value={activeSection?.heading || ""}
                    onChange={(event) => handleSectionChange(activeSectionIndex, "heading", event.target.value)}
                  />
                </label>

                <label className="admin-content__field admin-content__field--full">
                  <span>Subheadline</span>
                  <textarea
                    value={activeSection?.content || ""}
                    onChange={(event) => handleSectionChange(activeSectionIndex, "content", event.target.value)}
                  />
                </label>

                <div className="admin-content__upload-box admin-content__field--full">
                  <span className="admin-content__upload-icon" />
                  <strong>Click to upload or drag and drop</strong>
                  <small>SVG, PNG, JPG or GIF (MAX. 800x400px)</small>
                </div>
              </div>

              <div className="admin-content__footer-actions">
                <button type="button" className="admin-content__cancel-button" onClick={() => setActiveEditor("details")}>
                  Cancel
                </button>
                <button type="button" className="admin-content__update-button" onClick={handleSaveContent} disabled={saving || loading || deleting}>
                  {saving ? "Saving..." : "Update Section"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
