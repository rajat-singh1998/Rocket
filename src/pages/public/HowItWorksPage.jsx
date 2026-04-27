import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import SharedFaqSection from "../../components/sections/SharedFaqSection";
import { bookingLinks } from "../../data/homeContent";
import "./HowItWorksPage.css";

const actionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];

const steps = [
  {
    number: "01",
    icon: "/images/rocket/hugeicons_note-edit.svg",
    title: "Tell Us What You've Got",
    text:
      "Share your rubbish details, photos, descriptions, or item lists. The more detail you provide, the faster we can match you with the right load size and price option.",
    image: "/images/rocket/form2.png"
  },
  {
    number: "02",
    icon: "/images/rocket/solar_calendar-broken.svg",
    title: "Pick Your Time Slot",
    text:
      "Choose a same-day collection or schedule a day that suits you. We operate seven days a week across the UK and keep everything simple from booking to arrival.",
    image: "/images/rocket/service_1.png"
  },
  {
    number: "03",
    icon: "/images/rocket/cil_truck.svg",
    title: "We Collect, You Relax",
    text:
      "Our trained two-person man & van team handles everything from start to finish, including heavy lifting, loading, safe transport, and proper disposal.",
    image: "/images/rocket/service-truck.png"
  },
  {
    number: "04",
    icon: "/images/rocket/tabler_recycle.svg",
    title: "We Recycle Responsibly",
    text:
      "Once collected, your waste is taken to licensed recycling centres for proper sorting and disposal. We separate materials like metal, cardboard, and electronics wherever possible.",
    image: "/images/rocket/service_3.png"
  }
];

const processPoints = [
  "Fast and professional junk removal",
  "Transparent pricing",
  "Fully licensed waste carrier",
  "Eco-conscious waste disposal",
  "Trusted by thousands of households and businesses"
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="how-page">
        <section className="how-page__hero">
          <div className="page-shell how-page__hero-inner">
            <div className="how-page__hero-copy">
              <h1 className="how-page__hero-title">How We Work</h1>
              <p className="how-page__hero-text">
                We&apos;ve redesigned rubbish removal, junk removal, and rubbish clearance into a simple, transparent,
                customer-friendly process. No waiting, no hidden fees, no hassle.
              </p>
              <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="how-page__actions" />
            </div>
          </div>
        </section>

        <section className="how-page__breadcrumb-wrap">
          <div className="page-shell">
            <p className="how-page__breadcrumb">Home &nbsp;&gt;&nbsp; How We Work</p>
          </div>
        </section>

        <section className="how-page__steps">
          <div className="page-shell">
            <div className="how-page__head">
              <p className="how-page__eyebrow">How It Works</p>
              <h2 className="how-page__section-title">Rubbish Gone In 4 Simple Steps</h2>
              <p className="how-page__section-text">
                We&apos;ve redesigned rubbish clearance from the ground up. No waiting, no hidden fees, just seamless service.
              </p>
            </div>

            <div className="how-page__step-list">
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className={`how-page__step-card ${index % 2 === 1 ? "how-page__step-card--reverse" : ""}`}
                >
                  <div className="how-page__step-copy">
                    <div className="how-page__step-meta">
                      <img src={step.icon} alt="" className="how-page__step-icon" />
                      <span className="how-page__step-number">{step.number}.</span>
                    </div>
                    <h3 className="how-page__step-title">{step.title}</h3>
                    <p className="how-page__step-text">{step.text}</p>
                  </div>

                  <div className="how-page__step-image-wrap">
                    <img src={step.image} alt={step.title} className="how-page__step-image" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="how-page__process-cta">
          <div className="page-shell how-page__process-cta-inner">
            <div className="how-page__process-copy">
              <h2 className="how-page__process-title">Why Our Process Works</h2>
              <ul className="how-page__process-list">
                {processPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="how-page__actions" />
            </div>

            <div className="how-page__process-image-wrap">
              <img src="/images/rocket/Banner.png" alt="Rocket Rubbish team" className="how-page__process-image" />
            </div>
          </div>
        </section>

        <SharedTestimonialsSection />
        <SharedFaqSection />

        <section className="how-page__bottom-cta">
          <div className="page-shell how-page__bottom-cta-inner">
            <h2 className="how-page__bottom-title">Ready To Clear Your Space?</h2>
            <p className="how-page__bottom-text">
              Book your trusted rubbish clearance today and let our professionals handle the heavy lifting.
            </p>
            <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="how-page__actions how-page__actions--centered" />
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}


