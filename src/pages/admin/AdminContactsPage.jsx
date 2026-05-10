import { Eye, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders } from "../../utils/adminAuth";
import "./AdminContactsPage.css";

function statusClass(status) {
  return status === "Helped" ? "admin-contacts__status admin-contacts__status--helped" : "admin-contacts__status admin-contacts__status--new";
}

function formatPreview(value) {
  return String(value || "").replaceAll(" ? ", " | ").replaceAll(" � ", " | ");
}
export default function AdminContactsPage() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInquiries() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/contact-inquiries"), {
          headers: {
            ...getAdminAuthHeaders()
          }
        });
        const data = await response.json();

        if (!ignore && response.ok && data.ok) {
          setInquiries(data.inquiries || []);
        }
      } catch {
        if (!ignore) {
          setError("Unable to load contact inquiries.");
        }
      }
    }

    loadInquiries();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredInquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return inquiries;
    }

    return inquiries.filter((item) =>
      [item.name, item.email, formatPreview(item.messagePreview), item.date, item.status, item.source].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [inquiries, search]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this contact inquiry?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(buildApiUrl("/api/admin/contact-inquiries/" + id), {
        method: "DELETE",
        headers: {
          ...getAdminAuthHeaders()
        }
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to delete inquiry.");
      }

      setInquiries(data.inquiries || []);
      setMessage(data.message || "Contact inquiry deleted.");
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete inquiry.");
    }
  }

  async function handleView(inquiry) {
    window.alert([`Name: ${inquiry.name}`, `Email: ${inquiry.email}`, `Date: ${inquiry.date}`, `Source: ${inquiry.source || "Website"}`, "", inquiry.message].join("\n"));

    if (inquiry.status === "Helped") {
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/api/admin/contact-inquiries/" + inquiry.id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders()
        },
        body: JSON.stringify({ status: "Helped" })
      });
      const data = await response.json();

      if (response.ok && data.ok) {
        setInquiries(data.inquiries || []);
      }
    } catch {
    }
  }

  return (
    <AdminLayout title="Contact Inquiries">
      {message ? <p className="admin-contacts__message admin-contacts__message--success">{message}</p> : null}
      {error ? <p className="admin-contacts__message admin-contacts__message--error">{error}</p> : null}

      <section className="admin-contacts__card">
        <div className="admin-contacts__toolbar">
          <label className="admin-contacts__search">
            <Search size={13} className="admin-contacts__search-icon" />
            <input
              type="text"
              placeholder="Search messages..."
              className="admin-contacts__search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="admin-contacts__table-wrap">
          <table className="admin-contacts__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message Preview</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((item) => (
                  <tr key={item.id}>
                    <td className="admin-contacts__name-cell">{item.name}</td>
                    <td>{item.email}</td>
                    <td className="admin-contacts__preview-cell">{formatPreview(item.messagePreview)}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className={statusClass(item.status)}>{item.status}</span>
                    </td>
                    <td>
                      <div className="admin-contacts__actions-cell">
                        <button type="button" className="admin-contacts__icon-button" aria-label="View inquiry" onClick={() => handleView(item)}>
                          <Eye size={13} />
                        </button>
                        <button type="button" className="admin-contacts__icon-button" aria-label="Delete inquiry" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-contacts__empty-cell">No contact inquiries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}



