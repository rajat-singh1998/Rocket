import { Star } from "lucide-react";
import ActionButtonsRow from "../shared/ActionButtonsRow";

export default function HeroSection({ hero, heroStats, bookingLinks }) {
  return (
    <section className="home-hero">
      <div className="page-shell home-hero__grid">
        <div className="home-hero__content">
          <p className="home-hero__badge">{hero.badge}</p>
          <h1 className="home-hero__title">
            {hero.headline.split("\n").map((line) => (
              <span key={line} className="home-hero__title-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="home-hero__description">{hero.subheadline}</p>

          <div className="home-hero__stats">
            {heroStats.map((item) => (
              <div key={item.label} className="home-hero__stat">
                <div className="home-hero__stat-value">
                  {item.star ? <Star size={15} fill="currentColor" className="home-hero__stat-star" /> : null}
                  <span>{item.value}</span>
                </div>
                <p className="home-hero__stat-label">{item.label}</p>
              </div>
            ))}
          </div>

           <ActionButtonsRow items={hero.actions} bookingLinks={bookingLinks} className="home-action-row home-action-row--hero" />

          {hero.reviewStrip ? (
            <div className="home-hero__review-strip" aria-label="Trustpilot rating">
              <span className="home-hero__review-text">{hero.reviewStrip.label}</span>
              <div className="home-hero__review-stars">
                {Array.from({ length: hero.reviewStrip.stars || 5 }).map((_, index) => (
                  <span key={index} className="home-hero__review-star-box">
                    <Star size={10} fill="currentColor" />
                  </span>
                ))}
              </div>
              <span className="home-hero__review-score">{hero.reviewStrip.score}</span>
              {hero.reviewStrip.brand ? (
                <span className="home-hero__review-brand">
                  <img
                    src={hero.reviewStrip.brand}
                    alt="Trustpilot"
                    className="home-hero__review-brand-image"
                  />
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="home-hero__visual">
          <img src={hero.backgroundImage} alt="Rocket Rubbish truck" className="home-hero__image" />
        </div>
      </div>
    </section>
  );
}


