import { ChevronDown, Grid2x2, FileText, LogOut, MapPinned, NotebookText, Mail, Search, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { adminMenu } from "../../data/homeContent";
import { appendAssetVersion, resolveAssetUrl } from "../../lib/api";
import { ADMIN_PROFILE_UPDATED_EVENT, getAdminProfile, hasAdminPermission, logoutAdmin } from "../../utils/adminAuth";
import "./AdminLayout.css";

const fallbackAdminAvatar = "/images/rocket/form2.png";

const menuIcons = {
  Dashboard: Grid2x2,
  Content: FileText,
  SEO: FileText,
  "City Pages": MapPinned,
  Blogs: NotebookText,
  Contacts: Mail,
  Users,
  Profile: User
};

function menuClass({ isActive }) {
  return `admin-layout__nav-link ${isActive ? "admin-layout__nav-link--active" : ""}`;
}

export default function AdminLayout({ title, description, actions, children }) {
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(() => getAdminProfile() || {
    name: "Admin User",
    email: "Admin@Rocket.Com",
    avatar: fallbackAdminAvatar
  });
  const adminAvatarSrc = appendAssetVersion(resolveAssetUrl(adminProfile.avatar) || fallbackAdminAvatar, adminProfile.updatedAt || "");

  const handleAvatarError = (event) => {
    if (event.currentTarget.src.endsWith(fallbackAdminAvatar)) {
      return;
    }

    event.currentTarget.src = fallbackAdminAvatar;
  };

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      setAdminProfile(event.detail || getAdminProfile() || {
        name: "Admin User",
        email: "Admin@Rocket.Com",
        avatar: fallbackAdminAvatar
      });
    };
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener(ADMIN_PROFILE_UPDATED_EVENT, handleProfileUpdate);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener(ADMIN_PROFILE_UPDATED_EVENT, handleProfileUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
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
            {adminMenu.filter((item) => !item.permission || hasAdminPermission(item.permission)).map((item) => {
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

            <div className="admin-layout__profile-menu" ref={profileMenuRef}>
              <button
                type="button"
                className={`admin-layout__profile ${profileMenuOpen ? "admin-layout__profile--open" : ""}`}
                onClick={() => setProfileMenuOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <img
                  src={adminAvatarSrc || fallbackAdminAvatar}
                  alt={adminProfile.name || "Admin User"}
                  className="admin-layout__avatar"
                  onError={handleAvatarError}
                />
                <div>
                  <p className="admin-layout__profile-name">{adminProfile.name}</p>
                  <p className="admin-layout__profile-email">{adminProfile.email}</p>
                </div>
                <ChevronDown size={14} className="admin-layout__profile-chevron" />
              </button>

              {profileMenuOpen ? (
                <div className="admin-layout__profile-dropdown" role="menu">
                  <NavLink to="/admin/profile" className="admin-layout__profile-dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                    <User size={15} />
                    <span>Profile</span>
                  </NavLink>
                  <button type="button" className="admin-layout__profile-dropdown-item admin-layout__profile-dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : null}
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
