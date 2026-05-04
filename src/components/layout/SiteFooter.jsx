import { Facebook, Linkedin, Mail, MapPin, Phone, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { footerLinks } from "../../data/homeContent";
import "./SiteFooter.css";

const contactIcons = [Phone, Mail, MapPin];
const socialLinks = [
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Play },
  { label: "LinkedIn", icon: Linkedin }
];

const serviceLinkMap = {
  "Household Clearance": "/services",
  "Office & Commercial": "/services",
  "Garden Waste": "/services",
  "Bulky Items": "/services",
  "Full House Clearance": "/services"
};

const companyLinkMap = {
  "About Us": "/about-us",
  "How It Works": "/how-it-works",
  Reviews: "/#reviews",
  FAQ: "/faq"
};

const contactLinkMap = [
  { href: "tel:08001234567" },
  { href: "mailto:hello@rocketrubbish.co.uk" },
  { href: "/contact-us", isInternal: true }
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <img src="/images/rocket/logo_h.svg" alt="Rocket Rubbish Removal" className="site-footer__logo" />
            <p className="site-footer__copy">
              UK-Wide Rubbish Clearance Done Right. Fast, Friendly, Eco-Conscious Man & Van Collection.
            </p>
            <div className="site-footer__socials">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a key={item.label} href="#" aria-label={item.label} className="site-footer__social-link">
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="site-footer__title">Services</h3>
            <ul className="site-footer__list">
              {footerLinks.services.map((item) => (
                <li key={item}>
                  <Link to={serviceLinkMap[item] || "/services"} className="site-footer__list-link">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="site-footer__title">Company</h3>
            <ul className="site-footer__list">
              {footerLinks.company.map((item) => (
                <li key={item}>
                  <Link to={companyLinkMap[item] || "/"} className="site-footer__list-link">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="site-footer__title">Get In Touch</h3>
            <ul className="site-footer__list site-footer__list--contact">
              {footerLinks.contact.map((item, index) => {
                const Icon = contactIcons[index] || MapPin;
                const linkConfig = contactLinkMap[index];

                return (
                  <li key={item} className="site-footer__contact-item">
                    <span className="site-footer__contact-icon">
                      <Icon size={14} />
                    </span>
                    {linkConfig?.isInternal ? (
                      <Link to={linkConfig.href} className="site-footer__contact-link">
                        {item}
                      </Link>
                    ) : (
                      <a href={linkConfig?.href} className="site-footer__contact-link">
                        {item}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
<div className="pay_methods">
  <img src="/images/rocket/pay_methods.png" alt="" />
</div>
        <div className="site-footer__bottom">
          <p>© 2026 Rocket Rubbish Removal All rights reserved.</p>
          <div className="site-footer__legal-links">
            <Link to="/terms-and-conditions">Terms And Conditions</Link>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-and-conditions">Legal</Link>
            <Link to="/privacy-policy">Licence</Link>
            <Link to="/blog">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
