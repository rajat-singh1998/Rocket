import { ArrowRight, Search, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import { coverageStats, popularLocations } from "../../data/homeContent";
import "./LoadSizesPage.css";

const loadSizes = [
  "Mini Load",
  "Small Load",
  "Medium Load",
  "Large Load",
  "Large Plus",
  "X Large Load",
  "X Large Plus",
  "XX Large Load",
  "Luton Van Load"
];

function LoadSizeCard({ label, index }) {
  const scale = 0.7 + index * 0.08;

  return (
    <article className="load-sizes-page__card">
      <div className="load-sizes-page__card-visual">
        <Truck size={52 * scale} strokeWidth={2.2} className="load-sizes-page__card-icon" />
      </div>
      <h3 className="load-sizes-page__card-title">{label}</h3>
      <p className="load-sizes-page__card-text">Flexible fixed pricing based on the amount of vehicle space your clearance needs.</p>
      <a href="https://client-platform.example.com/quote" className="load-sizes-page__card-button">
        Get Quote
        <ArrowRight size={16} />
      </a>
    </article>
  );
}

export default function LoadSizesPage() {
  const [search, setSearch] = useState("");

  const filteredLocations = useMemo(() => {
    return popularLocations.filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()));
  }, [search]);

  return (
    <>
      <SiteHeader />
      <main className="load-sizes-page">
        <section className="load-sizes-page__hero">
          <div className="page-shell load-sizes-page__hero-grid">
            <div>
              <p className="section-eyebrow">Load Size Pricing</p>
              <h1 className="load-sizes-page__hero-title">Choose the right load size for your clearance.</h1>
              <p className="load-sizes-page__hero-text">
                Our prices are based on the amount of van space used, keeping quotes simple, clear, and easy to understand.
              </p>
            </div>
            <div className="load-sizes-page__hero-visual">
              <img src="/images/rocket/service-truck.png" alt="Rocket Rubbish vehicle" className="load-sizes-page__hero-image" />
            </div>
          </div>
        </section>

        <section id="coverage" className="load-sizes-page__coverage">
          <div className="page-shell load-sizes-page__coverage-grid">
            <div>
              <p className="section-eyebrow load-sizes-page__coverage-eyebrow">Our Coverage</p>
              <h2 className="load-sizes-page__coverage-title">
                1,100+ Towns & Cities
                <br />
                Across The UK
              </h2>
              <p className="load-sizes-page__coverage-text">
                From Aberdeen to Penzance, Newcastle to Norwich. If you're in the UK, we are almost certainly covering your area.
              </p>

              <div className="load-sizes-page__search-box">
                <div className="load-sizes-page__search-input-wrap">
                  <Search size={18} className="load-sizes-page__search-icon" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search Your City"
                    className="load-sizes-page__search-input"
                  />
                </div>
                <button type="button" className="load-sizes-page__search-button">
                  Go
                </button>
              </div>

              <div className="load-sizes-page__locations">
                {(filteredLocations.length > 0 ? filteredLocations : popularLocations).map((item) => (
                  <span key={item} className="load-sizes-page__location-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="load-sizes-page__stats-grid">
              {coverageStats.map((item, index) => (
                <article key={item.label} className={`load-sizes-page__stat-card ${index === 2 ? "load-sizes-page__stat-card--wide" : ""}`}>
                  <p className="load-sizes-page__stat-value">{item.value}</p>
                  <h3 className="load-sizes-page__stat-title">{item.label}</h3>
                  <p className="load-sizes-page__stat-text">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="load-sizes-page__pricing">
          <div className="page-shell">
            <div className="load-sizes-page__head">
              <p className="section-eyebrow">Load Sizes</p>
              <h2 className="section-title">Vehicle space options for every job size.</h2>
              <p className="load-sizes-page__head-text">
                Match your waste to the right load size and we will keep the quote fixed and straightforward.
              </p>
            </div>

            <div className="load-sizes-page__cards-grid">
              {loadSizes.map((item, index) => (
                <LoadSizeCard key={item} label={item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <SharedTestimonialsSection />
        <SiteFooter />
      </main>
    </>
  );
}


