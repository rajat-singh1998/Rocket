import { Star } from "lucide-react";

function TestimonialCard({ item }) {
  return (
    <article className="home-testimonial-card">
      <div className="home-testimonial-card__brand">
        <div className="home-testimonial-card__trustpilot">
          <Star size={14} fill="currentColor" className="home-testimonial-card__trustpilot-star" />
          <span>Trustpilot</span>
        </div>
        <div className="home-testimonial-card__rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="home-testimonial-card__rating-box">
              <Star size={9} fill="currentColor" />
            </span>
          ))}
        </div>
      </div>
      <p className="home-testimonial-card__quote">&quot;{item.quote}&quot;</p>
      <div className="home-testimonial-card__meta">
        <span className="home-testimonial-card__author">{item.author}</span>
        <span className="home-testimonial-card__time">{item.time}</span>
      </div>
    </article>
  );
}

export default function TestimonialsSection({ section, testimonials, testimonialSlideIndex, onSlideChange }) {
  const visibleTestimonials = testimonials.map((_, index) => testimonials[(testimonialSlideIndex + index) % testimonials.length]);

  return (
    <section className="home-testimonials">
      <div className="page-shell">
        <div className="home-section-head home-section-head--centered">
          <img src={section.logo} alt="Trustpilot" className="home-testimonials__logo" />
          <h2 className="section-title home-testimonials__title">{section.title}</h2>
          <p className="home-section-head__text">{section.description}</p>
        </div>

        <div className="home-testimonials__grid">
          {visibleTestimonials.map((item, index) => (
            <TestimonialCard key={`${item.author}-${index}`} item={item} />
          ))}
        </div>

        <div className="home-testimonials__dots">
          {testimonials.map((item, index) => (
            <button
              key={item.author}
              type="button"
              className={`home-testimonials__dot ${testimonialSlideIndex === index ? "home-testimonials__dot--active" : ""}`}
              onClick={() => onSlideChange(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
