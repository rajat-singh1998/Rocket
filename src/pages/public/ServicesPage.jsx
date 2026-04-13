import { ArrowRight, ArrowUpRight, ChevronDown, Upload } from "lucide-react";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import { bookingLinks, faqs, processSteps, serviceCards } from "../../data/homeContent";

function ServiceVisual({ item }) {
  return (
    <div className={`service-card__visual ${item.theme === "green" ? "service-card__visual-green" : ""}`}>
      {item.image ? (
        <img src={item.image} alt={item.alt || item.title} className="service-card__image" />
      ) : (
        <div className="text-white text-[1.2rem] font-semibold">{item.title}</div>
      )}
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

function StepCard({ item }) {
  return (
    <article className="step-card">
      <p className="text-sm font-semibold tracking-[0.24em] text-brand-green">{item.number}</p>
      <h3 className="mt-4 text-[1.35rem] font-semibold tracking-[-0.03em] text-[#161616]">{item.title}</h3>
      <p className="mt-3 text-[0.98rem] leading-7 text-[#61675e]">{item.description}</p>
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

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section className="hero-surface py-12 lg:py-16">
          <div className="page-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="section-eyebrow">Our Services</p>
              <p className="text-[0.95rem] text-[#7a8177]">Home / Our Services</p>
              <h1 className="mt-4 max-w-[760px] text-[3rem] font-semibold leading-[1.05] tracking-[-0.055em] text-[#111] sm:text-[4.35rem]">
                Complete Rubbish Clearance Services Across the UK
              </h1>
              <p className="mt-5 max-w-[680px] text-[1.1rem] leading-8 text-[#545b52] sm:text-[1.22rem]">
                From bulky items to full property clearances, Rocket Rubbish makes rubbish removal fast, clear, and easy to book.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={bookingLinks.bookNow} className="solid-button">
                  Book Now
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a href={bookingLinks.quote} className="outline-button">
                  Get A Quote
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[34px] bg-[#f2f7ee] p-6 shadow-[0_24px_40px_rgba(15,23,32,0.08)]">
              <img src="/images/rocket/service-truck.png" alt="Rocket service vehicle" className="mx-auto w-full max-w-[640px] object-contain" />
            </div>
          </div>
        </section>

        <section id="services-grid" className="py-20 lg:py-24">
          <div className="page-shell">
            <div className="max-w-[760px]">
              <p className="section-eyebrow">Pick Your Clearance Service</p>
              <h2 className="section-title">Choose the service that matches the job.</h2>
              <p className="mt-4 text-[1.08rem] leading-8 text-[#5e645c]">
                Household waste, appliances, office furniture, sofas, and full clearances can all be booked through the same simple process.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {serviceCards.map((item) => (
                <ServiceCard key={item.title} item={item} />
              ))}
            </div>

            <div className="mt-12 rounded-[32px] border border-[#dfe6d8] bg-[#f8fbf6] p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
              <div className="max-w-[700px]">
                <p className="section-eyebrow">Need help choosing?</p>
                <h3 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#141414] sm:text-[2.4rem]">
                  Got rubbish but not sure what it is?
                </h3>
                <p className="mt-4 text-[1.03rem] leading-8 text-[#5f655d]">
                  Upload a photo or send it on WhatsApp and our team will point you to the right service page or quote option.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
                <button type="button" className="solid-button">
                  <Upload className="h-5 w-5" />
                  Upload Photos
                </button>
                <a href={bookingLinks.whatsapp} className="outline-button">
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#f6f6f1] py-20 lg:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-[880px] text-center">
              <p className="section-eyebrow justify-center">How It Works</p>
              <h2 className="section-title">A simple service flow from booking to collection.</h2>
              <p className="mt-4 text-[1.08rem] leading-8 text-[#626860]">
                The services page follows the same quick booking process used throughout the site.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {processSteps.map((item) => (
                <StepCard key={item.number} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 lg:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-[820px] text-center">
              <p className="section-eyebrow justify-center">Service Questions</p>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="mt-4 text-[1.05rem] leading-8 text-[#61675f]">
                Everything customers usually want to know before choosing a clearance service.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-[980px] space-y-4">
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
