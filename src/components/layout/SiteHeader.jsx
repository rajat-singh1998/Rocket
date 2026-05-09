import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SiteHeader.css";

const navLinks = [
  { label: "Our Services", to: "/services" },
  { label: "Cities", to: "/cities/london" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "FAQ", to: "/faq" },
  { label: "Credit Account", to: "/credit-account" }
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 980) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="page-shell site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Rocket Rubbish home">
          <img src="/images/rocket/logo_h.svg" alt="Rocket Rubbish Removal" />
        </Link>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {navLinks.map((item) => (
            <Link key={item.label} to={item.to} className="site-header__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <a href="tel:08001234567" className="site-header__contact" aria-label="Call 0800 123 4567">
          <span className="site-header__contact-icon">
            <img src="/images/rocket/call.svg" alt="" />
          </span>
          <span className="site-header__contact-link">0800 123 4567</span>
        </a>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
          className="site-header__menu-button"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="page-shell site-header__mobile-panel">
          <nav className="site-header__mobile-nav" aria-label="Mobile navigation">
            {navLinks.map((item) => (
              <Link key={item.label} to={item.to} className="site-header__mobile-link">
                {item.label}
              </Link>
            ))}
            <a href="tel:08001234567" className="site-header__mobile-contact">
              <span className="site-header__contact-icon">
                <Phone size={16} />
              </span>
              <span>0800 123 4567</span>
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

