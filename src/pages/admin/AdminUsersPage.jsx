import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { adminUsers } from "../../data/homeContent";
import "./AdminUsersPage.css";

function StatusPill({ status }) {
  const toneClass = status === "Active" ? "admin-users__status admin-users__status--active" : "admin-users__status admin-users__status--pending";
  return <span className={toneClass}>{status}</span>;
}

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return adminUsers.filter((item) => [item.name, item.email, item.role].some((value) => value.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  return (
    <AdminLayout
      title="User Management"
      description="View team members and account statuses."
      actions={<button className="admin-users__action-button">Add User</button>}
    >
      <section className="admin-users__toolbar">
        <label className="admin-users__search-box">
          <Search size={16} className="admin-users__search-icon" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." className="admin-users__search-input" />
        </label>
      </section>

      <section className="admin-users__table-card">
        <div className="admin-users__table-wrap">
          <table className="admin-users__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => (
                <tr key={item.email}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td><StatusPill status={item.status} /></td>
                  <td><button className="admin-users__table-button">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
