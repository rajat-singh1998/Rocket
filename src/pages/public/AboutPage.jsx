import {
  BadgePoundSterling,
  Home,
  ShieldCheck,
  Signal,
  Truck
} from "lucide-react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import { bookingLinks } from "../../data/homeContent";
import "./AboutPage.css";

const heroActions = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];
const bookingCtaActions = [
  { key: "phone", iconImage: "/images/rocket/callg.svg" },
  { key: "whatsapp", iconImage: "/images/rocket/whatsapp-fillg.svg" },
  { key: "bookNow", iconImage: "/images/rocket/calenderg.svg" }
];

const featureCards = [
  {
    title: "Fastest Turnaround Nationwide",
    description:
      "Book before noon and we can be with you the same day - anywhere in the UK. No weeks of waiting like council collections.",
    icon: Truck
  },
  {
    title: "Fixed Prices - No Surprises",
    description:
      "The price you're quoted is what you pay. We never add extras on arrival. Collection, loading, and disposal are all included.",
    icon: BadgePoundSterling
  },
  {
    title: "Licensed, Vetted & Fully Insured",
    description:
      "Every team is Environment Agency licensed, DBS checked, and fully insured. Your property and your peace of mind are protected.",
    icon: ShieldCheck
  },
  {
    title: "Live Van Tracking On The Day",
    description:
      "Know exactly where your team is. No all-day waiting. Get on with your day and we'll ping you when we're 30 minutes away.",
    icon: Signal
  },
  {
    title: "We Do Every Bit Of Heavy Lifting",
    description:
      "Lofts, basements, third floor - doesn't matter. Our teams collect from inside your property. Additional internal access charges may apply.",
    icon: Home
  }
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="about-page">
        <section className="about-page__hero">
          <div className="page-shell about-page__hero-inner">
            <div className="about-page__hero-copy">
              <h1 className="about-page__hero-title">About Us</h1>
              <p className="about-page__hero-text">
                Rocket Rubbish provides fast, reliable, and eco-friendly rubbish removal services across the UK.
                Whether you're clearing out your home, office, or construction site, our experienced team ensures
                your waste is handled efficiently and responsibly, with a strong focus on recycling and reducing landfill.
              </p>
              <ActionButtonsRow items={heroActions} bookingLinks={bookingLinks} className="about-page__hero-actions" />
            </div>
          </div>
        </section>

        <section className="about-page__breadcrumb-wrap">
          <div className="page-shell">
            <p className="about-page__breadcrumb">Home &nbsp;&gt;&nbsp; About Us</p>
          </div>
        </section>

        <section className="about-page__intro">
          <div className="page-shell about-page__split-grid">
            <div className="about-page__image-card">
              <img src="/images/rocket/Article_Image.jpg" alt="Rocket Rubbish team at work" className="about-page__image" />
            </div>

            <div className="about-page__copy-card">
              <h2 className="about-page__section-title">About Rocket Rubbish</h2>
              <p className="about-page__paragraph">
                At Rocket Rubbish, we make waste removal simple, reliable, and environmentally responsible. Our services now extend across the UK - helping homes, businesses, and construction sites manage waste efficiently and stress-free.
              </p>
              <p className="about-page__paragraph">
                Our mission is to provide a service you can depend on, no matter where you are. From small household clearances to large commercial projects,
                we handle every job with professionalism and care.
              </p>
              <h3 className="about-page__subheading">Our Vision</h3>
              <p className="about-page__paragraph">
                Our vision is to become one of the UK's leading rubbish removal providers by delivering consistent, high-quality services nationwide.
                We aim to set new standards in waste management through reliability, innovation, and environmentally responsible practices.
              </p>
              <ActionButtonsRow items={heroActions} bookingLinks={bookingLinks} className="about-page__inline-actions" />
            </div>
          </div>
        </section>

        <section className="about-page__story">
          <div className="page-shell">
            <div className="about-page__story-card">
              <div className="about-page__story-copy">
                <h2 className="about-page__section-title">The Rocket Rubbish Story</h2>
                <p className="about-page__paragraph">
                  Rocket Rubbish was founded with a clear vision - turn a stressful task into a simple, hassle-free experience.
                  What began as a small local operation has evolved into a UK-wide rubbish removal service trusted by both residential and commercial clients.
                </p>
                <p className="about-page__paragraph">
                  We started by solving everyday waste problems for local customers, but we quickly realised the need for a more consistent and reliable service across the country.
                  That's when we expanded our reach and built a network that now covers the entire UK.
                </p>
                <p className="about-page__paragraph">
                  Even as we've grown, we've stayed focused on what matters most: fast response times, honest pricing, and responsible disposal practices that reduce environmental impact.
                </p>
                <ActionButtonsRow items={heroActions} bookingLinks={bookingLinks} className="about-page__inline-actions" />
              </div>

              <div className="about-page__story-image-wrap">
                <img src="/images/rocket/Story_Image.jpg" alt="Rocket Rubbish team story" className="about-page__story-image" />
              </div>
            </div>
          </div>
        </section>

        <section className="about-page__coverage-band">
          <div className="page-shell about-page__coverage-grid">
            <div className="about-page__coverage-map-wrap">
              <img src="/images/rocket/Map_image.jpg" alt="Rocket Rubbish UK map" className="about-page__coverage-map" />
            </div>
            <div className="about-page__coverage-copy">
              <h2 className="about-page__section-title about-page__section-title--light">Complete Rubbish Clearance Services Across The UK</h2>
              <p className="about-page__coverage-text">
                We have grown into a nationwide rubbish removal company proudly serving customers across the entire UK.
                Our expansion allows us to bring the same level of speed, reliability, and professionalism to homes, businesses, and construction sites in cities, towns, and rural areas alike.
              </p>
              <p className="about-page__coverage-text">
                We understand that waste management needs are not limited to one location, which is why we have developed a flexible and scalable service network.
                This ensures that no matter where you are based, you can access fast and efficient rubbish removal without compromise on quality.
              </p>
              <p className="about-page__coverage-text">
                From busy urban centres to smaller communities, our team is committed to delivering a consistent, hassle-free experience.
                Every job we take on is handled with care, efficiency, and a strong focus on responsible disposal practices.
              </p>
            </div>
          </div>
        </section>

        <section className="about-page__features">
          <div className="page-shell about-page__features-grid">
            <div className="about-page__features-copy">
              <p className="section-eyebrow">Why Rocket Rubbish</p>
              <h2 className="about-page__section-title">Not Just A Van Service A Smarter Way To Clear Rubbish</h2>
              <div className="about-page__feature-list">
                {featureCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="about-page__feature-card">
                      <div className="about-page__feature-icon"><Icon size={18} /></div>
                      <div>
                        <h3 className="about-page__feature-title">{item.title}</h3>
                        <p className="about-page__feature-text">{item.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <ActionButtonsRow items={heroActions} bookingLinks={bookingLinks} className="about-page__inline-actions" />
            </div>

            <div className="about-page__features-visual">
              <p className="about-page__features-intro">We go beyond simple collection with fast response, easy booking, and responsible disposal, making rubbish removal smooth and stress-free.</p>
              <div className="about-page__features-image-frame">
                <img src="/images/rocket/Rectangle_29.jpg" alt="Rocket Rubbish team" className="about-page__features-image" />
              </div>
              <div className="about-page__floating-card">
                <p className="about-page__floating-value">1,100+</p>
                <div className="about-page__floating-copy">
                  <p>Towns & Cities</p>
                  <p>Across The UK</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-page__sustainability">
          <div className="page-shell about-page__sustainability-inner">
            <h2 className="about-page__section-title">Our Commitment To Sustainability</h2>
            <p className="about-page__paragraph about-page__paragraph--center">
              At Rocket Rubbish, we know that making rubbish removal environmentally responsible doesn&apos;t just collect waste - we ensure it is handled in a way that reduces environmental impact and supports a more sustainable future.
            </p>
            <p className="about-page__paragraph about-page__paragraph--center">
              Every load we collect is carefully sorted, separating recyclable and reusable materials from general waste. We work closely with licensed recycling centres to ensure that as much waste as possible is diverted away from landfill. Items that are still in usable condition are prioritised for reuse or donation, helping to reduce unnecessary waste and support the community.
            </p>
            <p className="about-page__paragraph about-page__paragraph--center">
              As we continue to grow across the UK, our commitment to sustainability remains a key priority. We believe that efficient rubbish removal should never come at the cost of the environment.
            </p>
          </div>
        </section>

        <section className="about-page__booking-cta">
          <div className="page-shell about-page__booking-cta-inner">
            <div className="about-page__booking-cta-copy">
              <h2 className="about-page__booking-cta-title">Book Your Rubbish Removal Now</h2>
              <p className="about-page__booking-cta-text">
                Book your rubbish removal now and choose a service that prioritises recycling and responsible disposal while keeping your home or business clutter-free.
              </p>
              <ActionButtonsRow items={bookingCtaActions} bookingLinks={bookingLinks} className="about-page__booking-cta-actions shared-bottom-cta__actions shared-bottom-cta__buttons" />
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}



