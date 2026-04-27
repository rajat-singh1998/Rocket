import ActionButtonsRow from "../shared/ActionButtonsRow";

function StepCard({ item }) {
  return (
    <article className="home-step-card">
      <div className="home-step-card__top">
        <img src={item.iconImage} alt="" className="home-step-card__icon-image" />
        <span className="home-step-card__number">{item.number}</span>
      </div>
      <h3 className="home-step-card__title">{item.title}</h3>
      <p className="home-step-card__description">{item.description}</p>
    </article>
  );
}

export default function StepsSection({ section, processSteps, bookingLinks }) {
  return (
    <section id="how-it-works" className="home-steps">
      <div className="page-shell">
        <div className="home-section-head home-section-head--centered">
          <p className="section-eyebrow">{section.eyebrow}</p>
          <h2 className="section-title">{section.title}</h2>
          <p className="home-section-head__text">{section.description}</p>
        </div>

        <div className="home-steps__grid">
          {processSteps.map((item) => (
            <StepCard key={item.number} item={item} />
          ))}
        </div>

        <ActionButtonsRow items={section.actions} bookingLinks={bookingLinks} className="home-action-row home-action-row--steps" />
      </div>
    </section>
  );
}
