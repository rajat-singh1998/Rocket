import { Grid2x2, FileText, MapPinned, NotebookText, Mail, Search, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { adminMenu } from "../../data/homeContent";
import { getAdminProfile } from "../../utils/adminAuth";
import "./AdminLayout.css";

const menuIcons = {
  Dashboard: Grid2x2,
  Content: FileText,
  "City Pages": MapPinned,
  Blogs: NotebookText,
  Contacts: Mail,
  Profile: User
};

function menuClass({ isActive }) {
  return `admin-layout__nav-link ${isActive ? "admin-layout__nav-link--active" : ""}`;
}

export default function AdminLayout({ title, description, actions, children }) {
  const adminProfile = getAdminProfile() || {
    name: "Admin User",
    email: "Admin@Rocket.Com"
  };

  return (
    <main className="admin-layout">
      <div className="admin-layout__grid">
        <aside className="admin-layout__sidebar">
          <NavLink to="/admin/dashboard" className="admin-layout__brand">
            <img src="/images/rocket/logo_h.svg" alt="Rocket Rubbish Removal" className="admin-layout__logo" />
            <span className="admin-layout__brand-text">Admin</span>
          </NavLink>

          <nav className="admin-layout__nav">
            {adminMenu.map((item) => {
              const Icon = menuIcons[item.label] || Grid2x2;

              return (
                <NavLink key={item.label} to={item.to} className={menuClass}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <section className="admin-layout__content">
          <header className="admin-layout__topbar">
            <label className="admin-layout__search">
              <Search size={15} className="admin-layout__search-icon" />
              <input type="text" placeholder="Search" className="admin-layout__search-input" />
            </label>

            <div className="admin-layout__profile">
              <img src="/images/rocket/form2.png" alt="Admin User" className="admin-layout__avatar" />
              <div>
                <p className="admin-layout__profile-name">{adminProfile.name}</p>
                <p className="admin-layout__profile-email">{adminProfile.email}</p>
              </div>
            </div>
          </header>

          <div className="admin-layout__page-head">
            <div>
              <h1 className="admin-layout__title">{title}</h1>
              {description ? <p className="admin-layout__description">{description}</p> : null}
            </div>
            {actions ? <div className="admin-layout__actions">{actions}</div> : null}
          </div>

          <div className="admin-layout__body">{children}</div>
        </section>
      </div>
    </main>
  );
}
