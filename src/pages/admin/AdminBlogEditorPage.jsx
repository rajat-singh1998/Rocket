import { ArrowLeft, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders } from "../../utils/adminAuth";
import { emptyBlogForm, formToPayload, postToForm, slugify } from "./blogPostFormUtils";
import "./AdminBlogsPage.css";

const emptyBlogImageFiles = {
  heroImageFile: null,
  featuredImageFile: null,
  cardImageFile: null,
  sectionTwoImageFile: null
};

function ImageUploadField({ label, currentValue, onFileChange }) {
  return (
    <label className="admin-blogs__field">
      <span>{label}</span>
      <input type="file" accept="image/*" onChange={(event) => onFileChange(event.target.files?.[0] || null)} />
      <small>{currentValue ? `Current: ${currentValue}` : "No image selected yet."}</small>
    </label>
  );
}

export default function AdminBlogEditorPage() {
  const { id = "new" } = useParams();
  const navigate = useNavigate();
  const isCreating = id === "new";
  const [form, setForm] = useState(emptyBlogForm);
  const [imageFiles, setImageFiles] = useState(emptyBlogImageFiles);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isCreating);

  useEffect(() => {
    let ignore = false;

    async function loadPost() {
      if (isCreating) {
        setForm(emptyBlogForm);
        setImageFiles(emptyBlogImageFiles);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setMessage("");
      setError("");

      try {
        const response = await fetch(buildApiUrl("/api/admin/blog-posts"), {
          headers: {
            ...getAdminAuthHeaders()
          }
        });
        const data = await response.json();

        if (!ignore) {
          if (!response.ok || !data.ok) {
            throw new Error(data.message || "Unable to load blog post.");
          }

          const post = (data.posts || []).find((item) => item.id === id);

          if (!post) {
            throw new Error("Blog post not found.");
          }

          setForm(postToForm(post));
          setImageFiles(emptyBlogImageFiles);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to load blog post.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      ignore = true;
    };
  }, [id, isCreating]);

  function handleFieldChange(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "title") {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  function handleImageFileChange(field, file) {
    setImageFiles((current) => ({
      ...current,
      [field]: file || null
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = formToPayload(form);
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
          return;
        }

        formData.append(key, value ?? "");
      });

      if (imageFiles.heroImageFile) {
        formData.append("heroImageFile", imageFiles.heroImageFile);
      }

      if (imageFiles.featuredImageFile) {
        formData.append("featuredImageFile", imageFiles.featuredImageFile);
      }

      if (imageFiles.cardImageFile) {
        formData.append("cardImageFile", imageFiles.cardImageFile);
      }

      if (imageFiles.sectionTwoImageFile) {
        formData.append("sectionTwoImageFile", imageFiles.sectionTwoImageFile);
      }

      const response = await fetch(
        isCreating ? buildApiUrl("/api/admin/blog-posts") : buildApiUrl("/api/admin/blog-posts/" + id),
        {
          method: isCreating ? "POST" : "PUT",
          headers: {
            ...getAdminAuthHeaders()
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to save blog post.");
      }

      if (isCreating && data.post?.id) {
        navigate("/admin/blogs/" + data.post.id, { replace: true });
        return;
      }

      if (data.post) {
        setForm(postToForm(data.post));
        setImageFiles(emptyBlogImageFiles);
      }

      setMessage(data.message || "Blog post saved.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save blog post.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout title="Blogs Management">
      <section className="admin-blogs__editor-card admin-blogs__editor-card--standalone">
        <div className="admin-blogs__editor-head">
          <div>
            <Link to="/admin/blogs" className="admin-blogs__back-link">
              <ArrowLeft size={14} />
              <span>Back To Blogs</span>
            </Link>
            <h2 className="admin-blogs__editor-title">{isCreating ? "Create Blog Post" : "Edit Blog Post"}</h2>
            <p className="admin-blogs__editor-text">Manage the blog list page and every single post from here.</p>
          </div>
          <button type="button" className="admin-blogs__cancel-button" onClick={() => navigate("/admin/blogs")}>
            <X size={14} />
            <span>Cancel</span>
          </button>
        </div>

        {message ? <p className="admin-blogs__message admin-blogs__message--success">{message}</p> : null}
        {error ? <p className="admin-blogs__message admin-blogs__message--error">{error}</p> : null}

        {isLoading ? (
          <div className="admin-blogs__empty-state"><p>Loading blog post...</p></div>
        ) : (
          <form className="admin-blogs__form" onSubmit={handleSave}>
            <div className="admin-blogs__form-grid admin-blogs__form-grid--two">
              <label className="admin-blogs__field">
                <span>Title</span>
                <input value={form.title} onChange={(event) => handleFieldChange("title", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Slug</span>
                <input value={form.slug} onChange={(event) => handleFieldChange("slug", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Category</span>
                <input value={form.category} onChange={(event) => handleFieldChange("category", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Status</span>
                <select value={form.status} onChange={(event) => handleFieldChange("status", event.target.value)}>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </label>
              <label className="admin-blogs__field">
                <span>Author</span>
                <input value={form.author} onChange={(event) => handleFieldChange("author", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Date</span>
                <input value={form.date} onChange={(event) => handleFieldChange("date", event.target.value)} />
              </label>
            </div>

            <div className="admin-blogs__form-grid admin-blogs__form-grid--three">
              <ImageUploadField label="Hero Image" currentValue={form.heroImage} onFileChange={(file) => handleImageFileChange("heroImageFile", file)} />
              <ImageUploadField label="Featured Image" currentValue={form.featuredImage} onFileChange={(file) => handleImageFileChange("featuredImageFile", file)} />
              <ImageUploadField label="Card Image" currentValue={form.cardImage} onFileChange={(file) => handleImageFileChange("cardImageFile", file)} />
            </div>

            <label className="admin-blogs__field">
              <span>Excerpt</span>
              <textarea rows="3" value={form.excerpt} onChange={(event) => handleFieldChange("excerpt", event.target.value)} />
            </label>
            <label className="admin-blogs__field">
              <span>Intro</span>
              <textarea rows="4" value={form.intro} onChange={(event) => handleFieldChange("intro", event.target.value)} />
            </label>

            <div className="admin-blogs__section-block">
              <h3>Section One</h3>
              <label className="admin-blogs__field">
                <span>Section One Title</span>
                <input value={form.sectionOneTitle} onChange={(event) => handleFieldChange("sectionOneTitle", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Section One Paragraphs</span>
                <textarea rows="5" value={form.sectionOneParagraphsText} onChange={(event) => handleFieldChange("sectionOneParagraphsText", event.target.value)} />
              </label>
            </div>

            <div className="admin-blogs__section-block">
              <h3>Section Two</h3>
              <label className="admin-blogs__field">
                <span>Section Two Title</span>
                <input value={form.sectionTwoTitle} onChange={(event) => handleFieldChange("sectionTwoTitle", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Section Two Paragraphs</span>
                <textarea rows="4" value={form.sectionTwoParagraphsText} onChange={(event) => handleFieldChange("sectionTwoParagraphsText", event.target.value)} />
              </label>
              <div className="admin-blogs__form-grid admin-blogs__form-grid--two">
                <label className="admin-blogs__field">
                  <span>Checklist Title</span>
                  <input value={form.sectionTwoChecklistTitle} onChange={(event) => handleFieldChange("sectionTwoChecklistTitle", event.target.value)} />
                </label>
                <ImageUploadField label="Section Two Image" currentValue={form.sectionTwoImage} onFileChange={(file) => handleImageFileChange("sectionTwoImageFile", file)} />
              </div>
              <label className="admin-blogs__field">
                <span>Section Two Checklist</span>
                <textarea rows="4" value={form.sectionTwoChecklistText} onChange={(event) => handleFieldChange("sectionTwoChecklistText", event.target.value)} />
              </label>
            </div>

            <div className="admin-blogs__section-block">
              <h3>Quote Block</h3>
              <label className="admin-blogs__field">
                <span>Quote Text</span>
                <textarea rows="3" value={form.quoteText} onChange={(event) => handleFieldChange("quoteText", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Quote Author</span>
                <input value={form.quoteAuthor} onChange={(event) => handleFieldChange("quoteAuthor", event.target.value)} />
              </label>
            </div>

            <div className="admin-blogs__section-block">
              <h3>Section Three</h3>
              <label className="admin-blogs__field">
                <span>Section Three Title</span>
                <input value={form.sectionThreeTitle} onChange={(event) => handleFieldChange("sectionThreeTitle", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Section Three Paragraphs</span>
                <textarea rows="4" value={form.sectionThreeParagraphsText} onChange={(event) => handleFieldChange("sectionThreeParagraphsText", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Section Three Checklist Title</span>
                <input value={form.sectionThreeChecklistTitle} onChange={(event) => handleFieldChange("sectionThreeChecklistTitle", event.target.value)} />
              </label>
              <label className="admin-blogs__field">
                <span>Section Three Checklist</span>
                <textarea rows="4" value={form.sectionThreeChecklistText} onChange={(event) => handleFieldChange("sectionThreeChecklistText", event.target.value)} />
              </label>
            </div>

            <label className="admin-blogs__field">
              <span>Tags</span>
              <textarea rows="2" value={form.tagsText} onChange={(event) => handleFieldChange("tagsText", event.target.value)} />
            </label>

            <div className="admin-blogs__form-actions">
              <button type="submit" className="admin-blogs__save-button" disabled={isSaving}>
                <Save size={14} />
                <span>{isSaving ? "Saving..." : isCreating ? "Create Post" : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </AdminLayout>
  );
}
