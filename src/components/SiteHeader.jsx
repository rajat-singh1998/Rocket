import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { bookingLinks, navigation } from "../data/siteContent";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf5e5] text-brand-green shadow-sm">
        <span className="text-lg font-bold">R</span>
      </span>
      <div className="leading-none">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">Rocket</p>
        <p className="text-xl font-semibold text-brand-dark">Rubbish</p>
      </div>
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#edf1ea] bg-white/95 backdrop-blur">
      <div className="container-shell flex min-h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-9 text-[15px] font-medium text-slate-500 lg:flex">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-brand-dark">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:08001234567"
            className="hidden items-center gap-2 text-[15px] font-medium text-slate-500 xl:inline-flex"
          >
            <Phone className="h-4 w-4" />
            0800 123 4567
          </a>
          <Link
            to={bookingLinks.creditAccount}
            className="hidden rounded-full border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green transition hover:bg-[#f1f8ee] md:inline-flex"
          >
            Credit Account
          </Link>
          <a
            href={bookingLinks.bookNow}
            className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,143,22,0.18)] transition hover:bg-[#267810]"
          >
            Contact Us
          </a>
        </div>
      </div>
    </header>
  );
}
