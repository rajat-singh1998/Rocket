import { ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle, Upload } from "lucide-react";
import { Link } from "react-router-dom";

function ServiceCard({ item, bookingLinks }) {
  return (
    <article className={`home-service-card ${item.featured ? "home-service-card--featured" : ""}`}>
      <div className="home-service-card__image-wrap">
        <img src={item.image} alt={item.alt} className="home-service-card__image" />
      </div>
      <h3 className="home-service-card__title">{item.title}</h3>
      <p className="home-service-card__description">{item.description}</p>
      <a href={bookingLinks.bookNow} className="home-service-card__button">
        <span>Book Now</span>
        <ArrowUpRight size={15} />
      </a>
    </article>
  );
}

export default function ServicesSection({
  section,
  serviceCards,
  bookingLinks,
  uploadBanner,
  uploadRef,
  uploadedPhotoName,
  handlePhotoChange,
  serviceSlideIndex,
  onPrevious,
  onNext
}) {
  const visibleCards = serviceCards.map((_, index) => serviceCards[(serviceSlideIndex + index) % serviceCards.length]);

  return (
    <section id="services" className="home-services">
      <div className="page-shell">
        <div className="home-services__head">
          <div>
            <h2 className="section-title home-services__title">{section.title}</h2>
            <p className="home-services__text">{section.description}</p>
          </div>
          <Link to="/services" className="home-services__link">
            {section.buttonLabel}
          </Link>
        </div>

        <div className="home-services__grid">
          {visibleCards.map((item, index) => (
            <ServiceCard key={`${item.title}-${index}`} item={item} bookingLinks={bookingLinks} />
          ))}
        </div>

        <div className="home-services__controls">
          <button type="button" className="home-services__control home-services__control--muted" onClick={onPrevious}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="home-services__control home-services__control--active" onClick={onNext}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="home-upload-banner">
          <div className="home-upload-banner__content">
            <h3 className="home-upload-banner__title">{uploadBanner.title}</h3>
            <p className="home-upload-banner__text">{uploadBanner.description}</p>
            <div className="home-upload-banner__actions">
              <input ref={uploadRef} type="file" className="home-upload-banner__file-input" onChange={handlePhotoChange} />
              <button type="button" className="home-upload-banner__button" onClick={() => uploadRef.current?.click()}>
                <Upload size={16} />
                <span>Upload Photos</span>
              </button>
              <a href={bookingLinks.whatsapp} className="home-upload-banner__button">
                <MessageCircle size={16} />
                <span>WhatsApp Us</span>
              </a>
            </div>
            {uploadedPhotoName ? <p className="home-upload-banner__file-name">Selected file: {uploadedPhotoName}</p> : null}
          </div>
          <div className="home-upload-banner__visual">
            <img src={uploadBanner.image} alt="Rocket Rubbish truck" className="home-upload-banner__image" />
          </div>
        </div>
      </div>
    </section>
  );
}
