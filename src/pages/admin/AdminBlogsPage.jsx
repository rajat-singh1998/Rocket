import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders } from "../../utils/adminAuth";
import { statusClass } from "./blogPostFormUtils";
import "./AdminBlogsPage.css";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/blog-posts"), {
          headers: {
            ...getAdminAuthHeaders()
          }
        });
        const data = await response.json();

        if (!ignore && response.ok && data.ok) {
          setPosts(data.posts || []);
        }
      } catch {
        if (!ignore) {
          setError("Unable to load blog posts.");
        }
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return posts;
    }

    return posts.filter((post) =>
      [post.title, post.category, post.slug, post.author].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [posts, search]);

  async function handleDelete(id) {
    const canDelete = window.confirm("Delete this blog post?");

    if (!canDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(buildApiUrl("/api/admin/blog-posts/" + id), {
        method: "DELETE",
        headers: {
          ...getAdminAuthHeaders()
        }
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to delete blog post.");
      }

      setPosts(data.posts || []);
      setMessage(data.message || "Blog post deleted.");
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete blog post.");
    }
  }

  const actions = (
    <Link to="/admin/blogs/new" className="admin-blogs__new-button">
      <Plus size={14} />
      <span>New Post</span>
    </Link>
  );

  return (
    <AdminLayout title="Blogs Management" actions={actions}>
      {message ? <p className="admin-blogs__message admin-blogs__message--success">{message}</p> : null}
      {error ? <p className="admin-blogs__message admin-blogs__message--error">{error}</p> : null}

      <section className="admin-blogs__card">
        <div className="admin-blogs__toolbar">
          <label className="admin-blogs__search">
            <Search size={13} className="admin-blogs__search-icon" />
            <input
              type="text"
              placeholder="Search posts..."
              className="admin-blogs__search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="admin-blogs__table-wrap">
          <table className="admin-blogs__table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((item) => (
                <tr key={item.id}>
                  <td className="admin-blogs__title-cell">{item.title}</td>
                  <td>
                    <span className="admin-blogs__tag">{item.category}</span>
                  </td>
                  <td>{item.author}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className={statusClass(item.status)}>
                      <span className="admin-blogs__status-dot" />
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-blogs__actions-cell">
                      <Link to={"/admin/blogs/" + item.id} className="admin-blogs__icon-button" aria-label="Edit post">
                        <Edit3 size={13} />
                      </Link>
                      <button type="button" className="admin-blogs__icon-button" aria-label="Delete post" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
