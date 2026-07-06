import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import ActionButtonsRow from "../shared/ActionButtonsRow";
import { getOptimizedImageUrl } from "../../utils/optimizedImages";

export default function HeroSection({ hero, heroStats, bookingLinks }) {
  const sourceHeroImage = hero.backgroundImage || "/images/rocket/home-page-banner.webp";
  const heroBackgroundImage = getOptimizedImageUrl(sourceHeroImage);
  const heroMobileImage = getOptimizedImageUrl(sourceHeroImage, "mobile");
  const [showMobileHeroImage, setShowMobileHeroImage] = useState(() => {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    const updateMobileHeroImage = () => setShowMobileHeroImage(mediaQuery.matches);

    updateMobileHeroImage();
    mediaQuery.addEventListener("change", updateMobileHeroImage);

    return () => {
      mediaQuery.removeEventListener("change", updateMobileHeroImage);
    };
  }, []);

  return (
    <section className="home-hero" style={{ "--home-hero-bg": `url(${heroBackgroundImage})` }}>
      {showMobileHeroImage ? (
        <img
          src={heroMobileImage}
          alt=""
          aria-hidden="true"
          className="home-hero__priority-image"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width="720"
          height="402"
        />
      ) : null}
      <div className="page-shell home-hero__grid">
        <div className="home-hero__content">
          <p className="home-hero__badge">
            <img src="../images/rocket/hugeicons_security-check.svg" alt="" loading="lazy" decoding="async" fetchPriority="low" />
            {hero.badge}
          </p>
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
                {hero.reviewStrip.starsImage ? (
                  <img
                    src={hero.reviewStrip.starsImage}
                    alt="Five star rating"
                    className="home-hero__review-stars-image"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                ) : (
                  Array.from({ length: hero.reviewStrip.stars || 5 }).map((_, index) => (
                    <span key={index} className="home-hero__review-star-box">
                      <Star size={10} fill="currentColor" />
                    </span>
                  ))
                )}
              </div>
              <span className="home-hero__review-score">{hero.reviewStrip.score}</span>
              {hero.reviewStrip.brand ? (
                <span className="home-hero__review-brand">
                  <img
                    src={hero.reviewStrip.brand}
                    alt="Trustpilot"
                    className="home-hero__review-brand-image"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="home-hero__visual">
          
        </div>
      </div>
    </section>
  );
}
