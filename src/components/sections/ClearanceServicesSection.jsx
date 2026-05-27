import { ArrowUpRight } from "lucide-react";
import ActionButtonsRow from "../shared/ActionButtonsRow";
import { clearanceServiceCards } from "../../data/clearanceServiceCards";
import "./ClearanceServicesSection.css";

export default function ClearanceServicesSection({
  title,
  description,
  bookingLinks,
  actionItems,
  cards = clearanceServiceCards,
  className = "",
  useShell = true
}) {
  const rootClassName = ["clearance-services", className].filter(Boolean).join(" ");

  const sectionContent = (
    <>
      <div className="clearance-services__head clearance-services__head--centered">
        <h2 className="clearance-services__title">{title}</h2>
        {description ? <p className="clearance-services__text">{description}</p> : null}
      </div>

      <div className="clearance-services__grid">
        {cards.map((item) => (
          <article key={item.title} className="clearance-services__card">
            <div className="clearance-services__image-wrap">
              <img src={item.image} alt={item.alt || item.title} className="clearance-services__image" />
            </div>
            <h3 className="clearance-services__card-title">{item.title}</h3>
            <p className="clearance-services__meta">{item.meta}</p>
            <p className="clearance-services__note">{item.note}</p>
            <a href={bookingLinks.bookNow} className="clearance-services__button">
              <span>Book Now</span>
              <ArrowUpRight size={15} />
            </a>
          </article>
        ))}
      </div>

      <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="clearance-services__actions" />
    </>
  );

  if (!useShell) {
    return <div className={rootClassName}>{sectionContent}</div>;
  }

  return (
    <section className={rootClassName}>
      <div className="page-shell">{sectionContent}</div>
    </section>
  );
}
