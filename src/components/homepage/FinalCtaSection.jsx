import ActionButtonsRow from "../shared/ActionButtonsRow";

export default function FinalCtaSection({ section, bookingLinks }) {
  return (
    <section className="home-final-cta">
      <div className="page-shell home-final-cta__grid">
        <div className="home-final-cta__media">
          <img src={section.image} alt="Rocket Rubbish team loading furniture" className="home-final-cta__image" />
        </div>
        <div className="home-final-cta__content">
          <h2 className="home-final-cta__title">{section.title}</h2>
          <p className="home-final-cta__text">{section.description}</p>
          <ActionButtonsRow items={section.actions} bookingLinks={bookingLinks} className="home-action-row home-action-row--final" />
        </div>
      </div>
    </section>
  );
}
