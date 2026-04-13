import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgePoundSterling,
  Check,
  ChevronDown,
  Home,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Signal,
  Star,
  Truck,
  Upload,
  WashingMachine
} from "lucide-react";
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

const featureIcons = {
  truck: Truck,
  pound: BadgePoundSterling,
  shield: ShieldCheck,
  signal: Signal,
  home: Home
};

function HeroChoiceCard({ item, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`choice-card ${selected ? "choice-card-active" : ""}`}>
      <div className="choice-card__image">
        <img src={item.image} alt={item.alt} className="max-h-[128px] w-auto object-contain" />
      </div>
      <h3 className="mt-3 text-[1.02rem] font-semibold tracking-[-0.03em] text-[#171717] sm:text-[1.15rem]">
        {item.title}
      </h3>
      <p className="mt-1 text-[0.94rem] leading-6 text-[#6b7168]">{item.description}</p>
    </button>
  );
}

function LoadCard({ item, selected, onClick }) {
  const scaleClass = item.size === "small" ? "scale-[0.9]" : item.size === "medium" ? "scale-100" : "scale-[1.18]";

  return (
    <button type="button" onClick={onClick} className={`load-card ${selected ? "load-card-active" : ""}`}>
      <p className="text-[0.94rem] font-medium text-[#5c635a]">{item.title}</p>
      <div className="mt-4 flex h-[74px] items-end justify-center overflow-hidden rounded-[18px] bg-[#f2f7ee]">
        <Truck className={`h-12 w-12 text-brand-green ${scaleClass}`} strokeWidth={2.2} />
      </div>
    </button>
  );
}

function ServiceVisual({ item }) {
  if (item.image) {
    return (
      <div className={`service-card__visual ${item.theme === "green" ? "service-card__visual-green" : ""}`}>
        <img src={item.image} alt={item.alt} className="service-card__image" />
      </div>
    );
  }

  if (item.icon === "washer") {
    return (
      <div className="service-card__visual service-card__visual-green">
        <WashingMachine className="h-[170px] w-[170px] text-white" strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <div className="service-card__visual">
      <div className="relative flex h-full w-full items-end justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,#f7fbf5_0%,#eef7e8_100%)]" />
        <img src="/images/rocket/office-table.png" alt="Office clearance" className="relative bottom-[-10px] w-[84%] object-contain" />
      </div>
    </div>
  );
}

function ServiceCard({ item }) {
  const isGreen = item.theme === "green";

  return (
    <article className={`service-card ${isGreen ? "service-card-green" : "service-card-light"}`}>
      <ServiceVisual item={item} />
      <h3 className="mt-7 text-[1.9rem] font-semibold tracking-[-0.04em]">{item.title}</h3>
      <p className={`mt-3 text-[1rem] leading-8 ${isGreen ? "text-white/92" : "text-[#556153]"}`}>{item.description}</p>
      <a href={bookingLinks.bookNow} className={`service-card__button ${isGreen ? "service-card__button-green" : ""}`}>
        <span>Book Now</span>
        <ArrowUpRight className="h-5 w-5" />
      </a>
    </article>
  );
}

function FeatureCard({ item }) {
  const Icon = featureIcons[item.icon];

  return (
    <article className="feature-card">
      <div className="feature-card__icon">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-[1.18rem] font-semibold tracking-[-0.03em] text-[#171717] sm:text-[1.3rem]">{item.title}</h3>
        <p className="mt-2 text-[1rem] leading-7 text-[#666d62]">{item.description}</p>
      </div>
    </article>
  );
}

function StepCard({ item }) {
  return (
    <article className="step-card">
      <p className="text-sm font-semibold tracking-[0.24em] text-brand-green">{item.number}</p>
      <h3 className="mt-4 text-[1.35rem] font-semibold tracking-[-0.03em] text-[#161616]">{item.title}</h3>
      <p className="mt-3 text-[0.98rem] leading-7 text-[#61675e]">{item.description}</p>
    </article>
  );
}

function PricingCard({ item }) {
  return (
    <article className={`pricing-card ${item.featured ? "pricing-card-featured" : ""}`}>
      {item.featured ? (
        <div className="mb-6 inline-flex items-center rounded-full bg-[#111927] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Most Popular
        </div>
      ) : null}
      <h3 className="text-[1.55rem] font-semibold tracking-[-0.03em]">{item.title}</h3>
      <p className={`mt-3 text-[0.98rem] leading-7 ${item.featured ? "text-white/85" : "text-[#5e645c]"}`}>{item.description}</p>
      <div className="mt-7">
        <p className="text-sm uppercase tracking-[0.18em] opacity-70">From</p>
        <p className="mt-2 text-[2.8rem] font-semibold tracking-[-0.05em]">{item.price}</p>
        <p className="mt-2 text-[1rem] opacity-80">{item.note}</p>
      </div>
      <ul className="mt-7 space-y-3">
        {item.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-[0.98rem] leading-7">
            <Check className="mt-1 h-4 w-4 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={bookingLinks.quote}
        className={`mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[1rem] font-semibold ${item.featured ? "bg-white text-[#111]" : "bg-brand-green text-white"}`}
      >
        Get A Quote
        <ArrowRight className="h-4 w-4" />
      </a>
    </article>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="rounded-[26px] border border-[#dfe6d8] bg-white p-7 shadow-[0_14px_34px_rgba(15,23,32,0.05)]">
      <div className="flex items-center gap-1 text-[#22b35f]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="mt-5 text-[1rem] leading-8 text-[#222]">"{item.quote}"</p>
      <div className="mt-6 text-[0.95rem] text-[#6b7168]">
        <span className="font-semibold text-[#151515]">{item.author}</span>
        <span className="mx-2">|</span>
        <span>{item.time}</span>
      </div>
    </article>
  );
}

function FaqItem({ item, defaultOpen = false }) {
  return (
    <details open={defaultOpen} className="faq-item">
      <summary className="faq-item__summary">
        <span>{item.question}</span>
        <ChevronDown className="faq-item__icon h-5 w-5" />
      </summary>
      <p className="pr-8 text-[1rem] leading-8 text-[#5d635a]">{item.answer}</p>
    </details>
  );
}

export default function HomePage() {
  const [quoteForm, setQuoteForm] = useState({
    clearing: clearingOptions[0].title,
    load: loadOptions[1].title,
    postcode: "",
    timing: "ASAP"
  });
  const [quoteError, setQuoteError] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [coverageMessage, setCoverageMessage] = useState("");
  const [uploadedPhotoName, setUploadedPhotoName] = useState("");
  const uploadRef = useRef(null);

  const visibleLocations = popularLocations.filter((item) =>
    item.toLowerCase().includes(locationSearch.trim().toLowerCase())
  );

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

    if (visibleLocations.length > 0) {
      setCoverageMessage(`Good news, ${visibleLocations[0]} is covered.`);
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

      <main className="bg-white">
        <section className="hero-surface">
          <div className="page-shell grid gap-10 py-10 lg:grid-cols-[0.97fr_1.03fr] lg:items-start lg:py-12">
            <div className="pt-4 lg:pt-12">
              <h1 className="max-w-[760px] text-[2.9rem] font-semibold leading-[1.07] tracking-[-0.055em] text-[#111] sm:text-[4rem] lg:text-[4.85rem]">
                UK-Wide Rubbish Clearance
                <br />
                Fast, Easy & Hassle-Free
              </h1>
              <p className="mt-5 max-w-[700px] text-[1.1rem] leading-8 text-[#545b52] sm:text-[1.28rem]">
                Man & Van rubbish clearance across the UK. Book in 60 seconds. We collect, sort & recycle - same day.
              </p>

              <div className="mt-8 grid max-w-[690px] grid-cols-2 overflow-hidden rounded-[24px] border border-[#dfe6d8] bg-white shadow-[0_24px_40px_rgba(15,23,32,0.08)] sm:grid-cols-4">
                {heroStats.map((item, index) => (
                  <div
                    key={item.label}
                    className={`px-5 py-5 text-center ${index !== heroStats.length - 1 ? "sm:border-r sm:border-[#edf1ea]" : ""}`}
                  >
                    <div className="flex items-center justify-center gap-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#111]">
                      {item.star ? <Star className="h-5 w-5 fill-[#1eba71] text-[#1eba71]" /> : null}
                      {item.value}
                    </div>
                    <p className="mt-2 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#555c54]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <a href={bookingLinks.phone} className="outline-button">
                  <Phone className="h-5 w-5 text-brand-green" />
                  Speak to an agent
                </a>
                <a href={bookingLinks.bookNow} className="solid-button">
                  Book Now
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="hero-card">
              <form onSubmit={handleQuoteSubmit} className="rounded-[34px] border border-[#e6ebe0] bg-white p-5 shadow-[0_24px_44px_rgba(15,23,32,0.08)] sm:p-7">
                <h2 className="text-[2.1rem] font-semibold tracking-[-0.04em] text-[#111]">What Are We Clearing?</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {clearingOptions.map((item) => (
                    <HeroChoiceCard
                      key={item.title}
                      item={item}
                      selected={quoteForm.clearing === item.title}
                      onClick={() => setQuoteForm((current) => ({ ...current, clearing: item.title }))}
                    />
                  ))}
                </div>

                <h3 className="mt-8 text-[2rem] font-semibold tracking-[-0.04em] text-[#111]">How Much Waste Do You Have?</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {loadOptions.map((item) => (
                    <LoadCard
                      key={item.title}
                      item={item}
                      selected={quoteForm.load === item.title}
                      onClick={() => setQuoteForm((current) => ({ ...current, load: item.title }))}
                    />
                  ))}
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_1fr]">
                  <label className="field-card">
                    <span className="field-card__label">Pickup Location</span>
                    <input
                      type="text"
                      value={quoteForm.postcode}
                      onChange={(event) => setQuoteForm((current) => ({ ...current, postcode: event.target.value }))}
                      placeholder="Enter your postcode"
                      className="field-input"
                    />
                  </label>
                  <label className="field-card">
                    <span className="field-card__label">When should we collect?</span>
                    <select
                      value={quoteForm.timing}
                      onChange={(event) => setQuoteForm((current) => ({ ...current, timing: event.target.value }))}
                      className="field-input"
                    >
                      {["ASAP", "Within a few days", "1 Week+", "Not Sure Yet"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {["ASAP", "Within a few days", "1 Week+", "Not Sure Yet"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuoteForm((current) => ({ ...current, timing: item }))}
                      className={`chip-button ${item === quoteForm.timing ? "chip-button-active" : ""}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {quoteError ? <p className="status-note status-note-error">{quoteError}</p> : null}
                {quoteMessage ? <p className="status-note status-note-success">{quoteMessage}</p> : null}

                <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-[18px] bg-brand-green px-6 py-4 text-[1.06rem] font-semibold text-white shadow-[0_18px_28px_rgba(47,143,22,0.18)]">
                  Get a quote
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="ticker-bar">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div key={`${item}-${index}`} className="ticker-item">
                <span className="ticker-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="py-20 lg:py-24">
          <div className="page-shell">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[760px]">
                <p className="section-eyebrow">Pick Your Clearance Service</p>
                <h2 className="section-title">Select the service you need and tell us what to remove.</h2>
                <p className="mt-4 text-[1.08rem] leading-8 text-[#5e645c]">
                  From single items to full clearances, our team handles everything quickly, simply, and without hassle.
                </p>
              </div>
              <a href={bookingLinks.bookNow} className="outline-button self-start">
                Full Services
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-4">
              {serviceCards.map((item) => (
                <ServiceCard key={item.title} item={item} />
              ))}
            </div>

            <div className="mt-12 rounded-[32px] border border-[#dfe6d8] bg-[#f8fbf6] p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
              <div className="max-w-[700px]">
                <p className="section-eyebrow">Got rubbish but not sure what it is?</p>
                <h3 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#141414] sm:text-[2.4rem]">
                  Send a quick photo and get a fixed price instantly.
                </h3>
                <p className="mt-4 text-[1.03rem] leading-8 text-[#5f655d]">
                  Simple, transparent, and easy to update later once the final quote flow is connected to the client's system.
                </p>
                {uploadedPhotoName ? <p className="status-note status-note-success mt-4">Selected file: {uploadedPhotoName}</p> : null}
              </div>
              <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
                <input ref={uploadRef} type="file" className="hidden" onChange={handlePhotoChange} />
                <button type="button" onClick={() => uploadRef.current?.click()} className="solid-button">
                  <Upload className="h-5 w-5" />
                  Upload Photos
                </button>
                <a href={bookingLinks.whatsapp} className="outline-button">
                  <MessageCircle className="h-5 w-5 text-brand-green" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f6f1] py-20 lg:py-24">
          <div className="page-shell grid gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
            <div>
              <p className="section-eyebrow">Why Rocket Rubbish</p>
              <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
                <h2 className="section-title max-w-[720px]">
                  Not Just A Van Service
                  <br />
                  A Smarter Way To Clear Rubbish
                </h2>
                <p className="pt-1 text-[1.06rem] leading-8 text-[#5f665d]">
                  We go beyond simple collection with fast response, easy booking, and responsible disposal, making rubbish
                  removal smooth and stress-free.
                </p>
              </div>

              <div className="mt-10 grid gap-4">
                {featureCards.map((item) => (
                  <FeatureCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[30px]">
                <img src="/images/rocket/quote-photo.jpg" alt="Rocket Rubbish team" className="h-full w-full object-cover" />
              </div>
              <div className="coverage-floating-card">
                <p className="text-[2.9rem] font-semibold tracking-[-0.05em] text-[#74b045]">1,100+</p>
                <div className="text-[1.8rem] font-semibold leading-tight tracking-[-0.04em] text-[#131313]">
                  <p>Towns & Cities</p>
                  <p>Across The UK</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 lg:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-[880px] text-center">
              <p className="section-eyebrow justify-center">How It Works</p>
              <h2 className="section-title">Rubbish gone in 4 simple steps</h2>
              <p className="mt-4 text-[1.08rem] leading-8 text-[#626860]">
                We've redesigned rubbish clearance from the ground up. No waiting, no hidden fees, just smooth service.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {processSteps.map((item) => (
                <StepCard key={item.number} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section id="coverage" className="bg-[#111b2c] py-20 text-white lg:py-24">
          <div className="page-shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="section-eyebrow text-[#88c151]">Our Coverage</p>
              <h2 className="mt-5 text-[3rem] font-semibold leading-[1.08] tracking-[-0.05em] sm:text-[4.55rem]">
                1,100+ Towns & Cities
                <br />
                Across The UK
              </h2>
              <p className="mt-6 max-w-[560px] text-[1.14rem] leading-9 text-white/84">
                From Aberdeen to Penzance, Newcastle to Norwich. If you're in the UK, we're almost certainly coming your
                way. England, Scotland, and Wales covered.
              </p>

              <form onSubmit={handleCoverageSearch} className="mt-10 flex max-w-[640px] items-center gap-3 rounded-[20px] border border-[#7bb14d] bg-[#182235] p-3">
                <div className="flex flex-1 items-center gap-3 px-3 py-2 text-white/72">
                  <Search className="h-5 w-5 text-[#8ec956]" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(event) => setLocationSearch(event.target.value)}
                    placeholder="Search Your City"
                    className="coverage-input"
                  />
                </div>
                <button type="submit" className="rounded-[14px] bg-[#7ab245] px-7 py-4 text-[1rem] font-semibold text-white">
                  Go
                </button>
              </form>

              {coverageMessage ? <p className="status-note status-note-dark mt-4">{coverageMessage}</p> : null}

              <div className="mt-10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/66">Popular Locations</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(visibleLocations.length > 0 ? visibleLocations : popularLocations).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLocationSearch(item)}
                      className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {coverageStats.map((item, index) => (
                <article key={item.label} className={`coverage-card ${index === 2 ? "lg:col-span-2" : ""}`}>
                  <p className="text-[3.25rem] font-semibold tracking-[-0.05em] text-[#8ec956]">{item.value}</p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-white">{item.label}</h3>
                  <p className="mt-3 max-w-[300px] text-[1rem] leading-7 text-white/70">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#fbfcf8] py-20 lg:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-[900px] text-center">
              <p className="section-eyebrow justify-center">Simple Pricing</p>
              <h2 className="section-title">Fixed prices. No nonsense.</h2>
              <p className="mt-4 text-[1.06rem] leading-8 text-[#5e645c]">
                All prices include labour, loading, transport, and eco-disposal. What you see is exactly what you pay.
              </p>
            </div>

            <div className="mt-12 grid gap-6 xl:grid-cols-3">
              {pricingPlans.map((item) => (
                <PricingCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-[820px] text-center">
              <p className="section-eyebrow justify-center">Loved by thousands across the UK</p>
              <h2 className="section-title">Trusted by happy customers</h2>
              <p className="mt-4 text-[1.05rem] leading-8 text-[#61685f]">
                Based on thousands of positive reviews from customers who wanted quick, fixed-price collections.
              </p>
            </div>

            <div className="mt-12 grid gap-6 xl:grid-cols-3">
              {testimonials.map((item) => (
                <TestimonialCard key={item.author} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#f7f8f4] py-20 lg:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-[820px] text-center">
              <p className="section-eyebrow justify-center">Got Questions?</p>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="mt-4 text-[1.05rem] leading-8 text-[#61675f]">
                Everything you need to know about the service, pricing, and coverage.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-[980px] space-y-4">
              {faqs.map((item, index) => (
                <FaqItem key={item.question} item={item} defaultOpen={index === 0} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="page-shell">
            <div className="rounded-[34px] bg-[#111b2c] px-6 py-12 text-white shadow-[0_30px_70px_rgba(15,23,32,0.16)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-[760px]">
                <p className="section-eyebrow text-[#8ec956]">Ready to clear your rubbish today?</p>
                <h2 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.05em] sm:text-[3.25rem]">
                  Book your Man & Van clearance in 60 seconds.
                </h2>
                <p className="mt-4 text-[1.08rem] leading-8 text-white/78">
                  Fixed price. Same-day available. Covering every corner of the UK across England, Scotland, and Wales.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row lg:mt-0">
                <a href={bookingLinks.bookNow} className="outline-button !border-white/24 !bg-white !text-[#111]">
                  Get a Free Quote
                </a>
                <a href={bookingLinks.phone} className="solid-button !bg-[#6cab45]">
                  <Phone className="h-5 w-5" />
                  0800 123 4567
                </a>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

