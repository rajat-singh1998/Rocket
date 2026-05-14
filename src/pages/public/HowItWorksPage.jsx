import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import SharedFaqSection from "../../components/sections/SharedFaqSection";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import { bookingLinks } from "../../data/homeContent";
import "./HowItWorksPage.css";

const heroActionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];
const processActionItems = [
  { key: "phone", iconImage: "/images/rocket/callg.svg" },
  { key: "whatsapp", iconImage: "/images/rocket/whatsapp-fillg.svg" },
  { key: "bookNow", iconImage: "/images/rocket/calenderg.svg" }
];

const steps = [
  {
    number: "01.",
    icon: "/images/rocket/hugeicons_note-edit.svg",
    title: "Tell Us What You've Got",
    paragraphs: [
      "Share your rubbish details - photos, descriptions, or item lists. The more detail you provide, the faster we can match you with the right load size and price option.",
      "Whether it's household junk, garden waste, builders debris, old furniture, appliances, or commercial rubbish, we process everything instantly and recommend the most efficient rubbish removal or junk removal option.",
      "You get upfront pricing, no hidden fees, and instant booking confirmation, T&C’s apply."
    ],
    image: "/images/rocket/Rectangle_1572.png",
    imageMode: "cover",
    imagePosition: "right center"
  },
  {
    number: "02.",
    icon: "/images/rocket/solar_calendar-broken.svg",
    title: "Pick Your Time Slot",
    paragraphs: [
      "Choose a same-day collection or schedule a day that suits you. We operate 6 days (12pm on Saturday) across the UK.",
      "You'll receive a live arrival window so you know exactly when our team is on the way. No waiting around, no uncertainty.",
      "This works seamlessly for planned rubbish clearance, emergency waste collection, or regular commercial waste disposal routines."
    ],
    image: "/images/rocket/Rectangle_1576.png",
    imageMode: "cover",
    imagePosition: "center center"
  },
  {
    number: "03.",
    icon: "/images/rocket/cil_truck.svg",
    title: "We Collect, You Relax",
    intro: "Our trained two-person man & van team handles everything from start to finish:",
    bullets: [
      "All heavy lifting and loading",
      "Clearing bulky waste safely",
      "Secure transport for proper disposal"
    ],
    middle: "You don't lift anything.",
    followUpBullets: [
      "A digital waste transfer note",
      "A clean and tidy space"
    ],
    footer: "Perfect for homes, offices, retail spaces, and landlords managing tenancy clearouts.",
    image: "/images/rocket/Rectangle_1578.png",
    imageMode: "contain"
  },
  {
    number: "04.",
    icon: "/images/rocket/tabler_recycle.svg",
    title: "We Recycle Responsibly",
    paragraphs: [
      "Once collected, your waste is taken to licensed recycling centres for proper sorting and disposal.",
      "We separate materials like metal, wood, plastic, cardboard, and electronics - ensuring everything is processed safely and ethically.",
      "With up to 95% recycling, zero fly-tipping, and strong environmental practices, your rubbish clearance supports a cleaner, greener UK."
    ],
    image: "/images/rocket/Rectangle_1580.png",
    imageMode: "contain"
  }
];

const processPoints = [
  "Fast and professional junk removal",
  "Transparent pricing",
  "Fully licensed waste carrier",
  "Eco-conscious waste disposal",
  "Trusted by thousands of households and businesses"
];

const howFaqs = [
  {
    question: "How Does Your Rubbish Removal Service Work?",
    answer: "Our rubbish removal process is simple: tell us what you need cleared, choose a time slot, and our team arrives to handle the full rubbish clearance. We load everything, transport it safely, and complete proper waste disposal at licensed facilities."
  },
  {
    question: "How Quickly Can You Complete Rubbish Clearance?",
    answer: "We offer fast booking slots, including same-day and next-day availability in many areas, depending on access and load size."
  },
  {
    question: "Do I Need To Be Present During The Waste Collection?",
    answer: "In most cases yes, but if access is arranged and instructions are clear, we can sometimes complete the collection without you being on site."
  },
  {
    question: "How Is Pricing Calculated?",
    answer: "Pricing is based on volume, access, labour, and the type of waste being removed. We keep it transparent and confirm the quote before collection starts."
  },
  {
    question: "What Types Of Waste Do You Collect?",
    answer: "We collect household junk, furniture, appliances, office waste, builders debris, garden waste, and most general non-hazardous rubbish."
  },
  {
    question: "Do You Recycle The Waste You Collect?",
    answer: "Yes. We sort collected waste at licensed facilities and recycle as much as possible to reduce landfill."
  },
  {
    question: "Is Your Service Better Than Skip Hire?",
    answer: "For many customers, yes. Our man-and-van service includes labour, avoids permits, and clears the waste in one visit without needing a skip on your driveway."
  }
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
                customer-friendly process. No waiting. No hidden fees. No hassle. Just fast waste collection and
                responsible waste disposal from a licensed team you can trust.
              </p>
              <ActionButtonsRow items={heroActionItems} bookingLinks={bookingLinks} className="how-page__actions" />
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
                We&apos;ve redesigned rubbish clearance from the ground up. No waiting. No hidden fees. Just seamless service.
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
                    </div>
                    <div className="how-page__step-heading-row">
                      <span className="how-page__step-number">{step.number}</span>
                      <h3 className="how-page__step-title">{step.title}</h3>
                    </div>

                    {step.paragraphs
                      ? step.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="how-page__step-text">
                            {paragraph}
                          </p>
                        ))
                      : null}

                    {step.intro ? <p className="how-page__step-text">{step.intro}</p> : null}

                    {step.bullets?.length ? (
                      <ul className="how-page__step-bullets">
                        {step.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}

                    {step.middle ? <p className="how-page__step-text">{step.middle}</p> : null}

                    {step.followUpBullets?.length ? (
                      <ul className="how-page__step-bullets">
                        {step.followUpBullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}

                    {step.footer ? <p className="how-page__step-text how-page__step-text--strong">{step.footer}</p> : null}
                  </div>

                  <div className="how-page__step-image-wrap">
                    <img
                      src={step.image}
                      alt={step.title}
                      className={`how-page__step-image ${step.imageMode === "contain" ? "how-page__step-image--contain" : ""}`}
                      style={step.imagePosition ? { objectPosition: step.imagePosition } : undefined}
                    />
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
              <ActionButtonsRow items={processActionItems} bookingLinks={bookingLinks} className="how-page__actions" />
            </div>

            <div className="how-page__process-image-wrap">
              
            </div>
          </div>
        </section>

        <SharedTestimonialsSection />
        <SharedFaqSection items={howFaqs} defaultOpenIndex={0} leftColumnCount={3} />

        <SharedBottomCtaSection
          title="Ready To Clear Your Space?"
          text="Book your trusted rubbish clearance in London today and let our professionals handle the heavy lifting."
        />

        <SiteFooter />
      </main>
    </>
  );
}



