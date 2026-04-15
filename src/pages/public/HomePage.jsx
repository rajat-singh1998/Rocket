import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgePoundSterling,
  CalendarDays,
  Check,
  Clock3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  Recycle,
  Search,
  ShieldCheck,
  Signal,
  Star,
  Truck,
  Upload,
  User,
  WashingMachine
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import {
  bookingLinks,
  clearingOptions,
  coverageStats,
  faqs,
  featureCards,
  heroStats,
  loadOptions,
  popularLocations,
  pricingPlans,
  processSteps,
  serviceCards,
  testimonials,
  tickerItems
} from "../../data/homeContent";
import "./HomePage.css";

const featureIcons = {
  truck: Truck,
  pound: BadgePoundSterling,
  shield: ShieldCheck,
  signal: Signal,
  home: Home
};

const timingOptions = ["ASAP", "Within a few days", "1 Week+", "Not Sure Yet"];
const homepageServiceCards = serviceCards.slice(0, 4);

const tickerIcons = {
  leaf: Leaf,
  recycle: Recycle,
  map: MapPin,
  calendar: CalendarDays,
  price: BadgePoundSterling
};
function HeroChoiceCard({ item, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`home-choice-card ${selected ? "home-choice-card--active" : ""}`}>
      <div className="home-choice-card__image">
        <img src={item.image} alt={item.alt} className="home-choice-card__image-file" />
      </div>
      <h3 className="home-choice-card__title">{item.title}</h3>
      <p className="home-choice-card__description">{item.description}</p>
    </button>
  );
}

function LoadCard({ item, selected, onClick }) {
  const truckClass =
    item.size === "small"
      ? "home-load-card__truck home-load-card__truck--small"
      : item.size === "medium"
        ? "home-load-card__truck home-load-card__truck--medium"
        : "home-load-card__truck home-load-card__truck--large";

  return (
    <button type="button" onClick={onClick} className={`home-load-card ${selected ? "home-load-card--active" : ""}`}>
      <p className="home-load-card__title">{item.title}</p>
      <div className="home-load-card__visual">
        <img src={item.image} alt={item.title} className={truckClass} />
      </div>
    </button>
  );
}

function ServiceVisual({ item }) {
  if (item.image) {
    return (
      <div className="home-service-card__visual">
        <img src={item.image} alt={item.alt} className="home-service-card__image" />
      </div>
    );
  }

  if (item.icon === "washer") {
    return (
      <div className="home-service-card__visual">
        <WashingMachine size={156} strokeWidth={1.4} className="home-service-card__icon-washer" />
      </div>
    );
  }

  return (
    <div className="home-service-card__visual">
      <div className="home-service-card__office">
        <img src="/images/rocket/office-table.png" alt="Office clearance" className="home-service-card__office-image" />
      </div>
    </div>
  );
}
function ServiceCard({ item }) {
  return (
    <article className={`home-service-card ${item.featured ? "home-service-card--featured" : "home-service-card--light"}`}>
      <ServiceVisual item={item} />
      <h3 className="home-service-card__title">{item.title}</h3>
      <p className="home-service-card__description">{item.description}</p>
      <a href={bookingLinks.bookNow} className={`home-service-card__button ${item.featured ? "home-service-card__button--featured" : ""}`}>
        <span>Book Now</span>
        <ArrowUpRight size={16} />
      </a>
    </article>
  );
}

function FeatureCard({ item }) {
  const Icon = featureIcons[item.icon];

  return (
    <article className="home-feature-card">
      <div className="home-feature-card__icon">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="home-feature-card__title">{item.title}</h3>
        <p className="home-feature-card__description">{item.description}</p>
      </div>
    </article>
  );
}

function StepCard({ item }) {
  const iconMap = {
    file: FileText,
    calendar: CalendarDays,
    truck: Truck,
    recycle: Recycle
  };

  const Icon = iconMap[item.icon] || FileText;

  return (
    <article className="home-step-card">
      <div className="home-step-card__top">
        <div className="home-step-card__icon-wrap">
          {item.iconImage ? (
            <img src={item.iconImage} alt={item.iconAlt || ""} className="home-step-card__icon-image" />
          ) : (
            <Icon size={28} strokeWidth={1.8} className="home-step-card__icon" />
          )}
        </div>
        <p className="home-step-card__number">{item.number}</p>
      </div>
      <h3 className="home-step-card__title">{item.title}</h3>
      <p className="home-step-card__description">{item.description}</p>
    </article>
  );
}

function PricingCard({ item }) {
  return (
    <article className={`home-pricing-card ${item.featured ? "home-pricing-card--featured" : ""}`}>
      {item.featured ? (
        <div className="home-pricing-card__badge">
          <Star size={12} fill="currentColor" />
          <span>Most Popular</span>
        </div>
      ) : null}
      <div className="home-pricing-card__icon-wrap">
        <Truck size={18} className="home-pricing-card__icon" />
      </div>
      <h3 className="home-pricing-card__title">{item.title}</h3>
      <p className="home-pricing-card__description">{item.description}</p>
      <div className="home-pricing-card__price-block">
        <p className="home-pricing-card__eyebrow">From</p>
        <p className="home-pricing-card__price">{item.price}</p>
        <p className="home-pricing-card__note">{item.note}</p>
      </div>
      <ul className="home-pricing-card__list">
        {item.features.map((feature) => (
          <li key={feature} className="home-pricing-card__list-item">
            <Check size={16} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a href={bookingLinks.quote} className={`home-pricing-card__button ${item.featured ? "home-pricing-card__button--featured" : ""}`}>
        Get A Quote
        <ArrowRight size={16} />
      </a>
    </article>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="home-testimonial-card">
      <div className="home-testimonial-card__brand">
        <div className="home-testimonial-card__trustpilot">
          <Star size={15} fill="currentColor" className="home-testimonial-card__trustpilot-star" />
          <span>Trustpilot</span>
        </div>
        <div className="home-testimonial-card__rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="home-testimonial-card__rating-box">
              <Star size={10} fill="currentColor" />
            </span>
          ))}
        </div>
      </div>
      <p className="home-testimonial-card__quote">&quot;{item.quote}&quot;</p>
      <div className="home-testimonial-card__meta">
        <span className="home-testimonial-card__author">{item.author}</span>
        <span className="home-testimonial-card__time">{item.time}</span>
      </div>
    </article>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <article className={`home-faq-item ${isOpen ? "home-faq-item--open" : ""}`}>
      <button type="button" className="home-faq-item__summary" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.question}</span>
        <ChevronDown size={18} className={`home-faq-item__icon ${isOpen ? "home-faq-item__icon--open" : ""}`} />
      </button>
      {isOpen ? <p className="home-faq-item__answer">{item.answer}</p> : null}
    </article>
  );
}

export default function HomePage() {
  const [quoteForm, setQuoteForm] = useState({
    clearing: clearingOptions[0].title,
    load: loadOptions[1].title,
    postcode: "",
    timing: timingOptions[0]
  });
  const [quoteError, setQuoteError] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [serviceSlideIndex, setServiceSlideIndex] = useState(0);
  const [testimonialSlideIndex, setTestimonialSlideIndex] = useState(0);
  const [coverageMessage, setCoverageMessage] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const uploadRef = useRef(null);

  const matchedLocations = popularLocations.filter((item) => item.toLowerCase().includes(locationSearch.trim().toLowerCase()));
  const visibleServiceCards = homepageServiceCards.map((_, index) => homepageServiceCards[(serviceSlideIndex + index) % homepageServiceCards.length]);
  const visibleTestimonials = testimonials.map((_, index) => testimonials[(testimonialSlideIndex + index) % testimonials.length]);
  const leftFaqs = faqs.filter((_, index) => index % 2 === 0);
  const rightFaqs = faqs.filter((_, index) => index % 2 === 1);

  const handleQuoteSubmit = (event) => {
    event.preventDefault();

    if (!quoteForm.postcode.trim()) {
      setQuoteError("Please enter your postcode first.");
      setQuoteMessage("");
      return;
    }

    setQuoteError("");
    setQuoteMessage(
      `Quote ready for ${quoteForm.clearing.toLowerCase()} in ${quoteForm.postcode.toUpperCase()} with a ${quoteForm.load.toLowerCase()} ${quoteForm.timing.toLowerCase()} booking window.`
    );
  };

  const handleCoverageSearch = (event) => {
    event.preventDefault();

    if (!locationSearch.trim()) {
      setCoverageMessage("Type a city name to check coverage.");
      return;
    }

    if (matchedLocations.length > 0) {
      setCoverageMessage(`Good news, ${matchedLocations[0]} is covered.`);
      return;
    }

    setCoverageMessage("This city is not in the quick list yet, but coverage can still be confirmed by the team.");
  };

  const handlePreviousServices = () => {
    setServiceSlideIndex((current) => (current === 0 ? homepageServiceCards.length - 1 : current - 1));
  };

  const handleNextServices = () => {
    setServiceSlideIndex((current) => (current + 1) % homepageServiceCards.length);
  };

  const handleTestimonialSlideChange = (index) => {
    setTestimonialSlideIndex(index);
  };

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setTestimonialSlideIndex((current) => (current + 1) % testimonials.length);
    }, 4500);

    return () => window.clearInterval(sliderTimer);
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    setUploadedPhotoName(file ? file.name : "");
  };

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <section className="home-hero">
          <div className="page-shell home-hero__grid">
            <div className="home-hero__content">
              <h1 className="home-hero__title">
                UK-Wide Rubbish Clearance
                <br />
                Fast, Easy & Hassle-Free
              </h1>
              <p className="home-hero__description">
                Man & Van rubbish clearance across the UK. Book in 60 seconds. We collect, sort & recycle, same day.
              </p>

              <div className="home-hero__stats">
                {heroStats.map((item, index) => (
                  <div key={item.label} className={`home-hero__stat ${index !== heroStats.length - 1 ? "home-hero__stat--bordered" : ""}`}>
                    <div className="home-hero__stat-value">
                      {item.star ? <Star size={18} fill="currentColor" className="home-hero__stat-star" /> : null}
                      {item.value}
                    </div>
                    <p className="home-hero__stat-label">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="home-hero__actions">
                <a href={bookingLinks.phone} className="outline-button home-hero__action-link">
                  <Phone size={16} className="home-hero__action-icon" />
                  <span>Speak To An Agent</span>
                </a>
                <a href={bookingLinks.whatsapp} className="outline-button home-hero__action-link home-hero__action-link--whatsapp">
                  <img src="/images/rocket/logos_whatsapp-icon.svg" alt="" className="home-hero__action-whatsapp-icon" />
                  <span>WhatsApp An Agent With A Photo Of Your Waste.</span>
                </a>
                <a href={bookingLinks.bookNow} className="outline-button home-hero__action-link home-hero__action-link--dark">
                  <CalendarDays size={16} className="home-hero__action-icon" />
                  <span>Book Online Now</span>
                </a>
              </div>
              <div className="banner_image">
                <img src="/images/rocket/Hero_Section.png" alt="Rocket Rubbish truck" className="banner_image__file" />
              </div>
            </div>

            <div className="home-hero__form-wrap">
              <form onSubmit={handleQuoteSubmit} className="home-quote-form">
                <h2 className="home-quote-form__title">What Are We Clearing?</h2>
                <div className="home-quote-form__choice-grid">
                  {clearingOptions.map((item) => (
                    <HeroChoiceCard
                      key={item.title}
                      item={item}
                      selected={quoteForm.clearing === item.title}
                      onClick={() => setQuoteForm((current) => ({ ...current, clearing: item.title }))}
                    />
                  ))}
                </div>

                <h3 className="home-quote-form__subtitle">How Much Waste Do You Have?</h3>
                <div className="home-quote-form__load-grid">
                  {loadOptions.map((item) => (
                    <LoadCard
                      key={item.title}
                      item={item}
                      selected={quoteForm.load === item.title}
                      onClick={() => setQuoteForm((current) => ({ ...current, load: item.title }))}
                    />
                  ))}
                </div>

                <div className="home-quote-form__details">
                  <div className="home-quote-form__detail-block">
                    <h3 className="home-quote-form__detail-title">Pickup Location</h3>
                    <label className="home-pickup-field">
                      <MapPin size={16} className="home-pickup-field__icon" />
                      <input
                        type="text"
                        value={quoteForm.postcode}
                        onChange={(event) => setQuoteForm((current) => ({ ...current, postcode: event.target.value }))}
                        placeholder="Enter Your Postcode"
                        className="home-pickup-field__input"
                      />
                    </label>
                  </div>

                  <div className="home-quote-form__detail-block">
                    <h3 className="home-quote-form__detail-title">When Should We Collect?</h3>
                    <div className="home-timing-options" role="radiogroup" aria-label="Collection Timing">
                      {timingOptions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`home-timing-option ${quoteForm.timing === item ? "home-timing-option--active" : ""}`}
                          onClick={() => setQuoteForm((current) => ({ ...current, timing: item }))}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {quoteError ? <p className="status-note status-note-error">{quoteError}</p> : null}
                {quoteMessage ? <p className="status-note status-note-success">{quoteMessage}</p> : null}

                <button type="submit" className="home-quote-form__submit">
                  Get a quote
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="home-ticker">
          <div className="home-ticker__viewport">
            <div className="home-ticker__track">
              {[...tickerItems, ...tickerItems].map((item, index) => {
                const Icon = tickerIcons[item.icon];

                return (
                  <div key={`${item.label}-${index}`} className="home-ticker__item">
                    <Icon size={13} strokeWidth={1.8} className="home-ticker__icon" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="services" className="home-services">
          <div className="page-shell">
            <div className="home-services-slider__head">
              <div className="home-services-slider__copy">
                <h2 className="home-services-slider__title">Pick Your Clearance Service</h2>
                <p className="home-services-slider__text">
                  Select the service you need and tell us what to remove. From single items to full clearances, our team handles everything - quick, simple, and hassle-free.
                </p>
              </div>
              <Link to="/services" className="home-services-slider__button">
                Full Services
              </Link>
            </div>

            <div className="home-services-slider__viewport">
              <div className="home-services__grid">
                {visibleServiceCards.map((item, index) => (
                  <ServiceCard key={`${item.title}-${index}`} item={item} />
                ))}
              </div>
            </div>

            <div className="home-services-slider__controls">
              <button type="button" className="home-services-slider__control home-services-slider__control--muted" onClick={handlePreviousServices} aria-label="Previous service slide">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="home-services-slider__control home-services-slider__control--active" onClick={handleNextServices} aria-label="Next service slide">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="home-upload-banner">
              <div className="home-upload-banner__content">
                <div className="home-upload-banner__copy">
                  <h3 className="home-upload-banner__title">Got Rubbish But Not Sure What It Is?</h3>
                  <p className="home-upload-banner__text">
                    Send a quick photo and Rocket Rubbish will give you a fixed price instantly - simple and transparent.
                  </p>
                </div>
                <div className="home-upload-banner__actions">
                  <input ref={uploadRef} type="file" className="home-upload-banner__file-input" onChange={handlePhotoChange} />
                  <button type="button" onClick={() => uploadRef.current?.click()} className="home-upload-banner__action">
                    <Upload size={16} />
                    Upload Photos
                  </button>
                  <a href={bookingLinks.whatsapp} className="home-upload-banner__action">
                    <MessageCircle size={16} />
                    WhatsApp Us
                  </a>
                </div>
                {uploadedPhotoName ? <p className="home-upload-banner__file-name">Selected file: {uploadedPhotoName}</p> : null}
              </div>
              <div className="home-upload-banner__visual">
                {/* <img src="/images/rocket/Banner.png" alt="Rocket Rubbish team carrying a sofa to the truck" className="home-upload-banner__image" /> */}
              </div>
            </div>
          </div>
        </section>

        <section className="home-features">
          <div className="page-shell home-features__grid">
            <div>
              <p className="section-eyebrow">Why Rocket Rubbish</p>
              <div className="home-features__intro">
                <h2 className="section-title">
                  Not Just A Van Service
                  <br />
                  A Smarter Way To Clear Rubbish
                </h2>
               
              </div>

              <div className="home-features__list">
                {featureCards.map((item) => (
                  <FeatureCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="home-features__visual-wrap">
               <p className="home-features__intro-text">
                  We go beyond simple collection with fast response, easy booking, and responsible disposal, making rubbish removal smooth and stress-free.
                </p>
              <div className="home-features__image-frame">
                <img src="/images/rocket/Rectangle_29.png" alt="Rocket Rubbish team" className="home-features__image" />
              </div>
              <div className="home-features__floating-card">
                <p className="home-features__floating-value">1,100+</p>
                <div className="home-features__floating-copy">
                  <p>Towns & Cities</p>
                  <p>Across The UK</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="home-steps">
          <div className="page-shell">
            <div className="home-steps__head">
              <p className="section-eyebrow">How It Works</p>
              <h2 className="section-title">Rubbish gone in 4 simple steps</h2>
              <p className="home-steps__text">
                We've redesigned rubbish clearance from the ground up. No waiting, no hidden fees, just smooth service.
              </p>
            </div>

            <div className="home-steps__grid">
              {processSteps.map((item) => (
                <StepCard key={item.number} item={item} />
              ))}
            </div>
          </div>
        </section>

                <section id="coverage" className="home-coverage">
          <div className="page-shell">
            <div className="home-coverage__shell">
              <div className="home-coverage__grid">
                <div className="home-coverage__content">
                  <p className="section-eyebrow home-coverage__eyebrow">Our Coverage</p>
                  <h2 className="home-coverage__title">
                    1,100+ Towns & Cities
                    <br />
                    Across The UK
                  </h2>
                  <p className="home-coverage__text">
                    From Aberdeen to Penzance, Newcastle to Norwich. If you're in the UK, we're almost certainly coming your way. England, Scotland, and Wales covered.
                  </p>

                  <form onSubmit={handleCoverageSearch} className="home-coverage__search">
                    <div className="home-coverage__search-input-wrap">
                      <Search size={18} className="home-coverage__search-icon" />
                      <input
                        type="text"
                        value={locationSearch}
                        onChange={(event) => setLocationSearch(event.target.value)}
                        placeholder="Search Your City"
                        className="home-coverage__search-input"
                      />
                    </div>
                    <button type="submit" className="home-coverage__search-button">
                      Go
                    </button>
                  </form>

                  {coverageMessage ? <p className="home-coverage__status">{coverageMessage}</p> : null}

                  
                </div>

                <div className="home-coverage__cards">
                  {coverageStats.map((item) => (
                    <article
                      key={item.label}
                      className={`home-coverage-card ${item.wide ? "home-coverage-card--wide" : ""} ${item.icon ? "home-coverage-card--with-icon" : ""}`}
                    >
                      <div className="home-coverage-card__body">
                        <p className="home-coverage-card__value">{item.value}</p>
                        <h3 className="home-coverage-card__title">{item.label}</h3>
                        <p className="home-coverage-card__description">{item.description}</p>
                      </div>
                      {item.icon === "clock" ? (
                        <div className="home-coverage-card__icon-badge">
                          <img src="/images/rocket/carbon_time.png" alt="" />
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
              <div className="locations">
                 <div className="home-coverage__locations">
                    <div className="home-coverage__locations-divider" />
                    <p className="home-coverage__locations-title">Popular Locations</p>
                    <div className="home-coverage__locations-list">
                      {popularLocations.map((item) => {
                        const isActiveLocation = locationSearch.trim() ? locationSearch.trim().toLowerCase() === item.toLowerCase() : item === popularLocations[0];

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setLocationSearch(item)}
                            className={`home-coverage__location-chip ${isActiveLocation ? "home-coverage__location-chip--active" : ""}`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="home-pricing">
          <div className="page-shell">
            <div className="home-pricing__head">
              <p className="section-eyebrow">Simple Pricing</p>
              <h2 className="section-title">Fixed prices. No nonsense.</h2>
              <p className="home-pricing__text">
                All prices include labour, loading, transport, and eco-disposal. What you see is exactly what you pay.
              </p>
            </div>

            <div className="home-pricing__grid">
              {pricingPlans.map((item) => (
                <PricingCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="home-testimonials">
          <div className="page-shell">
            <div className="home-testimonials__head">
              <div className="home-testimonials__brandline">
                <img src="/images/rocket/Trustpilot_Logo.png" alt="" />
              </div>
              <h2 className="home-testimonials__title">Loved By Thousands Across The UK</h2>
              <p className="home-testimonials__text">Based On 10,000+ Reviews From Happy Customers</p>
            </div>

            <div className="home-testimonials__viewport">
              <div className="home-testimonials__grid">
                {visibleTestimonials.map((item, index) => (
                  <TestimonialCard key={`${item.author}-${index}`} item={item} />
                ))}
              </div>
            </div>

            <div className="home-testimonials__dots">
              {testimonials.map((item, index) => (
                <button
                  key={item.author}
                  type="button"
                  className={`home-testimonials__dot ${testimonialSlideIndex === index ? "home-testimonials__dot--active" : ""}`}
                  onClick={() => handleTestimonialSlideChange(index)}
                  aria-label={`Show testimonial slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="home-faq">
          <div className="page-shell">
            <div className="home-faq__head">
              <p className="section-eyebrow">Got Questions?</p>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="home-faq__text">Everything you need to know about the service, pricing, and coverage.</p>
            </div>

            <div className="home-faq__list">
              <div className="home-faq__column">
                {leftFaqs.map((item, columnIndex) => {
                  const originalIndex = columnIndex * 2;

                  return (
                    <FaqItem
                      key={item.question}
                      item={item}
                      isOpen={openFaqIndex === originalIndex}
                      onToggle={() => setOpenFaqIndex((current) => (current === originalIndex ? -1 : originalIndex))}
                    />
                  );
                })}
              </div>

              <div className="home-faq__column">
                {rightFaqs.map((item, columnIndex) => {
                  const originalIndex = columnIndex * 2 + 1;

                  return (
                    <FaqItem
                      key={item.question}
                      item={item}
                      isOpen={openFaqIndex === originalIndex}
                      onToggle={() => setOpenFaqIndex((current) => (current === originalIndex ? -1 : originalIndex))}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>


        <section className="home-quote-cta">
          <div className="page-shell home-quote-cta__grid">
            <div className="home-quote-cta__media">
              <img src="/images/rocket/quote-photo.jpg" alt="Rocket Rubbish team loading furniture into a truck" className="home-quote-cta__image" />
            </div>

            <div className="home-quote-cta__content">
              <h2 className="home-quote-cta__title">Ready To Clear Your Rubbish Today?</h2>
              <p className="home-quote-cta__text">
                Book Your Man &amp; Van Clearance In 60 Seconds. Fixed Price, Same-Day Available. Covering Every Corner Of The UK
                -England, Scotland &amp; Wales.
              </p>
              <div className="home-quote-cta__actions">
                <a href={bookingLinks.quote} className="home-quote-cta__button home-quote-cta__button--light">
                  Get a Free Quote
                </a>
                <Link to="/credit-account" className="home-quote-cta__button home-quote-cta__button--brand">
                  <User size={16} />
                  <span>Login / Signup</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}














































