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
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="site-footer__title">Company</h3>
            <ul className="site-footer__list">
              {footerLinks.company.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="site-footer__title">Get In Touch</h3>
            <ul className="site-footer__list site-footer__list--contact">
              {footerLinks.contact.map((item, index) => {
                const Icon = contactIcons[index] || MapPin;

                return (
                  <li key={item} className="site-footer__contact-item">
                    <span className="site-footer__contact-icon">
                      <Icon size={14} />
                    </span>
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 Rocket Rubbish Removal. All Rights Reserved.</p>
          <div className="site-footer__legal-links">
            <Link to="/">Terms And Conditions</Link>
            <Link to="/">Privacy</Link>
            <Link to="/">Legal</Link>
            <Link to="/">Licence</Link>
            <Link to="/">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


