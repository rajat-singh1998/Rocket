import { useEffect, useRef, useState } from "react";
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
import "./HomePage.css";

const initialQuoteForm = {
  clearing: clearingOptions[0].title,
  load: loadOptions[1].title,
  postcode: "",
  timing: "ASAP"
};

export default function HomePage() {
  const [heroContent, setHeroContent] = useState(homepageHero);
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm);
  const [quoteError, setQuoteError] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
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

  const handleQuoteSubmit = (event) => {
    event.preventDefault();

    if (!quoteForm.postcode.trim()) {
      setQuoteError("Please enter your postcode first.");
      setQuoteMessage("");
      return;
    }

    setQuoteError("");
    setQuoteMessage(`Quote ready for ${quoteForm.clearing.toLowerCase()} in ${quoteForm.postcode.toUpperCase()}.`);
  };

  const handleCoverageSearch = (event) => {
    event.preventDefault();

    if (!locationSearch.trim()) {
      setCoverageMessage("Type a city name to check coverage.");
      return;
    }

    const matchedLocation = popularLocations.find((item) => item.toLowerCase() === locationSearch.trim().toLowerCase());

    if (matchedLocation) {
      setCoverageMessage(`Good news, ${matchedLocation} is covered.`);
      return;
    }

    setCoverageMessage("This city is not in the quick list yet, but coverage can still be confirmed by the team.");
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





