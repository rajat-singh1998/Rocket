import { Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { testimonials, testimonialsSection } from "../../data/homeContent";
import "./SharedContentSections.css";

const transitionMs = 340;

export default function SharedTestimonialsSection() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [slidePhase, setSlidePhase] = useState("idle");
  const [direction, setDirection] = useState("next");
  const [slideToken, setSlideToken] = useState(0);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const runSlide = (nextIndex) => {
    if (testimonials.length <= 1 || nextIndex === slideIndex) {
      return;
    }

    const nextDirection = nextIndex > slideIndex ? "next" : "prev";

    clearTimers();
    setDirection(nextDirection);
    setSlidePhase("out");

    const swapTimer = window.setTimeout(() => {
      setSlideIndex(nextIndex);
      setSlideToken((current) => current + 1);
      setSlidePhase("in");
    }, transitionMs);

    const resetTimer = window.setTimeout(() => {
      setSlidePhase("idle");
    }, transitionMs * 2 + 120);

    timersRef.current = [swapTimer, resetTimer];
  };

  useEffect(() => {
    if (testimonials.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      runSlide((slideIndex + 1) % testimonials.length);
    }, 4600);

    return () => {
      window.clearInterval(timer);
      clearTimers();
    };
  }, [slideIndex]);

  const visibleTestimonials = useMemo(() => {
    return testimonials.map((_, index) => testimonials[(slideIndex + index) % testimonials.length]);
  }, [slideIndex]);

  return (
    <section className="shared-testimonials">
      <div className="page-shell">
        <div className="shared-testimonials__head">
          <div className="shared-testimonials__brandline">
            <img src="/images/rocket/Trustpilot_Logo.png" alt="Trustpilot" />
          </div>
          <h2 className="shared-testimonials__title">Loved By Thousands Across The UK</h2>
          <p className="shared-testimonials__text">Based On 10,000+ Reviews From Happy Customers</p>
        </div>

        <div className={`shared-testimonials__grid shared-testimonials__grid--${slidePhase} shared-testimonials__grid--${direction}`}>
          {visibleTestimonials.map((item, index) => (
            <article
              key={`${item.author}-${slideToken}-${index}`}
              className={`shared-testimonial-card shared-testimonial-card--${slidePhase} shared-testimonial-card--${direction}`}
              style={{ "--card-delay": `${index * 70}ms` }}
            >
              <div className="shared-testimonial-card__brand">
                <div className="shared-testimonial-card__trustpilot">
                  {testimonialsSection.logo ? (
                    <img
                      src={testimonialsSection.logo}
                      alt="Trustpilot"
                      className="shared-testimonial-card__trustpilot-image"
                    />
                  ) : (
                    <>
                      <Star size={15} fill="currentColor" className="shared-testimonial-card__trustpilot-star" />
                      <span>Trustpilot</span>
                    </>
                  )}
                </div>
                <div className="shared-testimonial-card__rating">
                  {Array.from({ length: 5 }).map((_, ratingIndex) => (
                    <span key={ratingIndex} className="shared-testimonial-card__rating-box">
                      <Star size={10} fill="currentColor" />
                    </span>
                  ))}
                </div>
              </div>
              <p className="shared-testimonial-card__quote">&quot;{item.quote}&quot;</p>
              <div className="shared-testimonial-card__meta">
                <span className="shared-testimonial-card__author">{item.author}</span>
                <span className="shared-testimonial-card__time">{item.time}</span>
              </div>
            </article>
          ))}
        </div>

        {testimonials.length > 1 ? (
          <div className="shared-testimonials__dots">
            {testimonials.map((item, index) => (
              <button
                key={item.author}
                type="button"
                className={`shared-testimonials__dot ${slideIndex === index ? "shared-testimonials__dot--active" : ""}`}
                onClick={() => runSlide(index)}
                aria-label={`Show testimonial slide ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}




