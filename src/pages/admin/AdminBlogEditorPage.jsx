import { ArrowLeft, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RichTextLinkEditor from "../../components/admin/RichTextLinkEditor";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders } from "../../utils/adminAuth";
import { friendlyRequestError, prepareImageForUpload, readJsonResponse } from "../../utils/imageUpload";
import { emptyBlogForm, formToPayload, postToForm, slugify } from "./blogPostFormUtils";
import "./AdminBlogsPage.css";

const emptyBlogImageFiles = {
  heroImageFile: null,
  featuredImageFile: null,
  cardImageFile: null
};

function ImageUploadField({ label, currentValue, selectedFile, onFileChange }) {
  return (
    <label className="admin-blogs__field">
      <span>{label}</span>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          void onFileChange(event.target.files?.[0] || null);
          event.target.value = "";
        }}
      />
      {selectedFile ? <small>Selected: {selectedFile.name}. Save changes to apply it.</small> : null}
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

  function handleAddFaq() {
    setForm((current) => ({
      ...current,
      faqItems: [...(current.faqItems || []), { question: "", answer: "" }]
    }));
  }

  function handleFaqChange(index, field, value) {
    setForm((current) => ({
      ...current,
      faqItems: (current.faqItems || []).map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      ))
    }));
  }

  function handleRemoveFaq(index) {
    setForm((current) => ({
      ...current,
      faqItems: (current.faqItems || []).filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  async function handleImageFileChange(field, file) {
    setMessage("");
    setError("");

    if (!file) {
      setImageFiles((current) => ({
        ...current,
        [field]: null
      }));
      return;
    }

    try {
      const optimizedFile = await prepareImageForUpload(file, {
        maxWidth: field === "heroImageFile" ? 1600 : 1800,
        maxHeight: field === "heroImageFile" ? 1000 : 1400,
        quality: field === "heroImageFile" ? 0.72 : 0.78,
        forceOptimize: field === "heroImageFile"
      });

      setImageFiles((current) => ({
        ...current,
        [field]: optimizedFile
      }));
    } catch (imageError) {
      setImageFiles((current) => ({
        ...current,
        [field]: null
      }));
      setError(friendlyRequestError(imageError, "Unable to prepare this image for upload."));
    }
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

      const data = await readJsonResponse(response, "Unable to save blog post.");

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
      setError(friendlyRequestError(saveError, "Unable to save blog post."));
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
              <ImageUploadField
                label="Hero Image"
                currentValue={form.heroImage}
                selectedFile={imageFiles.heroImageFile}
                onFileChange={(file) => handleImageFileChange("heroImageFile", file)}
              />
              <ImageUploadField
                label="Featured Image"
                currentValue={form.featuredImage}
                selectedFile={imageFiles.featuredImageFile}
                onFileChange={(file) => handleImageFileChange("featuredImageFile", file)}
              />
              <ImageUploadField
                label="Card Image"
                currentValue={form.cardImage}
                selectedFile={imageFiles.cardImageFile}
                onFileChange={(file) => handleImageFileChange("cardImageFile", file)}
              />
            </div>

            <label className="admin-blogs__field">
              <span>Excerpt</span>
              <textarea rows="3" value={form.excerpt} onChange={(event) => handleFieldChange("excerpt", event.target.value)} />
            </label>
            <RichTextLinkEditor
              label="Intro"
              value={form.introHtml}
              onChange={(nextValue) => handleFieldChange("introHtml", nextValue)}
              placeholder="Write the opening paragraph and add internal or external links."
              helpText="Select text, then use the link tools to add, edit or remove hyperlinks."
              minHeight={140}
            />

            <RichTextLinkEditor
              label="Post Content"
              value={form.contentHtml}
              onChange={(nextValue) => handleFieldChange("contentHtml", nextValue)}
              placeholder="Add the full blog post content here. You can paste formatted HTML and manage links with the toolbar."
              helpText="Use this single editor for headings, paragraphs, bold text, lists, internal links and external links."
              minHeight={420}
              fixedHeight={500}
            />

            <section className="admin-blogs__faq-manager">
              <div className="admin-blogs__faq-head">
                <div>
                  <h3>Blog FAQs</h3>
                  <p>Add questions and answers that will appear below this blog post content.</p>
                </div>
                <button type="button" className="admin-blogs__add-faq-button" onClick={handleAddFaq}>
                  <Plus size={14} />
                  <span>Add FAQ</span>
                </button>
              </div>

              {form.faqItems?.length ? (
                <div className="admin-blogs__faq-grid">
                  {form.faqItems.map((item, index) => (
                    <div className="admin-blogs__faq-card" key={`faq-${index}`}>
                      <div className="admin-blogs__faq-card-head">
                        <strong>FAQ {index + 1}</strong>
                        <button type="button" onClick={() => handleRemoveFaq(index)} aria-label={`Remove FAQ ${index + 1}`}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <label className="admin-blogs__field">
                        <span>Question</span>
                        <input
                          value={item.question}
                          onChange={(event) => handleFaqChange(index, "question", event.target.value)}
                          placeholder="Enter question"
                        />
                      </label>
                      <label className="admin-blogs__field">
                        <span>Answer</span>
                        <textarea
                          rows="4"
                          value={item.answer}
                          onChange={(event) => handleFaqChange(index, "answer", event.target.value)}
                          placeholder="Enter answer"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-blogs__faq-empty">
                  <p>No FAQs added yet.</p>
                </div>
              )}
            </section>

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
