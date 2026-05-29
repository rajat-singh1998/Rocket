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
import { clearanceServiceCards } from "../../data/clearanceServiceCards";
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
  heroImage: '/images/rocket/generic-uk-residential-banner.jpg',
  wasteImage: '/images/rocket/rc_29.jpg',
  propertyBackgroundImage: '/images/rocket/RC_124.jpg'
};

const fallbackCityPages = {
  london: {
    name: "London",
    slug: "london",
    sectionVisibility: defaultSectionVisibility,
    heroTitle: "Rubbish Removal In London",
    heroSubheadline: "Fast, Affordable & Fully Licensed Rubbish Removal Across London, Available Today",
    heroText:
      "London's most trusted rubbish removal and waste collection service, same-day, fully licensed, and ready right now. From a single bulky item to a complete property clearance, Rocket Rubbish handles all the heavy lifting, loading, and responsible waste disposal so you never have to lift a finger.",
    heroImage: "/images/rocket/generic-uk-residential-banner.jpg",
    heroAlt: "Rocket Rubbish van loaded with household waste for removal in London",
    servicesTitle: "Our Most Popular Waste Collection Services In London",
    servicesText:
      "Choose the right load size for your London rubbish removal job, from a Mini Load for a few bulky items to an XX-Large full property clearance. Every option includes labour, loading, licensed waste collection and responsible waste disposal, giving you a faster, cleaner alternative to skip hire across London.",
    highlightsTitle: "Same-Day Rubbish Removal In London",
    sameDayTitle: "Same-Day Rubbish Removal Across London",
    sameDayIntro:
      "Need rubbish removal in London today? Rocket Rubbish provides same-day and next-day waste collection across every London borough, from Croydon, Bromley, and Lewisham in the south, to Barnet, Haringey, and Enfield in the north. Whether you are clearing out a kitchen, a loft, a garden, an office, or an entire house, our professional team arrives on time, works fast, and leaves your property completely clear.",
    sameDayDetails:
      "Our rubbish clearance service is entirely hands-off for you. We assess the load, quote fairly for the space your waste takes up, then carry everything out to our licensed vehicles and straight to certified recycling facilities. No skips sitting on your driveway. No council permits to chase. No mess left behind, ever.",
    sameDayBullets: [
      "No skip permit needed, we come directly to you",
      "No heavy lifting required, our team loads everything from any room",
      "Flexible load sizes from Mini Load to XX-Large",
      "Licensed waste disposal at certified commercial recycling centres",
      "Same-day and next-day slots available across all London postcodes"
    ],
    sameDayFooter: "Ideal for homes, offices, shops, rental properties, and renovation projects.",
    wasteTitle: "Responsible Waste Disposal & Skip Hire Alternative",
    wasteText:
      "Ethical waste disposal is at the core of everything Rocket Rubbish does. Every load we collect is transported directly to licensed commercial recycling facilities across London, where our 95% landfill-diversion rate ensures your rubbish is handled responsibly and legally. After every collection you receive a digital Waste Transfer Note as proof of fully compliant waste disposal.",
    wasteImage: "/images/rocket/rc_29.jpg",
    wasteAlt: "Rocket Rubbish team carrying out same-day rubbish clearance in London",
    wasteSubTitle: "The Smarter Skip Hire Alternative In London",
    wasteSubText:
      "Tired of paying for expensive London council skip hire permits, waiting days for a delivery slot, and doing all the heavy lifting yourself? In central London boroughs like Westminster, Camden, and Islington, skip hire permits alone can cost up to ?78 before you have even paid for the skip itself. Add narrow streets, residents' parking zones, and congestion charges, and skip hire in London becomes a genuine headache. Our skip hire alternative is faster, cheaper, and completely hassle-free. We arrive at your chosen time, load everything from wherever your waste is stored, including inside the property, and take it all away the same day. You pay only for the volume of rubbish you actually have, with no permit fees, no overage charges, and no risk of neighbours filling your skip overnight. It is the smarter way to manage waste disposal in London.",
    propertyTitle: "Complete Property Rubbish Clearance In London",
    propertyText:
      "Facing an end-of-tenancy, a bereavement, or preparing a London property for sale? Our comprehensive rubbish clearance service handles everything from start to finish. We systematically clear single rooms, lofts, basements, garages, gardens, and entire commercial offices, with absolute discretion, speed, and care at every stage.",
    propertyDetails:
      "Our professional clearance teams are fully trained and operate with sensitivity in all circumstances. From broken furniture and old white goods to accumulated junk removal spanning years of storage, nothing is too large, too heavy, or too complicated. We manage the complete waste collection and disposal process, leaving you with a genuinely clean, cleared space and complete peace of mind.",
    propertyLayout: "background",
    propertyBackgroundImage: "/images/rocket/RC_124.jpg",
    propertyAlt: "Rocket Rubbish team carrying furniture from a London property during clearance",
    greenTitle: "Fast & Affordable Junk Removal In London",
    greenSubtitle:
      "Need quick junk removal in London? Our team clears unwanted items from homes, offices, gardens, garages and rental properties, fast, professional, and fully licensed.",
    greenFooter:
      "Every job includes labour, loading, waste disposal, and responsible recycling. A simple, same-day rubbish removal solution with no skip hire headaches and no wasted time.",
    compareTitle: "What Our Waste Collection Service Covers In London",
    compareText:
      "Our waste collection service accepts the vast majority of household and commercial items, including the bulky pieces that council collections routinely turn away. Rocket Rubbish is London's go-to solution for junk removal that actually works, without the complications of skip hire or the frustration of unpredictable council booking systems.",
    comparePositiveTitle: "Items we collect:",
    compareNegativeTitle: "Items requiring specialist disposal (not collected):",
    comparePositiveItems: [
      "Household furniture, sofas, beds, wardrobes, tables, chairs",
      "White goods and kitchen appliances",
      "Mattresses (single, double, and king-size)",
      "Garden waste, soil, green cuttings, and branches",
      "Builders' rubble and renovation debris",
      "Office clearance items, desks, chairs, filing cabinets, IT equipment",
      "Sofas, mattresses, and general household clutter",
      "Black bags and mixed household waste of all volumes"
    ],
    compareNegativeItems: [
      "Asbestos or asbestos-containing materials",
      "Clinical or medical waste",
      "Paint, solvents, and chemicals",
      "Gas canisters and pressurised containers",
      "Tyres"
    ],
    compareSubTitle: "Licensed Waste Disposal You Can Trust",
    compareSubText:
      "Every rubbish removal and waste collection job carried out by Rocket Rubbish is backed by a current Environment Agency Waste Carrier Licence, a legal requirement for any business transporting waste in the UK. Using an unlicensed operator can result in fly-tipping charges against you as the property owner, even if someone else dumped the waste. With Rocket Rubbish, your waste disposal is always legal, traceable, and environmentally responsible.",
    compareFooter:
      "If you are unsure whether we can take a specific item, just call us, we will always advise honestly and promptly.",
    mapTitle: "Areas Covered Across London",
    mapText:
      "We provide rubbish removal, waste collection, and rubbish clearance across all 32 London boroughs and the City of London, including Westminster, Camden, Islington, Hackney, Tower Hamlets, Southwark, Lambeth, Wandsworth, Hammersmith & Fulham, Kensington & Chelsea, Ealing, Hounslow, Richmond, Kingston, Merton, Sutton, Croydon, Bromley, Lewisham, Greenwich, Bexley, Havering, Barking & Dagenham, Redbridge, Newham, Waltham Forest, Haringey, Enfield, Barnet, Harrow, Hillingdon, and Brent.",
    faqEyebrow: "Got Questions?",
    faqTitle: "Frequently Asked Questions About Rubbish Removal In London",
    faqDescription:
      "Everything you need to know about our rubbish removal, rubbish clearance, waste collection, and junk removal service in London.",
    bottomTitle: "Ready To Clear Your Space? Book Rubbish Removal In London Today",
    bottomText:
      "Don't let unwanted rubbish take up your time, your space, or your peace of mind. Rocket Rubbish delivers fast, affordable, and eco-conscious waste collection and junk removal across every London postcode, with same-day availability, no skip permit headaches, and a 95% landfill-diversion guarantee. Call us, WhatsApp us, or book online and we will take care of everything."
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
  text: "See our local service area and collection coverage on the live map below."
};

function buildMapEmbedUrl(lat, lon) {
  const latitude = Number(lat);
  const longitude = Number(lon);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return "";
  }

  const latPadding = 0.12;
  const lonPadding = 0.18;
  const bbox = [
    longitude - lonPadding,
    latitude - latPadding,
    longitude + lonPadding,
    latitude + latPadding
  ].join(",");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
}

function upsertMetaTag(attributeName, attributeValue, content) {
  if (!content) {
    return;
  }

  let tag = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonicalLink(href) {
  if (!href) {
    return;
  }

  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function upsertJsonLdScript(id, json) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(json);
}

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
  const [mapLocation, setMapLocation] = useState(null);

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

  const faqItems = useMemo(() => {
    if (Array.isArray(page?.faqItems) && page.faqItems.length > 0) {
      return page.faqItems;
    }

    return cityFaqs;
  }, [page]);

  const cityServiceCards = useMemo(() => {
    const locationLabel = page?.name || slug;
    const altMap = {
      "Mini Load": `Mini load rubbish removal ${locationLabel}, 1 cubic yard waste collection`,
      "Small Load": `Small load rubbish removal ${locationLabel}, 2 cubic yard waste collection`,
      "Medium Load": `Medium load rubbish removal ${locationLabel}, 4 cubic yard waste collection`,
      "Large": `Large load rubbish removal ${locationLabel}, 7 cubic yard waste collection`,
      "X-Large": `X-Large rubbish removal ${locationLabel}, 10 cubic yard waste collection`,
      "XX-Large": `XX-Large rubbish removal ${locationLabel}, 14 cubic yard waste collection`
    };

    return clearanceServiceCards.map((card) => ({
      ...card,
      alt: altMap[card.title] || `${card.title} rubbish removal ${locationLabel}`
    }));
  }, [page?.name, slug]);

  const comparePositiveTitle = page.comparePositiveTitle || compareSection.positiveTitle;
  const compareNegativeTitle = page.compareNegativeTitle || compareSection.negativeTitle;
  const comparePositiveItems = Array.isArray(page.comparePositiveItems) && page.comparePositiveItems.length > 0
    ? page.comparePositiveItems
    : whatWeTake;
  const compareNegativeItems = Array.isArray(page.compareNegativeItems) && page.compareNegativeItems.length > 0
    ? page.compareNegativeItems
    : whatWeDontTake;

  const propertyTitle = page.propertyTitle || "Complete Property Rubbish Clearance";
  const propertyTitlePrefix = propertyTitle.includes("Rubbish Clearance")
    ? propertyTitle.split("Rubbish Clearance")[0].trim()
    : propertyTitle;
  const propertyTitleAccent = propertyTitle.includes("Rubbish Clearance")
    ? propertyTitle.slice(propertyTitle.indexOf("Rubbish Clearance")).trim()
    : "";
  const propertyBackgroundImage = page.propertyBackgroundImage || defaultCitySectionImages.propertyBackgroundImage;

  const mapEmbedUrl = useMemo(() => {
    return mapLocation ? buildMapEmbedUrl(mapLocation.lat, mapLocation.lon) : "";
  }, [mapLocation]);

  const bottomCta = useMemo(() => {
    const rawTitle = page.bottomTitle || "Ready To Clear Your Space?";
    if (page.bottomEyebrow) {
      return {
        eyebrow: page.bottomEyebrow,
        title: rawTitle
      };
    }

    const splitMatch = rawTitle.match(/^(.+?\?)\s*(.+)$/);
    if (splitMatch) {
      return {
        eyebrow: splitMatch[1],
        title: splitMatch[2]
      };
    }

    return {
      eyebrow: "",
      title: rawTitle
    };
  }, [page.bottomEyebrow, page.bottomTitle]);

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

  useEffect(() => {
    let ignore = false;

    async function loadMapLocation() {
      const locationName = page?.name || slug;

      try {
        const query = encodeURIComponent(`${locationName}, United Kingdom`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`);
        const data = await response.json();
        const result = Array.isArray(data) ? data[0] : null;

        if (!ignore && result?.lat && result?.lon) {
          setMapLocation({
            lat: Number(result.lat),
            lon: Number(result.lon),
            label: locationName
          });
          return;
        }
      } catch {
      }

      if (!ignore) {
        setMapLocation({
          lat: 51.5072,
          lon: -0.1276,
          label: page?.name || slug
        });
      }
    }

    setMapLocation(null);
    loadMapLocation();

    return () => {
      ignore = true;
    };
  }, [page?.name, slug]);

  useEffect(() => {
    if (!page) {
      return;
    }

    const title = page.metaTitle || page.heroTitle || "Rocket Rubbish";
    const description = page.metaDescription || page.heroText || "";
    const canonicalPath = page.canonicalPath || `/cities/${slug}`;
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;
    const ogImage = page.ogImage || page.heroImage || defaultCitySectionImages.heroImage;

    document.title = title;
    upsertMetaTag("name", "description", description);
    upsertMetaTag("property", "og:title", page.ogTitle || title);
    upsertMetaTag("property", "og:description", page.ogDescription || description);
    upsertMetaTag("property", "og:image", ogImage);
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertCanonicalLink(canonicalUrl);
    upsertJsonLdScript("city-page-schema", {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.metaTitle || page.heroTitle,
      description,
      areaServed: page.name,
      provider: {
        "@type": "Organization",
        name: "Rocket Rubbish"
      },
      serviceType: [
        "Rubbish Removal",
        "Rubbish Clearance",
        "Waste Collection",
        "Waste Disposal",
        "Junk Removal",
        "Skip Hire"
      ],
      url: canonicalUrl
    });
  }, [page, slug]);

  return (
    <>
      <SiteHeader />
      <main className="city-page">
        {page.sectionVisibility.hero ? (
          <section className="city-page__hero" style={{ backgroundImage: `url(${page.heroImage || defaultCitySectionImages.heroImage})` }}>
            <div className="page-shell city-page__hero-inner">
              <div className="city-page__hero-copy">
                <h1 className="city-page__hero-title">{page.heroTitle}</h1>
                {page.heroSubheadline ? <p className="city-page__hero-subheadline">{page.heroSubheadline}</p> : null}
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
                <img
                  src={page.heroImage || defaultCitySectionImages.heroImage}
                  alt={page.heroAlt || page.heroTitle}
                  className="city-page__hero-seo-image"
                  fetchPriority="high"
                  loading="eager"
                />
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
            description={page.servicesText}
            bookingLinks={bookingLinks}
            actionItems={actionItems}
            cards={cityServiceCards}
            className="city-page__services"
          />
        ) : null}

        {page.sectionVisibility.sameDay ? (
          <section className="city-page__intro">
            <div className="page-shell">
              <h2 className="city-page__section-title">{page.sameDayTitle}</h2>
              <p className="city-page__text city-page__text--wide">{page.sameDayIntro}</p>
              {page.sameDayDetails ? <p className="city-page__text city-page__text--wide">{page.sameDayDetails}</p> : null}
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
                <img src={page.wasteImage || defaultCitySectionImages.wasteImage} alt={page.wasteAlt || page.wasteTitle} className="city-page__split-image" />
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
          <section
            className="city-page__split city-page__split--reverse city-page__split--overlay"
            style={{ backgroundImage: `url(${propertyBackgroundImage})` }}
          >
            <div className="page-shell city-page__split-grid city-page__split-grid--reverse city-page__split-grid--overlay">
              <div className="city-page__split-copy">
                <h2 className="city-page__section-title city-page__section-title--split">
                  <span>{propertyTitlePrefix}</span>
                  {propertyTitleAccent ? (
                    <span className="city-page__section-title-accent">{propertyTitleAccent}</span>
                  ) : null}
                </h2>
                <p className="city-page__text">{page.propertyText}</p>
                {page.propertyDetails ? <p className="city-page__text city-page__text--wide">{page.propertyDetails}</p> : null}
                <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions" />
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
              <h2 className="city-page__section-title">{page.compareTitle || compareSection.title}</h2>
              {page.compareText ? <p className="city-page__text city-page__text--wide city-page__compare-text">{page.compareText}</p> : null}
            </div>

            <div className="city-page__compare-grid">
              <article className="city-page__compare-card city-page__compare-card--positive">
                <h3 className="city-page__compare-title">{comparePositiveTitle}</h3>
                <div className="city-page__compare-list">
                  {comparePositiveItems.map((item) => (
                    <div key={item} className="city-page__compare-item city-page__compare-item--positive">
                      <Check size={15} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="city-page__compare-card city-page__compare-card--negative">
                <h3 className="city-page__compare-title">{compareNegativeTitle}</h3>
                <div className="city-page__compare-list">
                  {compareNegativeItems.map((item) => (
                    <div key={item} className="city-page__compare-item city-page__compare-item--negative">
                      <X size={15} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="city-page__actions city-page__actions--centered city-page__actions--property-match" />
          </div>
        </section>

        <section className="city-page__map">
          <div className="page-shell">
            <div className="city-page__head">
              <h2 className="city-page__section-title">{page.mapTitle || mapSection.title}</h2>
              <p className="city-page__text">{page.mapText || mapSection.text}</p>
            </div>
            <div className="city-page__map-box">
              {mapEmbedUrl ? (
                <iframe
                  key={mapEmbedUrl}
                  src={mapEmbedUrl}
                  title={`Rocket Rubbish map for ${page.name || slug}`}
                  className="city-page__map-iframe"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="city-page__map-loading">Loading map...</div>
              )}
              <div className="city-page__map-card">
                <strong>Rocket Rubbish</strong>
                <span>Head Office - {mapLocation?.label || page.name || slug}</span>
                <small>4.8 ? (1024)</small>
              </div>
            </div>
          </div>
        </section>

        <SharedTestimonialsSection />
        <SharedFaqSection
          items={faqItems}
          eyebrow={page.faqEyebrow || "Got Questions?"}
          title={page.faqTitle || "Frequently Asked Questions"}
          description={page.faqDescription || "Everything you need to know about the service, pricing, and coverage."}
          defaultOpenIndex={0}
          leftColumnCount={3}
        />

        <section className="city-page__bottom-cta">
          <div className="page-shell city-page__bottom-cta-inner">
            {bottomCta.eyebrow ? <p className="city-page__bottom-eyebrow">{bottomCta.eyebrow}</p> : null}
            <h2 className="city-page__bottom-title">{bottomCta.title}</h2>
            <p className="city-page__bottom-text">{page.bottomText || "Book your trusted rubbish clearance today and let our professionals handle the heavy lifting."}</p>
            <ActionButtonsRow items={bottomActionItems} bookingLinks={bookingLinks} className="city-page__actions city-page__actions--centered" />
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}


















