import { Check, Map, X } from "lucide-react";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedFaqSection from "../../components/sections/SharedFaqSection";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import ClearanceServicesSection from "../../components/sections/ClearanceServicesSection";
import StepsSection from "../../components/homepage/StepsSection";
import { bookingLinks, processSteps, stepsSection } from "../../data/homeContent";
import "./ServicesPage.css";

const actionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];

const serviceCards = [
  {
    title: "Mini Load",
    meta: "1 Cubic Yards | 0.8 M�",
    note: "Boot Of Small Car | Up To 8 Dustbin Bags",
    image: "/images/rocket/mini_l.png"
  },
  {
    title: "Small Load",
    meta: "2 Cubic Yards | 1.5 M�",
    note: "Boot Of Estate Car | 10-15 Dustbin Bags",
    image: "/images/rocket/small_l.png"
  },
  {
    title: "Medium Load",
    meta: "4 Cubic Yards | 3.1 M�",
    note: "2 Builders Skip | 23-30 Dustbin Bags",
    image: "/images/rocket/md_l.png"
  },
  {
    title: "Large",
    meta: "7 Cubic Yards | 5.4 M�",
    note: "1 Builders Skip | 45-55 Dustbin Bags",
    image: "/images/rocket/larger_l.png"
  },
  {
    title: "X-Large",
    meta: "10 Cubic Yards | 7.6 M�",
    note: "Small Van Load | 60-80 Dustbin Bags",
    image: "/images/rocket/xl.png"
  },
  {
    title: "XX-Large",
    meta: "14 Cubic Yards | 10.7 M�",
    note: "2 Builders Skips | 90-100 Dustbin Bags",
    image: "/images/rocket/xxl.png"
  }
];

const comparisonRows = [
  {
    rocket: "Same-Day Collection Available",
    typical: "Long Waiting Times"
  },
  {
    rocket: "Fixed, Transparent Pricing",
    typical: "Hidden Fees & Unclear Costs"
  },
  {
    rocket: "We Do All The Heavy Lifting",
    typical: "You Do Most Of The Work"
  },
  {
    rocket: "Eco-Friendly Disposal (Up To 95% Recycled)",
    typical: "Low Recycling Focus"
  },
  {
    rocket: "Easy Online Booking & Photo Quotes",
    typical: "Complicated Booking Process"
  },
  {
    rocket: "Nationwide Coverage (100+ Cities)",
    typical: "Limited Service Areas"
  }
];

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="services-page">
        <section className="services-page__hero">
          <div className="page-shell services-page__hero-grid">
            <div className="services-page__hero-content">
              <h1 className="services-page__hero-title">Complete Rubbish Clearance Services Across The UK</h1>
              <p className="services-page__hero-text">
                From single-item pickups to full property clearances, Rocket Rubbish offers fast, reliable man & van waste removal nationwide. Choose your service and let our team handle everything from collection to responsible disposal.
              </p>
              <p className="services-page__breadcrumb">Home / Our Services</p>
              <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="services-page__actions-row" />
            </div>

            <div className="services-page__hero-visual">
              <div className="services-page__map-visual">
                <img src="/images/rocket/gb_1.png" alt="" />
              </div>
            </div>
          </div>
        </section>

        <ClearanceServicesSection
          title="Pick Your Clearance Service"
          description="Select the service you need and tell us what to remove. From single items to full clearances, our team handles everything - quick, simple, and hassle-free."
          bookingLinks={bookingLinks}
          actionItems={actionItems}
        />

        <StepsSection section={stepsSection} processSteps={processSteps} bookingLinks={bookingLinks} />

        <section className="services-page__comparison">
          <div className="page-shell">
            <div className="services-page__section-head services-page__section-head--centered">
              <p className="services-page__eyebrow">Fast, Reliable, And Hassle-Free</p>
              <h2 className="services-page__section-title">Why Choose Rocket Rubbish</h2>
              <p className="services-page__section-text">Not all rubbish clearance services are the same. Here&apos;s how we do it better.</p>
            </div>

            <div className="services-page__comparison-grid">
              <article className="services-page__comparison-card services-page__comparison-card--rocket">
                <div className="services-page__comparison-head services-page__comparison-head--rocket">
                  <img src="/images/rocket/logo_h.svg" alt="Rocket Rubbish" className="services-page__comparison-logo" />
                </div>
                <div className="services-page__comparison-list">
                  {comparisonRows.map((item) => (
                    <div key={item.rocket} className="services-page__comparison-item">
                      <Check size={15} />
                      <span>{item.rocket}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="services-page__comparison-card services-page__comparison-card--typical">
                <div className="services-page__comparison-head services-page__comparison-head--typical">
                  <span className="services-page__comparison-typical-title">
                    <X size={16} /> Typical Services
                  </span>
                </div>
                <div className="services-page__comparison-list">
                  {comparisonRows.map((item) => (
                    <div key={item.typical} className="services-page__comparison-item services-page__comparison-item--negative">
                      <X size={15} />
                      <span>{item.typical}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <SharedTestimonialsSection />
        <SharedFaqSection />
        <SiteFooter />
      </main>
    </>
  );
}



