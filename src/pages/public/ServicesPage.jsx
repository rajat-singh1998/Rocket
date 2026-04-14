import { ArrowRight, ArrowUpRight, ChevronDown, Upload } from "lucide-react";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import { bookingLinks, faqs, processSteps, serviceCards } from "../../data/homeContent";
import "./ServicesPage.css";

function ServiceVisual({ item }) {
  return (
    <div className={`services-page__card-visual ${item.theme === "green" ? "services-page__card-visual--green" : ""}`}>
      {item.image ? (
        <img src={item.image} alt={item.alt || item.title} className="services-page__card-image" />
      ) : (
        <div className="services-page__card-fallback">{item.title}</div>
      )}
    </div>
  );
}

function ServiceCard({ item }) {
  const isGreen = item.theme === "green";

  return (
    <article className={`services-page__card ${isGreen ? "services-page__card--green" : "services-page__card--light"}`}>
      <ServiceVisual item={item} />
      <h3 className="services-page__card-title">{item.title}</h3>
      <p className="services-page__card-description">{item.description}</p>
      <a href={bookingLinks.bookNow} className={`services-page__card-button ${isGreen ? "services-page__card-button--green" : ""}`}>
        <span>Book Now</span>
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}

function StepCard({ item }) {
  return (
    <article className="services-page__step-card">
      <p className="services-page__step-number">{item.number}</p>
      <h3 className="services-page__step-title">{item.title}</h3>
      <p className="services-page__step-description">{item.description}</p>
    </article>
  );
}

function FaqItem({ item, defaultOpen = false }) {
  return (
    <details open={defaultOpen} className="services-page__faq-item">
      <summary className="services-page__faq-summary">
        <span>{item.question}</span>
        <ChevronDown size={20} className="services-page__faq-icon" />
      </summary>
      <p className="services-page__faq-answer">{item.answer}</p>
    </details>
  );
}

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="services-page">
        <section className="services-page__hero">
          <div className="page-shell services-page__hero-grid">
            <div>
              <p className="section-eyebrow">Our Services</p>
              <p className="services-page__breadcrumb">Home / Our Services</p>
              <h1 className="services-page__hero-title">Complete Rubbish Clearance Services Across the UK</h1>
              <p className="services-page__hero-text">
                From bulky items to full property clearances, Rocket Rubbish makes rubbish removal fast, clear, and easy to book.
              </p>
              <div className="services-page__hero-actions">
                <a href={bookingLinks.bookNow} className="solid-button">
                  Book Now
                  <ArrowRight size={18} />
                </a>
                <a href={bookingLinks.quote} className="outline-button">
                  Get A Quote
                </a>
              </div>
            </div>

            <div className="services-page__hero-visual">
              <img src="/images/rocket/service-truck.png" alt="Rocket service vehicle" className="services-page__hero-image" />
            </div>
          </div>
        </section>

        <section id="services-grid" className="services-page__services-section">
          <div className="page-shell">
            <div className="services-page__section-copy">
              <p className="section-eyebrow">Pick Your Clearance Service</p>
              <h2 className="section-title">Choose the service that matches the job.</h2>
              <p className="services-page__section-text">
                Household waste, appliances, office furniture, sofas, and full clearances can all be booked through the same simple process.
              </p>
            </div>

            <div className="services-page__grid">
              {serviceCards.map((item) => (
                <ServiceCard key={item.title} item={item} />
              ))}
            </div>

            <div className="services-page__banner">
              <div className="services-page__banner-copy">
                <p className="section-eyebrow">Need help choosing?</p>
                <h3 className="services-page__banner-title">Got rubbish but not sure what it is?</h3>
                <p className="services-page__banner-text">
                  Upload a photo or send it on WhatsApp and our team will point you to the right service page or quote option.
                </p>
              </div>
              <div className="services-page__banner-actions">
                <button type="button" className="solid-button">
                  <Upload size={18} />
                  Upload Photos
                </button>
                <a href={bookingLinks.whatsapp} className="outline-button">
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="services-page__steps-section">
          <div className="page-shell">
            <div className="services-page__steps-head">
              <p className="section-eyebrow">How It Works</p>
              <h2 className="section-title">A simple service flow from booking to collection.</h2>
              <p className="services-page__section-text services-page__section-text--centered">
                The services page follows the same quick booking process used throughout the site.
              </p>
            </div>

            <div className="services-page__steps-grid">
              {processSteps.map((item) => (
                <StepCard key={item.number} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="services-page__faq-section">
          <div className="page-shell">
            <div className="services-page__steps-head">
              <p className="section-eyebrow">Service Questions</p>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="services-page__section-text services-page__section-text--centered">
                Everything customers usually want to know before choosing a clearance service.
              </p>
            </div>

            <div className="services-page__faq-list">
              {faqs.slice(0, 6).map((item, index) => (
                <FaqItem key={item.question} item={item} defaultOpen={index === 0} />
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
