import { ChevronDown, Edit2, Eye, EyeOff, Search, Trash2, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { buildApiUrl } from "../../lib/api";
import { getAdminAuthHeaders, logoutAdmin } from "../../utils/adminAuth";
import "./AdminUsersPage.css";

const emptyForm = {
  id: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  status: "Active",
  permissions: []
};

function StatusPill({ status }) {
  const toneClass = status === "Active" ? "admin-users__status admin-users__status--active" : "admin-users__status admin-users__status--pending";
  return <span className={toneClass}>{status}</span>;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionLabels, setPermissionLabels] = useState({});
  const [cityPages, setCityPages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageSearch, setPageSearch] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const editingUser = Boolean(form.id);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(buildApiUrl("/api/admin/users"), {
          headers: getAdminAuthHeaders()
        });
        const data = await response.json();

        if (response.status === 401) {
          logoutAdmin();
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load admin users.");
        }

        setUsers(data.users || []);
        setPermissions((data.permissions || []).filter((permission) => !["users", "city-pages"].includes(permission)));
        setPermissionLabels(data.permissionLabels || {});
        setCityPages(data.cityPages || []);
      } catch (loadError) {
        setError(loadError.message || "Failed to load admin users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    const searchTerm = query.toLowerCase();
    return users.filter((item) => [item.name, item.email, item.role, item.status].some((value) => String(value || "").toLowerCase().includes(searchTerm)));
  }, [query, users]);

  const pageOptions = useMemo(() => {
    const staticPages = permissions.map((permission) => ({
      value: permission,
      label: permissionLabels[permission] || permission,
      type: "Core Page"
    }));
    const cityOptions = cityPages.map((page) => ({
      value: `city:${page.id}`,
      label: page.name,
      type: "City Page"
    }));

    return [...staticPages, ...cityOptions].sort((a, b) => a.label.localeCompare(b.label, "en-GB", { sensitivity: "base" }));
  }, [cityPages, permissionLabels, permissions]);

  const selectedPageOptions = useMemo(() => {
    return form.permissions
      .map((permission) => pageOptions.find((option) => option.value === permission))
      .filter(Boolean);
  }, [form.permissions, pageOptions]);

  const filteredPageOptions = useMemo(() => {
    const searchTerm = pageSearch.trim().toLowerCase();

    return pageOptions.filter((option) => {
      if (form.permissions.includes(option.value)) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      return `${option.label} ${option.type}`.toLowerCase().includes(searchTerm);
    });
  }, [form.permissions, pageOptions, pageSearch]);

  const handleFormChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  };

  const handlePermissionToggle = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission]
    }));
    setMessage("");
    setError("");
  };

  const removePermission = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.filter((item) => item !== permission)
    }));
    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setPageSearch("");
    setSelectorOpen(false);
    setVisiblePasswords({
      password: false,
      confirmPassword: false
    });
    setMessage("");
    setError("");
  };

  const editUser = (user) => {
    setForm({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      status: user.status || "Active",
      permissions: Array.isArray(user.permissions) ? user.permissions.filter((permission) => permission !== "users") : []
    });
    setMessage("");
    setError("");
    setPageSearch("");
    setSelectorOpen(false);
    setVisiblePasswords({
      password: false,
      confirmPassword: false
    });
  };

  const saveUser = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const endpoint = editingUser ? `/api/admin/users/${form.id}` : "/api/admin/users";
      const response = await fetch(buildApiUrl(endpoint), {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders()
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          status: form.status,
                  permissions: form.permissions
        })
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to save admin user.");
      }

      setUsers(data.users || []);
      setForm(emptyForm);
      setMessage(data.message || "Admin user saved successfully.");
    } catch (saveError) {
      setError(saveError.message || "Failed to save admin user.");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user) => {
    if (user.role === "owner") {
      setError("The main admin cannot be deleted.");
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}`), {
        method: "DELETE",
        headers: getAdminAuthHeaders()
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to delete admin user.");
      }

      setUsers(data.users || []);
      if (form.id === user.id) {
        setForm(emptyForm);
      }
      setMessage(data.message || "Admin user deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete admin user.");
    }
  };

  return (
    <AdminLayout
      title="Users"
      description="Create admin users and choose the exact website pages they can edit."
      actions={<button type="button" className="admin-users__action-button" onClick={resetForm}><UserPlus size={15} /> New User</button>}
    >
      <section className="admin-users__form-card">
        <h2 className="admin-users__section-title">{editingUser ? "Edit User Access" : "Create User Access"}</h2>
        {message ? <p className="admin-users__message admin-users__message--success">{message}</p> : null}
        {error ? <p className="admin-users__message admin-users__message--error">{error}</p> : null}

        <form className="admin-users__form" onSubmit={saveUser}>
          <label className="admin-users__field admin-users__field--name">
            <span>Name</span>
            <input value={form.name} onChange={(event) => handleFormChange("name", event.target.value)} placeholder="Editor name" disabled={loading || saving} />
          </label>

          <label className="admin-users__field admin-users__field--email">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => handleFormChange("email", event.target.value)} placeholder="editor@example.com" disabled={loading || saving} />
          </label>

          <label className="admin-users__field admin-users__field--password">
            <span>{editingUser ? "Reset Password" : "Password"}</span>
            <div className="admin-users__password-wrap">
              <input
                type={visiblePasswords.password ? "text" : "password"}
                value={form.password}
                onChange={(event) => handleFormChange("password", event.target.value)}
                placeholder={editingUser ? "Enter new password to reset" : "Set password"}
                disabled={loading || saving}
              />
              <button
                type="button"
                className="admin-users__password-toggle"
                onClick={() => setVisiblePasswords((current) => ({ ...current, password: !current.password }))}
                disabled={loading || saving}
                aria-label={visiblePasswords.password ? "Hide password" : "Show password"}
              >
                {visiblePasswords.password ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="admin-users__field admin-users__field--password">
            <span>{editingUser ? "Confirm Reset Password" : "Confirm Password"}</span>
            <div className="admin-users__password-wrap">
              <input
                type={visiblePasswords.confirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(event) => handleFormChange("confirmPassword", event.target.value)}
                placeholder={editingUser ? "Confirm new password" : "Confirm password"}
                disabled={loading || saving}
              />
              <button
                type="button"
                className="admin-users__password-toggle"
                onClick={() => setVisiblePasswords((current) => ({ ...current, confirmPassword: !current.confirmPassword }))}
                disabled={loading || saving}
                aria-label={visiblePasswords.confirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {visiblePasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {editingUser ? <p className="admin-users__password-note">Leave password fields empty to keep the current password.</p> : null}

          <label className="admin-users__field admin-users__field--status">
            <span>Status</span>
            <select value={form.status} onChange={(event) => handleFormChange("status", event.target.value)} disabled={loading || saving}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <div className="admin-users__permissions">
            <span className="admin-users__permissions-label">Editable Website Pages</span>

            <div className="admin-users__page-selector">
              <button
                type="button"
                className={`admin-users__page-selector-control ${selectorOpen ? "admin-users__page-selector-control--open" : ""}`}
                onClick={() => setSelectorOpen((current) => !current)}
                disabled={loading || saving}
              >
                <span>{selectedPageOptions.length > 0 ? `${selectedPageOptions.length} page${selectedPageOptions.length === 1 ? "" : "s"} selected` : "Search and select editable pages"}</span>
                <ChevronDown size={16} />
              </button>

              {selectedPageOptions.length > 0 ? (
                <div className="admin-users__selected-pages">
                  {selectedPageOptions.map((option) => (
                    <span key={option.value} className="admin-users__selected-chip">
                      {option.label}
                      <button type="button" onClick={() => removePermission(option.value)} disabled={loading || saving} aria-label={`Remove ${option.label}`}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}

              {selectorOpen ? (
                <div className="admin-users__page-selector-menu">
                  <label className="admin-users__page-search">
                    <Search size={15} />
                    <input
                      type="text"
                      value={pageSearch}
                      onChange={(event) => setPageSearch(event.target.value)}
                      placeholder="Search homepage or city page..."
                      autoFocus
                    />
                  </label>

                  <div className="admin-users__page-options">
                    {filteredPageOptions.length > 0 ? (
                      filteredPageOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className="admin-users__page-option"
                          onClick={() => {
                            handlePermissionToggle(option.value);
                            setPageSearch("");
                          }}
                        >
                          <span>{option.label}</span>
                          <small>{option.type}</small>
                        </button>
                      ))
                    ) : (
                      <p className="admin-users__page-empty">No pages found.</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="admin-users__form-actions">
            <button type="submit" className="admin-users__save-button" disabled={saving || loading}>
              {saving ? "Saving..." : editingUser ? "Update User" : "Create User"}
            </button>
            {editingUser ? <button type="button" className="admin-users__cancel-button" onClick={resetForm} disabled={saving}>Cancel</button> : null}
          </div>
        </form>
      </section>

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
                <th>Page Access</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => (
                <tr key={item.id || item.email}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role === "owner" ? "Main Admin" : "Editor"}</td>
                  <td>{item.role === "owner" ? "All pages" : (item.permissions || []).map((permission) => {
                    if (permission.startsWith("city:")) {
                      const page = cityPages.find((cityPage) => permission === `city:${cityPage.id}`);
                      return page?.name || "City Page";
                    }

                    return permissionLabels[permission] || permission;
                  }).join(", ") || "No access"}</td>
                  <td><StatusPill status={item.status} /></td>
                  <td>
                    <div className="admin-users__row-actions">
                      <button type="button" className="admin-users__table-button" onClick={() => editUser(item)} disabled={item.role === "owner"}>
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button type="button" className="admin-users__table-button admin-users__table-button--danger" onClick={() => deleteUser(item)} disabled={item.role === "owner"}>
                        <Trash2 size={14} />
                        Delete
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
