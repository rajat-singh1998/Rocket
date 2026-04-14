import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./SiteHeader.css";

const navLinks = [
  { label: "Our Services", to: "/services" },
  { label: "Cities", to: "/load-sizes#coverage" },
  { label: "Pricing", to: "/load-sizes#pricing" },
  { label: "How It Works", to: "/services#how-it-works" },
  { label: "FAQ", to: "/services#faq" },
  { label: "Credit Account", to: "/credit-account" }
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="site-topbar" />
      <header className="site-header">
        <div className="page-shell site-header__inner">
          <Link to="/" className="site-header__logo" onClick={() => setIsMenuOpen(false)}>
            <img src="/images/rocket/logo_rocket.png" alt="Rocket Rubbish Removal" />
          </Link>

          <nav className="site-header__nav" aria-label="Primary navigation">
            {navLinks.map((item) => (
              <Link key={item.label} to={item.to} className="site-header__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__contact">
            <span className="site-header__contact-icon">
              <Phone size={16} />
            </span>
            <a href="tel:08001234567" className="site-header__contact-link">
              Speak to an Agent
            </a>
          </div>

          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="site-header__menu-button"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="page-shell site-header__mobile-panel">
            <nav className="site-header__mobile-nav">
              {navLinks.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <a href="tel:08001234567" onClick={() => setIsMenuOpen(false)} className="site-header__mobile-contact">
                <span className="site-header__contact-icon">
                  <Phone size={16} />
                </span>
                <span>Speak to an Agent</span>
              </a>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
