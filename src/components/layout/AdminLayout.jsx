import { NavLink } from "react-router-dom";
import { adminMenu } from "../../data/homeContent";
import "./AdminLayout.css";

function menuClass({ isActive }) {
  return `admin-layout__nav-link ${isActive ? "admin-layout__nav-link--active" : ""}`;
}

export default function AdminLayout({ title, description, actions, children }) {
  return (
    <main className="admin-layout">
      <div className="admin-layout__grid">
        <aside className="admin-layout__sidebar">
          <NavLink to="/admin/dashboard" className="admin-layout__logo-link">
            <img src="/images/rocket/logo_rocket.png" alt="Rocket Rubbish Removal" className="admin-layout__logo" />
          </NavLink>

          <nav className="admin-layout__nav">
            {adminMenu.map((item) => (
              <NavLink key={item.label} to={item.to} className={menuClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="admin-layout__user-card">
            <p className="admin-layout__user-name">Admin User</p>
            <p className="admin-layout__user-email">admin@rocket.com</p>
          </div>
        </aside>

        <section className="admin-layout__content">
          <header className="admin-layout__header">
            <div>
              <h1 className="admin-layout__title">{title}</h1>
              <p className="admin-layout__description">{description}</p>
            </div>
            {actions ? <div className="admin-layout__actions">{actions}</div> : null}
          </header>

          <div className="admin-layout__body">{children}</div>
        </section>
      </div>
    </main>
  );
}
