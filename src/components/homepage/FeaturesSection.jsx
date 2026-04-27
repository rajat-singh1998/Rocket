import { BadgePoundSterling, Home, ShieldCheck, Signal, Truck } from "lucide-react";
import ActionButtonsRow from "../shared/ActionButtonsRow";

const featureIcons = {
  truck: Truck,
  pound: BadgePoundSterling,
  shield: ShieldCheck,
  signal: Signal,
  home: Home
};

function FeatureCard({ item }) {
  const Icon = featureIcons[item.icon];

  return (
    <article className="home-feature-card">
      <div className="home-feature-card__icon">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="home-feature-card__title">{item.title}</h3>
        <p className="home-feature-card__description">{item.description}</p>
      </div>
    </article>
  );
}

export default function FeaturesSection({ section, featureCards, bookingLinks }) {
  return (
    <section className="home-features">
      <div className="page-shell home-features__grid">
        <div className="home-features__content">
          <p className="section-eyebrow">Why Rocket Rubbish</p>
          <h2 className="section-title home-features__title">
            {section.title.split("\n").map((line) => (
              <span key={line} className="home-features__title-line">
                {line}
              </span>
            ))}
          </h2>

          <div className="home-features__list">
            {featureCards.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>

          <ActionButtonsRow items={section.actions} bookingLinks={bookingLinks} className="home-action-row home-action-row--features" />
        </div>

        <div className="home-features__visual">
          <p className="home-features__intro">{section.description}</p>
          <div className="home-features__image-frame">
            <img src={section.image} alt="Rocket Rubbish team" className="home-features__image" />
          </div>
          <div className="home-features__floating-card">
            <p className="home-features__floating-value">{section.floatingValue}</p>
            <div className="home-features__floating-copy">
              {section.floatingLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
