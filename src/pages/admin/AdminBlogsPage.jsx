import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import { adminBlogs } from "../../data/homeContent";
import "./AdminBlogsPage.css";

function statusClass(status) {
  return status === "Published"
    ? "admin-blogs__status admin-blogs__status--published"
    : "admin-blogs__status admin-blogs__status--draft";
}

export default function AdminBlogsPage() {
  const actions = (
    <button type="button" className="admin-blogs__new-button">
      <Plus size={14} />
      <span>New Post</span>
    </button>
  );

  return (
    <AdminLayout title="Blogs Management" actions={actions}>
      <section className="admin-blogs__card">
        <div className="admin-blogs__toolbar">
          <label className="admin-blogs__search">
            <Search size={13} className="admin-blogs__search-icon" />
            <input type="text" placeholder="Search posts..." className="admin-blogs__search-input" />
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
              {adminBlogs.map((item) => (
                <tr key={item.title}>
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
                      <button type="button" className="admin-blogs__icon-button" aria-label="Edit post">
                        <Edit3 size={13} />
                      </button>
                      <button type="button" className="admin-blogs__icon-button" aria-label="Delete post">
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
