import { useEffect, useRef, useState } from "react";
import { useNavigate } from "../../lib/router";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import BottomQuoteSection from "../../components/homepage/BottomQuoteSection";
import CoverageSection from "../../components/homepage/CoverageSection";
import FaqSection from "../../components/homepage/FaqSection";
import FeaturesSection from "../../components/homepage/FeaturesSection";
import FinalCtaSection from "../../components/homepage/FinalCtaSection";
import HeroSection from "../../components/homepage/HeroSection";
import PricingSection from "../../components/homepage/PricingSection";
import ServicesSection from "../../components/homepage/ServicesSection";
import StepsSection from "../../components/homepage/StepsSection";
import TickerSection from "../../components/homepage/TickerSection";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import {
  bookingLinks,
  bottomQuoteSection,
  clearingOptions,
  coverageSection,
  coverageStats,
  faqSection,
  faqs,
  featureCards,
  featuresSection,
  finalCtaSection,
  heroStats,
  homepageHero,
  loadOptions,
  popularLocations,
  pricingPlans,
  pricingSection,
  processSteps,
  quoteFormContent,
  serviceCards,
  servicesSection,
  stepsSection,
  tickerItems,
  uploadBanner
} from "../../data/homeContent";
import { buildApiUrl } from "../../lib/api";
import { submitContactInquiry } from "../../lib/contactInquiries";

const initialQuoteForm = {
  clearing: clearingOptions[0].title,
  load: loadOptions[1].title,
  postcode: "",
  timing: "ASAP"
};

function normaliseLocationSearch(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function HomePage() {
  const navigate = useNavigate();
  const [heroContent, setHeroContent] = useState(homepageHero);
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm);
  const [quoteError, setQuoteError] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [cityPages, setCityPages] = useState([]);
  const [coverageMessage, setCoverageMessage] = useState("");
  const [serviceSlideIndex, setServiceSlideIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const uploadRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function loadHeroContent() {
      try {
        const response = await fetch(buildApiUrl("/api/public/content/hero"));
        const data = await response.json();

        if (!response.ok || !data.ok || !data.hero || ignore) {
          return;
        }

        setHeroContent((current) => ({ ...current, ...data.hero }));
      } catch {
      }
    }

    loadHeroContent();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadCityPages() {
      try {
        const response = await fetch(buildApiUrl("/api/public/city-pages"));
        const data = await response.json();

        if (!ignore && response.ok && data.ok && Array.isArray(data.pages)) {
          setCityPages(data.pages);
        }
      } catch {
      }
    }

    loadCityPages();

    return () => {
      ignore = true;
    };
  }, []);

  const handleQuoteSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await submitContactInquiry({
        source: "homepage",
        ...quoteForm
      });

      setQuoteError("");
      setQuoteMessage(data.message || `Thanks, we received your ${quoteForm.clearing.toLowerCase()} request.`);
    } catch (submitError) {
      setQuoteError(submitError.message || "Unable to send enquiry right now.");
      setQuoteMessage("");
    }
  };

  const openLocationPage = (value) => {
    const query = String(value || "").trim();

    if (!query) {
      setCoverageMessage("Type a city name to check coverage.");
      return;
    }

    const normalisedQuery = normaliseLocationSearch(query);
    const matchedPage = cityPages.find((page) => {
      return normaliseLocationSearch(page.name) === normalisedQuery || normaliseLocationSearch(page.slug) === normalisedQuery;
    });

    if (matchedPage?.slug) {
      navigate(`/cities/${matchedPage.slug}`);
      return;
    }

    const matchedPopularLocation = popularLocations.find((item) => normaliseLocationSearch(item) === normalisedQuery);

    if (matchedPopularLocation) {
      navigate(`/cities/${normaliseLocationSearch(matchedPopularLocation)}`);
      return;
    }

    setCoverageMessage("We could not find that location page yet. Please choose a popular location or check the Locations page.");
  };

  const handleCoverageSearch = (event) => {
    event.preventDefault();
    openLocationPage(locationSearch);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    setUploadedPhotoName(file ? file.name : "");
  };

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <HeroSection hero={heroContent} heroStats={heroStats} bookingLinks={bookingLinks} />
        <TickerSection tickerItems={tickerItems} />
        <ServicesSection
          section={servicesSection}
          serviceCards={serviceCards}
          bookingLinks={bookingLinks}
          uploadBanner={uploadBanner}
          uploadRef={uploadRef}
          uploadedPhotoName={uploadedPhotoName}
          handlePhotoChange={handlePhotoChange}
          serviceSlideIndex={serviceSlideIndex}
          onPrevious={() => setServiceSlideIndex((current) => (current === 0 ? serviceCards.length - 1 : current - 1))}
          onNext={() => setServiceSlideIndex((current) => (current + 1) % serviceCards.length)}
        />
        <FeaturesSection section={featuresSection} featureCards={featureCards} bookingLinks={bookingLinks} />
        <StepsSection section={stepsSection} processSteps={processSteps} bookingLinks={bookingLinks} />
        <CoverageSection
          section={coverageSection}
          coverageStats={coverageStats}
          popularLocations={popularLocations}
          locationSearch={locationSearch}
          setLocationSearch={setLocationSearch}
          coverageMessage={coverageMessage}
          handleCoverageSearch={handleCoverageSearch}
          handleLocationSelect={(location) => {
            setLocationSearch(location);
            openLocationPage(location);
          }}
        />
        <PricingSection section={pricingSection} pricingPlans={pricingPlans} bookingLinks={bookingLinks} />
        <SharedTestimonialsSection />
        <FaqSection section={faqSection} faqs={faqs} openFaqIndex={openFaqIndex} setOpenFaqIndex={setOpenFaqIndex} />
        <BottomQuoteSection
          section={bottomQuoteSection}
          bookingLinks={bookingLinks}
          quoteFormContent={quoteFormContent}
          clearingOptions={clearingOptions}
          loadOptions={loadOptions}
          quoteForm={quoteForm}
          setQuoteForm={setQuoteForm}
          quoteError={quoteError}
          quoteMessage={quoteMessage}
          handleQuoteSubmit={handleQuoteSubmit}
        />
        <FinalCtaSection section={finalCtaSection} bookingLinks={bookingLinks} />
        <SiteFooter />
      </main>
    </>
  );
}
