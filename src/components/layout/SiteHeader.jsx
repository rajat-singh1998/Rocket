import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "../../lib/router";

const navLinks = [
  { label: "Our Services", to: "/services" },
  { label: "Blogs", to: "/blog" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Credit Account", to: "/credit-account" }
];

const defaultPhoneLabel = "0800 123 4567";

function forceScrollToTop() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  (document.scrollingElement || root).scrollTop = 0;
  document.body.scrollTop = 0;
  root.style.scrollBehavior = previousScrollBehavior;
}

function buildPhoneHref(value) {
  const phoneNumber = String(value || "").trim();

  if (!phoneNumber) {
    return "tel:08001234567";
  }

  const telValue = phoneNumber.replace(/[^\d+]/g, "");
  return telValue ? `tel:${telValue}` : "tel:08001234567";
}

export default function SiteHeader({ phoneLabel = defaultPhoneLabel, phoneHref }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const headerPhoneLabel = String(phoneLabel || defaultPhoneLabel).trim() || defaultPhoneLabel;
  const headerPhoneHref = phoneHref || buildPhoneHref(headerPhoneLabel);
  const handleNavigationClick = () => {
    forceScrollToTop();
  };

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
        <Link to="/" className="site-header__logo" aria-label="Rocket Rubbish home" onClick={handleNavigationClick}>
          <img src="/images/rocket/logo_h.svg" alt="Rocket Rubbish Removal" />
        </Link>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {navLinks.map((item) => (
            <Link key={item.label} to={item.to} className="site-header__link" onClick={handleNavigationClick}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={headerPhoneHref} className="site-header__contact" aria-label={`Call ${headerPhoneLabel}`}>
          <span className="site-header__contact-icon">
            <img src="/images/rocket/call.svg" alt="" />
          </span>
          <span className="site-header__contact-link">{headerPhoneLabel}</span>
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
              <Link key={item.label} to={item.to} className="site-header__mobile-link" onClick={handleNavigationClick}>
                {item.label}
              </Link>
            ))}
            <a href={headerPhoneHref} className="site-header__mobile-contact" aria-label={`Call ${headerPhoneLabel}`}>
              <span className="site-header__contact-icon">
                <Phone size={16} />
              </span>
              <span>{headerPhoneLabel}</span>
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}


