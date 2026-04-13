import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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
      <div className="h-[7px] w-full bg-[#262323]" />
      <header className="border-b border-[#edf1ea] bg-white">
        <div className="page-shell flex items-center justify-between gap-6 py-5 lg:py-6">
          <Link to="/" className="shrink-0" onClick={() => setIsMenuOpen(false)}>
            <img src="/images/rocket/logo_rocket.png" alt="Rocket Rubbish Removal" className="h-[56px] w-auto sm:h-[66px]" />
          </Link>

          <nav className="hidden items-center gap-8 text-[0.92rem] font-medium text-[#171717] xl:flex">
            {navLinks.map((item) => (
              <Link key={item.label} to={item.to} className="transition hover:text-brand-green">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6cab45] text-white">
              <Phone className="h-4 w-4" />
            </div>
            <a href="tel:08001234567" className="text-[0.92rem] font-medium text-[#171717] transition hover:text-brand-green">
              Speak to an Agent
            </a>
          </div>

          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e1d2] text-[#171717] xl:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="page-shell border-t border-[#edf1ea] py-4 xl:hidden">
            <nav className="flex flex-col gap-4 text-[1rem] font-medium text-[#171717]">
              {navLinks.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <a href="tel:08001234567" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center gap-3 pt-2 font-medium text-[#171717]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6cab45] text-white">
                  <Phone className="h-4 w-4" />
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
