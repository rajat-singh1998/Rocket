import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Eye, FilePlus2, Pencil, Save, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders, logoutAdmin } from "../../utils/adminAuth";
import "./AdminContentPage.css";
import "./AdminCityPagesPage.css";

const defaultSectionVisibility = {
  hero: true,
  services: true,
  sameDay: true,
  waste: true,
  property: true,
  greenBanner: true
};

const defaultCitySectionImages = {
  heroImage: "/images/rocket/generic-uk-residential-banner.png",
  wasteImage: "/images/rocket/rc_29.png"
};

const sectionItems = [
  { key: "details", label: "Page Details", canToggle: false },
  { key: "hero", label: "Hero Section", canToggle: true },
  { key: "services", label: "Services Heading Section", canToggle: true },
  { key: "sameDay", label: "Same-Day Section", canToggle: true },
  { key: "waste", label: "Waste Disposal Section", canToggle: true },
  { key: "property", label: "Property Clearance Section", canToggle: true },
  { key: "greenBanner", label: "Green Banner Section", canToggle: true }
];

const initialCityForm = {
  id: "",
  name: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  heroTitle: "",
  heroSubheadline: "",
  heroText: "",
  heroImage: defaultCitySectionImages.heroImage,
  heroAlt: "",
  servicesTitle: "",
  sameDayTitle: "",
  sameDayIntro: "",
  sameDayBulletsText: "",
  sameDayFooter: "",
  wasteTitle: "",
  wasteText: "",
  wasteImage: defaultCitySectionImages.wasteImage,
  wasteAlt: "",
  wasteSubTitle: "",
  wasteSubText: "",
  propertyTitle: "",
  propertyText: "",
  greenTitle: "",
  greenSubtitle: "",
  greenFooter: "",
  sectionVisibility: defaultSectionVisibility
};

const emptyCityImageFiles = {
  heroImageFile: null,
  wasteImageFile: null
};

const CITY_PAGES_PER_PAGE = 10;

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildPaginationItems(currentPage, totalPages) {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    items.push("ellipsis-left");
  }

  for (let page = start; page <= end; page += 1) {
    if (!items.includes(page)) {
      items.push(page);
    }
  }

  if (end < totalPages - 1) {
    items.push("ellipsis-right");
  }

  if (!items.includes(totalPages)) {
    items.push(totalPages);
  }

  return items;
}

function toCityForm(page) {
  return {
    id: page.id || "",
    name: page.name || "",
    slug: page.slug || "",
    metaTitle: page.metaTitle || "",
    metaDescription: page.metaDescription || "",
    heroTitle: page.heroTitle || "",
    heroSubheadline: page.heroSubheadline || "",
    heroText: page.heroText || "",
    heroImage: page.heroImage || defaultCitySectionImages.heroImage,
    heroAlt: page.heroAlt || "",
    servicesTitle: page.servicesTitle || "",
    sameDayTitle: page.sameDayTitle || "",
    sameDayIntro: page.sameDayIntro || "",
    sameDayBulletsText: Array.isArray(page.sameDayBullets) ? page.sameDayBullets.join("\n") : "",
    sameDayFooter: page.sameDayFooter || "",
    wasteTitle: page.wasteTitle || "",
    wasteText: page.wasteText || "",
    wasteImage: page.wasteImage || defaultCitySectionImages.wasteImage,
    wasteAlt: page.wasteAlt || "",
    wasteSubTitle: page.wasteSubTitle || "",
    wasteSubText: page.wasteSubText || "",
    propertyTitle: page.propertyTitle || "",
    propertyText: page.propertyText || "",
    greenTitle: page.greenTitle || "",
    greenSubtitle: page.greenSubtitle || "",
    greenFooter: page.greenFooter || "",
    sectionVisibility: {
      ...defaultSectionVisibility,
      ...(page.sectionVisibility || {})
    }
  };
}

function toCityPayload(form) {
  return {
    name: form.name,
    slug: form.slug,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    heroTitle: form.heroTitle,
    heroSubheadline: form.heroSubheadline,
    heroText: form.heroText,
    heroImage: form.heroImage,
    heroAlt: form.heroAlt,
    servicesTitle: form.servicesTitle,
    sameDayTitle: form.sameDayTitle,
    sameDayIntro: form.sameDayIntro,
    sameDayBullets: form.sameDayBulletsText
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean),
    sameDayFooter: form.sameDayFooter,
    wasteTitle: form.wasteTitle,
    wasteText: form.wasteText,
    wasteImage: form.wasteImage,
    wasteAlt: form.wasteAlt,
    wasteSubTitle: form.wasteSubTitle,
    wasteSubText: form.wasteSubText,
    propertyTitle: form.propertyTitle,
    propertyText: form.propertyText,
    greenTitle: form.greenTitle,
    greenSubtitle: form.greenSubtitle,
    greenFooter: form.greenFooter,
    sectionVisibility: form.sectionVisibility
  };
}

function Field({ label, value, onChange, textarea = false }) {
  return (
    <label className="admin-content__field admin-content__field--full">
      <span>{label}</span>
      {textarea ? <textarea value={value} onChange={onChange} /> : <input type="text" value={value} onChange={onChange} />}
    </label>
  );
}

function ImageUploadField({ label, currentValue, onFileChange }) {
  return (
    <label className="admin-content__field admin-content__field--full">
      <span>{label}</span>
      <input type="file" accept="image/*" onChange={(event) => onFileChange(event.target.files?.[0] || null)} />
      <small>{currentValue ? `Current: ${currentValue}` : "No image selected yet."}</small>
    </label>
  );
}

export default function AdminCityPagesPage() {
  const navigate = useNavigate();
  const [cityPages, setCityPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [cityForm, setCityForm] = useState(initialCityForm);
  const [cityImageFiles, setCityImageFiles] = useState(emptyCityImageFiles);
  const [slugEdited, setSlugEdited] = useState(false);
  const [activeEditor, setActiveEditor] = useState("details");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPages() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/city-pages"), {
          headers: getAdminAuthHeaders()
        });
        const data = await response.json();

        if (response.status === 401) {
          logoutAdmin();
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load city pages.");
        }

        setCityPages(data.pages || []);
      } catch (loadError) {
        setError(loadError.message || "Failed to load city pages.");
      } finally {
        setLoading(false);
      }
    }

    loadPages();
  }, [navigate]);

  const currentPageLink = useMemo(() => {
    if (!cityForm.slug) {
      return "";
    }

    if (typeof window === "undefined") {
      return `/cities/${cityForm.slug}`;
    }

    return `${window.location.origin}/cities/${cityForm.slug}`;
  }, [cityForm.slug]);

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return cityPages;
    }

    return cityPages.filter((page) => {
      return page.name.toLowerCase().includes(query) || page.slug.toLowerCase().includes(query);
    });
  }, [cityPages, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPages.length / CITY_PAGES_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * CITY_PAGES_PER_PAGE;

  const paginatedPages = useMemo(() => {
    return filteredPages.slice(pageStartIndex, pageStartIndex + CITY_PAGES_PER_PAGE);
  }, [filteredPages, pageStartIndex]);

  const paginationItems = useMemo(() => buildPaginationItems(currentPage, totalPages), [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetStatus = () => {
    setMessage("");
    setError("");
  };

  const openEditorForPage = (page) => {
    setSelectedPageId(page.id);
    setCityForm(toCityForm(page));
    setSlugEdited(true);
    setActiveEditor("details");
    setViewMode("editor");
    resetStatus();
  };

  const handleCreateNewPage = () => {
    setSelectedPageId("");
    setCityForm(initialCityForm);
    setSlugEdited(false);
    setActiveEditor("details");
    setViewMode("editor");
    resetStatus();
  };

  const handleBackToList = () => {
    setViewMode("list");
    setActiveEditor("details");
    resetStatus();
  };

  const handleFieldChange = (field, value) => {
    setCityForm((current) => {
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

  const handleVisibilityToggle = (sectionKey) => {
    setCityForm((current) => ({
      ...current,
      sectionVisibility: {
        ...current.sectionVisibility,
        [sectionKey]: !current.sectionVisibility[sectionKey]
      }
    }));

    resetStatus();
  };

  const handleImageFileChange = (field, file) => {
    setCityImageFiles((current) => ({
      ...current,
      [field]: file || null
    }));
    resetStatus();
  };

  const handleCreatePage = async () => {
    try {
      setSaving(true);
      resetStatus();

      if (!cityForm.name.trim()) {
        throw new Error("City name is required.");
      }

      const response = await fetch(buildApiUrl("/api/admin/city-pages"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders()
        },
        body: JSON.stringify({
          name: cityForm.name,
          slug: cityForm.slug
        })
      });
      const data = await response.json();

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to create city page.");
      }

      setCityPages(data.pages || []);
      setSelectedPageId(data.page.id);
      setCityForm(toCityForm(data.page));
      setSlugEdited(true);
      setActiveEditor("details");
      setViewMode("editor");
      setMessage(data.message || "City page created successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to create city page.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCityPage = async () => {
    try {
      if (!cityForm.id) {
        throw new Error("Create the city page first.");
      }

      setSaving(true);
      resetStatus();

      const formData = new FormData();
      const payload = toCityPayload(cityForm);

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "sectionVisibility") {
          formData.append(key, JSON.stringify(value));
          return;
        }

        if (key === "sameDayBullets") {
          formData.append(key, cityForm.sameDayBulletsText);
          return;
        }

        formData.append(key, value ?? "");
      });

      if (cityImageFiles.heroImageFile) {
        formData.append("heroImageFile", cityImageFiles.heroImageFile);
      }

      if (cityImageFiles.wasteImageFile) {
        formData.append("wasteImageFile", cityImageFiles.wasteImageFile);
      }

      const response = await fetch(buildApiUrl(`/api/admin/city-pages/${cityForm.id}`), {
        method: "PUT",
        headers: getAdminAuthHeaders(),
        body: formData
      });
      const data = await response.json();

      if (response.status === 401) {
        logoutAdmin();
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to update city page.");
      }

      setCityPages(data.pages || []);
      setCityForm(toCityForm(data.page));
      setMessage(data.message || "City page updated successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to update city page.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCityPage = async (pageId = cityForm.id) => {
    try {
      if (!pageId) {
        return;
      }

      setDeleting(true);
      resetStatus();

      const response = await fetch(buildApiUrl(`/api/admin/city-pages/${pageId}`), {
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
        throw new Error(data.message || "Failed to delete city page.");
      }

      setCityPages(data.pages || []);

      if (selectedPageId === pageId) {
        setSelectedPageId("");
        setCityForm(initialCityForm);
        setSlugEdited(false);
        setActiveEditor("details");
        setViewMode("list");
      }

      setMessage(data.message || "City page deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete city page.");
    } finally {
      setDeleting(false);
    }
  };

  const actions = viewMode === "editor" && cityForm.id ? (
    <button type="button" className="admin-content__save-top-button" onClick={handleSaveCityPage} disabled={saving || loading}>
      <Save size={13} />
      <span>{saving ? "Saving..." : "Save Changes"}</span>
    </button>
  ) : null;

  return (
    <AdminLayout title="City Pages" actions={actions}>
      {viewMode === "list" ? (
        <section className="admin-city-pages__list-view">
          <div className="admin-city-pages__list-header">
            <div>
              <p className="admin-city-pages__subtitle">Only created city pages are shown here.</p>
            </div>
            <button type="button" className="admin-content__new-page-button" onClick={handleCreateNewPage}>
              <FilePlus2 size={14} />
              <span>Add New Page</span>
            </button>
          </div>

          {error ? <p className="admin-content__status admin-content__status--error">{error}</p> : null}
          {message ? <p className="admin-content__status admin-content__status--success">{message}</p> : null}

          <div className="admin-city-pages__list-card">
            <div className="admin-city-pages__toolbar">
              <label className="admin-city-pages__search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search city pages..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>
            </div>

            <div className="admin-city-pages__table-wrap">
              <table className="admin-city-pages__table">
                <thead>
                  <tr>
                    <th>SR.NO</th>
                    <th>CITY NAME</th>
                    <th>SLUG / URL</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="admin-city-pages__empty-cell">Loading city pages...</td>
                    </tr>
                  ) : filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="admin-city-pages__empty-cell">No city pages found.</td>
                    </tr>
                  ) : (
                    paginatedPages.map((page, index) => {
                      const pageLink = `${window.location.origin}/cities/${page.slug}`;

                      return (
                        <tr key={page.id}>
                          <td>
                            <span className="admin-city-pages__serial">{String(pageStartIndex + index + 1).padStart(2, "0")}</span>
                          </td>
                          <td>{page.name}</td>
                          <td>/cities/{page.slug}</td>
                          <td>
                            <div className="admin-city-pages__actions">
                              <a href={pageLink} target="_blank" rel="noreferrer" className="admin-city-pages__icon-button" title="View page">
                                <Eye size={15} />
                              </a>
                              <button type="button" className="admin-city-pages__icon-button" onClick={() => openEditorForPage(page)} title="Edit page">
                                <Pencil size={15} />
                              </button>
                              <button type="button" className="admin-city-pages__icon-button" onClick={() => handleDeleteCityPage(page.id)} title="Delete page" disabled={deleting}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filteredPages.length > 0 && totalPages > 1 ? (
              <div className="admin-city-pages__pagination">
                <button
                  type="button"
                  className="admin-city-pages__pagination-button admin-city-pages__pagination-button--nav"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {paginationItems.map((item) =>
                  typeof item === "string" ? (
                    <span key={item} className="admin-city-pages__pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`admin-city-pages__pagination-button ${currentPage === item ? "admin-city-pages__pagination-button--active" : ""}`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {String(item).padStart(2, "0")}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="admin-city-pages__pagination-button admin-city-pages__pagination-button--nav"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <>
          <div className="admin-city-pages__editor-header">
            <button type="button" className="admin-city-pages__back-button" onClick={handleBackToList}>
              <ArrowLeft size={15} />
              <span>Back To City Pages</span>
            </button>
          </div>

          <div className="admin-content__grid admin-content__grid--editor-layout">
            <section className="admin-content__card admin-content__card--sections">
              <h2 className="admin-content__card-title">Page Sections</h2>

              {!cityForm.id ? (
                <p className="admin-content__empty-text admin-content__empty-text--panel">
                  Create a city page first, then its sections will appear here.
                </p>
              ) : (
                <div className="admin-content__sections-list admin-city-cms__sections-list">
                  {sectionItems.map((item) => {
                    const isVisible = item.canToggle ? cityForm.sectionVisibility[item.key] !== false : true;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        className={`admin-content__section-item ${activeEditor === item.key ? "admin-content__section-item--active" : ""}`}
                        onClick={() => setActiveEditor(item.key)}
                      >
                        <span className="admin-content__section-item-icon" />
                        <span>{item.label}</span>
                        {item.canToggle ? (
                          <button
                            type="button"
                            className={`admin-city-cms__toggle-button admin-content__section-item-toggle ${isVisible ? "" : "admin-content__section-item-toggle--inactive"}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleVisibilityToggle(item.key);
                            }}
                            aria-label={`${isVisible ? "Hide" : "Show"} ${item.label}`}
                          />
                        ) : (
                          <span className="admin-city-cms__toggle-placeholder" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="admin-content__card admin-content__card--editor admin-content__card--editor-clean">
              {error ? <p className="admin-content__status admin-content__status--error">{error}</p> : null}
              {message ? <p className="admin-content__status admin-content__status--success">{message}</p> : null}

              {!cityForm.id ? (
                <>
                  <h2 className="admin-content__editor-title">Create New City Page</h2>

                  <div className="admin-content__editor-fields">
                    <Field label="City Name" value={cityForm.name} onChange={(event) => handleFieldChange("name", event.target.value)} />
                    <Field label="Slug" value={cityForm.slug} onChange={(event) => handleFieldChange("slug", slugify(event.target.value))} />
                    <Field label="Meta Title" value={cityForm.metaTitle} onChange={(event) => handleFieldChange("metaTitle", event.target.value)} />
                    <Field
                      label="Meta Description"
                      value={cityForm.metaDescription}
                      onChange={(event) => handleFieldChange("metaDescription", event.target.value)}
                      textarea
                    />
                  </div>

                  <div className="admin-content__footer-actions">
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>
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
                    <Field label="City Name" value={cityForm.name} onChange={(event) => handleFieldChange("name", event.target.value)} />
                    <Field label="Slug" value={cityForm.slug} onChange={(event) => handleFieldChange("slug", slugify(event.target.value))} />
                    <Field label="Meta Title" value={cityForm.metaTitle} onChange={(event) => handleFieldChange("metaTitle", event.target.value)} />
                    <Field
                      label="Meta Description"
                      value={cityForm.metaDescription}
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
                    <button type="button" className="admin-content__delete-button" onClick={() => handleDeleteCityPage(cityForm.id)} disabled={deleting || saving}>
                      <Trash2 size={14} />
                      <span>{deleting ? "Deleting..." : "Delete Page"}</span>
                    </button>
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>
                      Cancel
                    </button>
                    <button type="button" className="admin-content__update-button" onClick={handleSaveCityPage} disabled={saving || deleting || loading}>
                      {saving ? "Saving..." : "Update Details"}
                    </button>
                  </div>
                </>
              ) : activeEditor === "hero" ? (
                <>
                  <h2 className="admin-content__editor-title">Editing: Hero Section</h2>
                  <div className="admin-content__editor-fields">
                    <Field label="Headline" value={cityForm.heroTitle} onChange={(event) => handleFieldChange("heroTitle", event.target.value)} />
                    <Field label="Subheading" value={cityForm.heroSubheadline} onChange={(event) => handleFieldChange("heroSubheadline", event.target.value)} />
                    <Field label="Description" value={cityForm.heroText} onChange={(event) => handleFieldChange("heroText", event.target.value)} textarea />
                    <ImageUploadField label="Background Image" currentValue={cityForm.heroImage} onFileChange={(file) => handleImageFileChange("heroImageFile", file)} />
                    <Field label="Background Image Alt Text" value={cityForm.heroAlt} onChange={(event) => handleFieldChange("heroAlt", event.target.value)} />
                  </div>
                  <div className="admin-content__footer-actions">
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>Cancel</button>
                    <button type="button" className="admin-content__update-button" onClick={handleSaveCityPage} disabled={saving || deleting || loading}>{saving ? "Saving..." : "Update Section"}</button>
                  </div>
                </>
              ) : activeEditor === "services" ? (
                <>
                  <h2 className="admin-content__editor-title">Editing: Services Heading Section</h2>
                  <div className="admin-content__editor-fields">
                    <Field label="Section Title" value={cityForm.servicesTitle} onChange={(event) => handleFieldChange("servicesTitle", event.target.value)} />
                  </div>
                  <div className="admin-content__footer-actions">
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>Cancel</button>
                    <button type="button" className="admin-content__update-button" onClick={handleSaveCityPage} disabled={saving || deleting || loading}>{saving ? "Saving..." : "Update Section"}</button>
                  </div>
                </>
              ) : activeEditor === "sameDay" ? (
                <>
                  <h2 className="admin-content__editor-title">Editing: Same-Day Section</h2>
                  <div className="admin-content__editor-fields">
                    <Field label="Headline" value={cityForm.sameDayTitle} onChange={(event) => handleFieldChange("sameDayTitle", event.target.value)} />
                    <Field label="Intro Text" value={cityForm.sameDayIntro} onChange={(event) => handleFieldChange("sameDayIntro", event.target.value)} textarea />
                    <Field label="Bullet Points (One Per Line)" value={cityForm.sameDayBulletsText} onChange={(event) => handleFieldChange("sameDayBulletsText", event.target.value)} textarea />
                    <Field label="Footer Text" value={cityForm.sameDayFooter} onChange={(event) => handleFieldChange("sameDayFooter", event.target.value)} textarea />
                  </div>
                  <div className="admin-content__footer-actions">
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>Cancel</button>
                    <button type="button" className="admin-content__update-button" onClick={handleSaveCityPage} disabled={saving || deleting || loading}>{saving ? "Saving..." : "Update Section"}</button>
                  </div>
                </>
              ) : activeEditor === "waste" ? (
                <>
                  <h2 className="admin-content__editor-title">Editing: Waste Disposal Section</h2>
                  <div className="admin-content__editor-fields">
                    <Field label="Headline" value={cityForm.wasteTitle} onChange={(event) => handleFieldChange("wasteTitle", event.target.value)} />
                    <Field label="Description" value={cityForm.wasteText} onChange={(event) => handleFieldChange("wasteText", event.target.value)} textarea />
                    <ImageUploadField label="Section Image" currentValue={cityForm.wasteImage} onFileChange={(file) => handleImageFileChange("wasteImageFile", file)} />
                    <Field label="Section Image Alt Text" value={cityForm.wasteAlt} onChange={(event) => handleFieldChange("wasteAlt", event.target.value)} />
                    <Field label="Subheading" value={cityForm.wasteSubTitle} onChange={(event) => handleFieldChange("wasteSubTitle", event.target.value)} />
                    <Field label="Additional Text" value={cityForm.wasteSubText} onChange={(event) => handleFieldChange("wasteSubText", event.target.value)} textarea />
                  </div>
                  <div className="admin-content__footer-actions">
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>Cancel</button>
                    <button type="button" className="admin-content__update-button" onClick={handleSaveCityPage} disabled={saving || deleting || loading}>{saving ? "Saving..." : "Update Section"}</button>
                  </div>
                </>
              ) : activeEditor === "property" ? (
                <>
                  <h2 className="admin-content__editor-title">Editing: Property Clearance Section</h2>
                  <div className="admin-content__editor-fields">
                    <Field label="Headline" value={cityForm.propertyTitle} onChange={(event) => handleFieldChange("propertyTitle", event.target.value)} />
                    <Field label="Description" value={cityForm.propertyText} onChange={(event) => handleFieldChange("propertyText", event.target.value)} textarea />
                  </div>
                  <div className="admin-content__footer-actions">
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>Cancel</button>
                    <button type="button" className="admin-content__update-button" onClick={handleSaveCityPage} disabled={saving || deleting || loading}>{saving ? "Saving..." : "Update Section"}</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="admin-content__editor-title">Editing: Green Banner Section</h2>
                  <div className="admin-content__editor-fields">
                    <Field label="Headline" value={cityForm.greenTitle} onChange={(event) => handleFieldChange("greenTitle", event.target.value)} />
                    <Field label="Subheadline" value={cityForm.greenSubtitle} onChange={(event) => handleFieldChange("greenSubtitle", event.target.value)} textarea />
                    <Field label="Footer Text" value={cityForm.greenFooter} onChange={(event) => handleFieldChange("greenFooter", event.target.value)} textarea />
                  </div>
                  <div className="admin-content__footer-actions">
                    <button type="button" className="admin-content__cancel-button" onClick={handleBackToList}>Cancel</button>
                    <button type="button" className="admin-content__update-button" onClick={handleSaveCityPage} disabled={saving || deleting || loading}>{saving ? "Saving..." : "Update Section"}</button>
                  </div>
                </>
              )}
            </section>
          </div>
        </>
      )}
    </AdminLayout>
  );
}



