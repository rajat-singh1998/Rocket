import { Check, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedFaqSection from "../../components/sections/SharedFaqSection";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import ClearanceServicesSection from "../../components/sections/ClearanceServicesSection";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import { bookingLinks, heroStats } from "../../data/homeContent";
import { buildApiUrl } from "../../lib/api";
import "./CityPage.css";

const actionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];
const bottomActionItems = [
  { key: "phone", iconImage: "/images/rocket/callg.svg" },
  { key: "whatsapp", iconImage: "/images/rocket/whatsapp-fillg.svg" },
  { key: "bookNow", iconImage: "/images/rocket/calenderg.svg" }
];
const defaultSectionVisibility = {
  hero: true,
  services: true,
  sameDay: true,
  waste: true,
  property: true,
  greenBanner: true
};

const defaultCitySectionImages = {
  heroImage: '/images/rocket/RC_1551.png',
  wasteImage: '/images/rocket/rc_29.png',
  propertyImage: '/images/rocket/quote-photo.jpg'
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
      "Ethical Waste Disposal is at the core of Rocket Rubbish. Once your waste is loaded, we transport it directly to licensed commercial recycling facilities in London, maximizing diversion rates away from landfills.",
    wasteSubTitle: "The Better Skip Hire Alternative",
    wasteSubText:
      "Don't want an ugly skip sitting on your driveway for two weeks? Avoid paying for expensive London council skip permits and parking suspensions. Our Skip Hire alternative means we arrive, load the van, and take it away on the exact same day. You only pay for the space you use.",
    propertyTitle: "Complete Property Rubbish Clearance",
    propertyText:
      "Dealing with an end-of-tenancy, a bereavement, or preparing a house for sale in London? Our comprehensive Rubbish Clearance service takes care of it all. We systematically clear out single rooms, gardens, lofts, basements, or entire commercial offices with absolute discretion and speed. Choose Rocket Rubbish for a clean, clear space.",
    greenTitle: "Fast & Affordable Junk Removal In London",
    greenSubtitle:
      "Need quick junk removal in London? Our team clears unwanted items from homes, offices, gardens, garages and rental properties—fast, professional, and fully licensed.",
    greenFooter:
      "Every job includes labour, loading, waste disposal, and responsible recycling. A simple, same-day rubbish removal solution—no skip needed."
  }
};

const highlightItems = [
  { label: "Fast", iconImage: "/images/rocket/Vector1.svg" },
  { label: "Affordable", iconImage: "/images/rocket/Vector2.svg" },
  { label: "Fully Licensed", iconImage: "/images/rocket/clarity_license-solid.svg" }
];

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

const cityFaqs = [
  {
    question: "What Areas In London Do You Cover?",
    answer: "We provide comprehensive rubbish removal and waste collection across all London boroughs, major neighbourhoods, and nearby districts so local teams can reach you quickly."
  },
  {
    question: "What Can Be Collected With Your Service?",
    answer: "We collect household junk, furniture, appliances, renovation waste, office clearance items, garden waste, and most general non-hazardous rubbish."
  },
  {
    question: "What Is Your Rubbish Clearance Service?",
    answer: "It is a full man-and-van collection service where our team loads, removes, and disposes of your waste responsibly without you needing a skip."
  },
  {
    question: "Are You A Fully Licensed Waste Carrier?",
    answer: "Yes. Rocket Rubbish operates as a licensed waste carrier and uses approved recycling and disposal facilities for collected waste."
  },
  {
    question: "Do I Need To Be At Home During The Waste Collection In London?",
    answer: "In most cases yes, or you can arrange clear access and give us instructions in advance so the collection can be completed smoothly."
  },
  {
    question: "How Much Does Rubbish Removal Cost In London?",
    answer: "Pricing depends on load size, access, and the type of waste. We keep it transparent and confirm the quote before collection starts."
  },
  {
    question: "How Quickly Can You Clear My Rubbish?",
    answer: "We offer fast booking slots and same-day availability on many London routes, depending on location and team capacity."
  }
];

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
          <section className="city-page__hero" style={{ backgroundImage: `url(${page.heroImage || defaultCitySectionImages.heroImage})` }}>
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
                  <div key={item.label} className="city-page__highlight-item">
                    <img src={item.iconImage} alt="" className="city-page__highlight-icon-image" />
                    <span>{item.label}</span>
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
                  <p key={item} className="city-page__bullet-item"> {item}</p>
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
                <img src={page.wasteImage || defaultCitySectionImages.wasteImage} alt={page.wasteTitle} className="city-page__split-image" />
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
<h2 className="city-page__section-title city-page__section-title--split">
                  <span>Complete Property</span>
                  <span className="city-page__section-title-accent">Rubbish Clearance</span>
                </h2>
                <p className="city-page__text">{page.propertyText}</p>
                <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions" />
              </div>
              <div className="city-page__split-image-wrap">
                <img src={page.propertyImage || defaultCitySectionImages.propertyImage} alt={page.propertyTitle} className="city-page__split-image" />
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

            <ActionButtonsRow items={bottomActionItems} bookingLinks={bookingLinks} className="city-page__actions city-page__actions--centered" />
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
        <SharedFaqSection items={cityFaqs} defaultOpenIndex={0} leftColumnCount={3} />

        <section className="city-page__bottom-cta">
          <div className="page-shell city-page__bottom-cta-inner">
            <h2 className="city-page__bottom-title">Ready To Clear Your Space?</h2>
            <p className="city-page__bottom-text">Book your trusted rubbish clearance today and let our professionals handle the heavy lifting.</p>
            <ActionButtonsRow items={bottomActionItems} bookingLinks={bookingLinks} className="city-page__actions city-page__actions--centered" />
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}














