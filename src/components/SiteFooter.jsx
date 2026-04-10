import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { footerLinks } from "../data/siteContent";

export default function SiteFooter() {
  return (
    <footer className="bg-[#141b22] py-16 text-slate-300">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d2a21] text-brand-green">
                <span className="text-lg font-bold">R</span>
              </span>
              <div className="leading-none">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">Rocket</p>
                <p className="text-2xl font-semibold text-white">Rubbish</p>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-[1rem] leading-7 text-slate-400">
              Fast, reliable, and eco-friendly rubbish removal across the UK.
            </p>
          </div>

          <div>
            <h3 className="text-[1.35rem] font-semibold text-white">Services</h3>
            <ul className="mt-6 space-y-3 text-[1rem] text-slate-400">
              {footerLinks.services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[1.35rem] font-semibold text-white">Company</h3>
            <ul className="mt-6 space-y-3 text-[1rem] text-slate-400">
              {footerLinks.company.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[1.35rem] font-semibold text-white">Contact</h3>
            <ul className="mt-6 space-y-4 text-[1rem] text-slate-400">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-green" />
                0800 123 4567
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-green" />
                hello@rocketrubbish.co.uk
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand-green" />
                Nationwide, United Kingdom
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          Copyright 2026 Rocket Rubbish. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
