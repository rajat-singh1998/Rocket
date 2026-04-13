import { Facebook, Linkedin, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { footerLinks } from "../../data/homeContent";

const socialLinks = [
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Play },
  { label: "LinkedIn", icon: Linkedin }
];

export default function SiteFooter() {
  return (
    <footer className="bg-white pt-20">
      <div className="page-shell">
        <div className="grid gap-12 border-b border-[#d8ddd5] pb-14 lg:grid-cols-[1.2fr_0.7fr_0.65fr_0.7fr]">
          <div>
            <img src="/images/rocket/logo_rocket.png" alt="Rocket Rubbish Removal" className="h-[94px] w-auto" />
            <p className="mt-6 max-w-[410px] text-[1.05rem] leading-8 text-[#222]">
              UK-Wide Rubbish Clearance Done Right. Fast, Friendly, Eco-Conscious Man & Van Collection.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href="#"
                    aria-label={item.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6cab45] text-white transition hover:bg-brand-green"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[1.25rem] font-semibold text-[#111]">Services</h3>
            <ul className="mt-6 space-y-4 text-[1.08rem] text-[#191919]">
              {footerLinks.services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[1.25rem] font-semibold text-[#111]">Company</h3>
            <ul className="mt-6 space-y-4 text-[1.08rem] text-[#191919]">
              {footerLinks.company.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[1.25rem] font-semibold text-[#111]">Get In Touch</h3>
            <ul className="mt-6 space-y-4 text-[1.08rem] text-[#191919]">
              {footerLinks.contact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-[1rem] text-[#1d1d1d] lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 Rocket Rubbish Removal. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-5">
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



