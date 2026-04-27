import { ArrowRight, Check, Star } from "lucide-react";

function PricingCard({ item, bookingLinks }) {
  return (
    <article className={`home-pricing-card ${item.featured ? "home-pricing-card--featured" : ""}`}>
      {item.featured ? (
        <div className="home-pricing-card__badge">
          <Star size={12} fill="currentColor" />
          <span>Most Popular</span>
        </div>
      ) : null}
      <div className="home-pricing-card__icon-wrap">
        <img src={item.iconImage} alt="" className="home-pricing-card__icon-image" />
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
            <Check size={15} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a href={bookingLinks.quote} className="home-pricing-card__button">
        <span>Get A Quote</span>
        <ArrowRight size={16} />
      </a>
    </article>
  );
}

export default function PricingSection({ section, pricingPlans, bookingLinks }) {
  return (
    <section id="pricing" className="home-pricing">
      <div className="page-shell">
        <div className="home-section-head home-section-head--centered">
          <p className="section-eyebrow">{section.eyebrow}</p>
          <h2 className="section-title">{section.title}</h2>
          <p className="home-section-head__text">{section.description}</p>
        </div>

        <div className="home-pricing__grid">
          {pricingPlans.map((item) => (
            <PricingCard key={item.title} item={item} bookingLinks={bookingLinks} />
          ))}
        </div>
      </div>
    </section>
  );
}
