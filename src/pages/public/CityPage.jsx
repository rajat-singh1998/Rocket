import { Check, Star, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedFaqSection from "../../components/sections/SharedFaqSection";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import ClearanceServicesSection from "../../components/sections/ClearanceServicesSection";
import { bookingLinks, heroStats } from "../../data/homeContent";
import { buildApiUrl } from "../../lib/api";
import "./CityPage.css";

const actionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];

const defaultSectionVisibility = {
  hero: true,
  services: true,
  sameDay: true,
  waste: true,
  property: true,
  greenBanner: true
};

const fallbackCityPages = {
  london: {
    name: "London",
    sectionVisibility: defaultSectionVisibility,
    heroTitle: "Rubbish Removal In London",
    heroText:
      "Fast, friendly, and fully licensed rubbish collection across London. From single items to full property clearances, our team handles the heavy lifting, loading, and responsible disposal.",
    servicesTitle: "Our Most Popular Waste Collection Services In London",
    highlightsTitle: "Same-Day Rubbish Removal In London",
    sameDayTitle: "Same-Day Rubbish Removal Across London",
    sameDayIntro:
      "Get fast, affordable rubbish removal in London today. We cover homes, offices, shops, and gardens with same-day and next-day slots across the capital.",
    sameDayBullets: [
      "No skip permit needed",
      "No lifting required - we load everything",
      "Flexible load sizes for all property types",
      "Licensed waste disposal at certified recycling centres"
    ],
    sameDayFooter: "Ideal for homes, offices, shops, rental properties, and renovation projects.",
    wasteTitle: "Responsible Waste Disposal & Skip Hire Alternative",
    wasteText:
      "Need fast waste collection without the delays and hassle of skip hire? Our London team offers a quicker, cleaner option for homes and businesses.",
    wasteSubTitle: "The Better Skip Hire Alternative",
    wasteSubText:
      "With labour included, same-day availability, and fixed pricing, you get everything collected in one visit without permits, overfilled skips, or blocked driveways.",
    propertyTitle: "Complete Property Rubbish Clearance",
    propertyText:
      "From lofts and basements to garages and full house clearances, we collect bulky waste, mixed rubbish, furniture, and general junk across London.",
    greenTitle: "Fast & Affordable Junk Removal In London",
    greenSubtitle:
      "Choose the collection type that matches your waste and let our London team handle everything from lifting to licensed disposal.",
    greenFooter:
      "From a single sofa to full van loads, our crews cover North, South, East, and West London with fixed transparent pricing."
  }
};

const highlightItems = ["Fast", "Affordable", "Fully Licensed"];

const greenBannerPills = [
  "Household & Garden Waste",
  "Appliance & Furniture Removal",
  "Office & Shop Clearances",
  "Same-Day Collection"
];

const whatWeTake = [
  "Household Waste, Old Furniture",
  "White Goods & Appliances",
  "Garden Waste, Renovation Debris",
  "Office & Commercial Waste",
  "Sofas, Mattresses & General Clutter"
];

const whatWeDontTake = [
  "Asbestos Sheets & Hazardous Waste",
  "Medical Or Biological Waste",
  "Large Quantities Of Toxic Chemicals",
  "Pressurised Gas Bottles",
  "Items Requiring Specialist Disposal"
];

const compareSection = {
  title: "What Can Our Team Collect?",
  positiveTitle: "What We Take",
  negativeTitle: "What We Don't Take"
};

const mapSection = {
  title: "Rocket Rubbish Near Me",
  text: "See our local service area and collection coverage on the live map below.",
  embedUrl: "https://www.openstreetmap.org/export/embed.html?bbox=-0.563%2C51.261%2C0.280%2C51.686&layer=mapnik&marker=51.5072%2C-0.1276"
};

export default function CityPage() {
  const { slug = "london" } = useParams();
  const [pageData, setPageData] = useState(null);

  const page = useMemo(() => {
    const source = pageData || fallbackCityPages[slug] || fallbackCityPages.london;

    return {
      ...source,
      sectionVisibility: {
        ...defaultSectionVisibility,
        ...(source.sectionVisibility || {})
      }
    };
  }, [pageData, slug]);

  useEffect(() => {
    let ignore = false;

    async function loadCityPage() {
      try {
        const response = await fetch(buildApiUrl(`/api/public/city-pages/${slug}`));
        const data = await response.json();

        if (!ignore && response.ok && data.ok && data.page) {
          setPageData(data.page);
        }
      } catch {
      }
    }

    setPageData(null);
    loadCityPage();

    return () => {
      ignore = true;
    };
  }, [slug]);

  return (
    <>
      <SiteHeader />
      <main className="city-page">
        {page.sectionVisibility.hero ? (
          <section className="city-page__hero" style={{ backgroundImage: `url(/images/rocket/RC_1551.png)` }}>
            <div className="page-shell city-page__hero-inner">
              <div className="city-page__hero-copy">
                <h1 className="city-page__hero-title">{page.heroTitle}</h1>
                <p className="city-page__hero-text">{page.heroText}</p>
                <div className="city-page__hero-stats">
                  {heroStats.map((item) => (
                    <div key={item.label} className="city-page__hero-stat">
                      <div className="city-page__hero-stat-value">
                        {item.star ? <Star size={15} fill="currentColor" className="city-page__hero-stat-star" /> : null}
                        <span>{item.value}</span>
                      </div>
                      <p className="city-page__hero-stat-label">{item.label}</p>
                    </div>
                  ))}
                </div>
                <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions" />
              </div>
            </div>
          </section>
        ) : null}

        <section className="city-page__breadcrumb-wrap">
          <div className="page-shell">
            <p className="city-page__breadcrumb">Home &nbsp;&gt;&nbsp; {page.heroTitle}</p>
          </div>
        </section>

        <section className="city-page__highlights">
          <div className="page-shell">
            <div className="city-page__highlights-panel">
              <h2 className="city-page__highlights-title">{page.highlightsTitle || page.sameDayTitle}</h2>
              <div className="city-page__highlight-grid">
                {highlightItems.map((item) => (
                  <div key={item} className="city-page__highlight-item">
                    <Truck size={24} strokeWidth={1.9} className="city-page__highlight-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {page.sectionVisibility.services ? (
          <ClearanceServicesSection
            title={page.servicesTitle}
            bookingLinks={bookingLinks}
            actionItems={actionItems}
            className="city-page__services"
          />
        ) : null}

        {page.sectionVisibility.sameDay ? (
          <section className="city-page__intro">
            <div className="page-shell">
              <h2 className="city-page__section-title">{page.sameDayTitle}</h2>
              <p className="city-page__text city-page__text--wide">{page.sameDayIntro}</p>
              <div className="city-page__bullet-list">
                {(page.sameDayBullets || []).map((item) => (
                  <p key={item} className="city-page__bullet-item">� {item}</p>
                ))}
              </div>
              <p className="city-page__text city-page__text--compact">{page.sameDayFooter}</p>
            </div>
          </section>
        ) : null}

        {page.sectionVisibility.waste ? (
          <section className="city-page__split city-page__split--feature">
            <div className="page-shell city-page__split-grid">
              <div className="city-page__split-image-wrap">
                <img src="/images/rocket/Rectangle_29.png" alt={page.wasteTitle} className="city-page__split-image" />
              </div>
              <div className="city-page__split-copy">
                <h2 className="city-page__section-title">{page.wasteTitle}</h2>
                <p className="city-page__text">{page.wasteText}</p>
                <h3 className="city-page__split-subtitle">{page.wasteSubTitle}</h3>
                <p className="city-page__text city-page__text--compact">{page.wasteSubText}</p>
                <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions" />
              </div>
            </div>
          </section>
        ) : null}

        {page.sectionVisibility.property ? (
          <section className="city-page__split city-page__split--reverse">
            <div className="page-shell city-page__split-grid city-page__split-grid--reverse">
              <div className="city-page__split-copy">
                <h2 className="city-page__section-title">{page.propertyTitle}</h2>
                <p className="city-page__text">{page.propertyText}</p>
                <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions" />
              </div>
              <div className="city-page__split-image-wrap">
                <img src="/images/rocket/quote-photo.jpg" alt={page.propertyTitle} className="city-page__split-image" />
              </div>
            </div>
          </section>
        ) : null}

        {page.sectionVisibility.greenBanner ? (
          <section className="city-page__green-banner">
            <div className="page-shell city-page__green-banner-inner">
              <h2 className="city-page__green-banner-title">{page.greenTitle}</h2>
              <p className="city-page__green-banner-text">{page.greenSubtitle}</p>
              <div className="city-page__pill-row">
                {greenBannerPills.map((item) => (
                  <span key={item} className="city-page__pill">{item}</span>
                ))}
              </div>
              <p className="city-page__green-banner-footer">{page.greenFooter}</p>
            </div>
          </section>
        ) : null}

        <section className="city-page__compare">
          <div className="page-shell">
            <div className="city-page__head city-page__head--centered">
              <h2 className="city-page__section-title">{compareSection.title}</h2>
            </div>

            <div className="city-page__compare-grid">
              <article className="city-page__compare-card city-page__compare-card--positive">
                <h3 className="city-page__compare-title">{compareSection.positiveTitle}</h3>
                <div className="city-page__compare-list">
                  {whatWeTake.map((item) => (
                    <div key={item} className="city-page__compare-item city-page__compare-item--positive">
                      <Check size={15} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="city-page__compare-card city-page__compare-card--negative">
                <h3 className="city-page__compare-title">{compareSection.negativeTitle}</h3>
                <div className="city-page__compare-list">
                  {whatWeDontTake.map((item) => (
                    <div key={item} className="city-page__compare-item city-page__compare-item--negative">
                      <X size={15} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions city-page__actions--centered" />
          </div>
        </section>

        <section className="city-page__map">
          <div className="page-shell">
            <div className="city-page__head">
              <h2 className="city-page__section-title">{mapSection.title}</h2>
              <p className="city-page__text">{mapSection.text}</p>
            </div>
            <div className="city-page__map-box">
              <iframe
                src={mapSection.embedUrl}
                title={`Rocket Rubbish map for ${page.name || slug}`}
                className="city-page__map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="city-page__map-card">
                <strong>Rocket Rubbish</strong>
                <span>Head Office - {page.name || slug}</span>
                <small>4.8 ? (1024)</small>
              </div>
            </div>
          </div>
        </section>

        <SharedTestimonialsSection />
        <SharedFaqSection />

        <section className="city-page__bottom-cta">
          <div className="page-shell city-page__bottom-cta-inner">
            <h2 className="city-page__bottom-title">Ready To Clear Your Space?</h2>
            <p className="city-page__bottom-text">Book your trusted rubbish clearance today and let our professionals handle the heavy lifting.</p>
            <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions city-page__actions--centered" />
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}





