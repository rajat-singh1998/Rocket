import ActionButtonsRow from "../shared/ActionButtonsRow";
import QuoteFormCard from "./QuoteFormCard";

export default function BottomQuoteSection({
  section,
  bookingLinks,
  quoteFormContent,
  clearingOptions,
  loadOptions,
  quoteForm,
  setQuoteForm,
  quoteError,
  quoteMessage,
  handleQuoteSubmit
}) {
  return (
    <section className="home-bottom-quote">
      <div className="page-shell home-bottom-quote__grid">
        <div className="home-bottom-quote__content">
          <div className="home-bottom-quote__copy">
            <h2 className="section-title home-bottom-quote__title">
              {section.title.split("\n").map((line) => (
                <span key={line} className="home-bottom-quote__title-line">
                  {line}
                </span>
              ))}
            </h2>
            <p className="home-bottom-quote__text">{section.description}</p>
          </div>

          <ActionButtonsRow items={section.actions} bookingLinks={bookingLinks} className="home-action-row home-action-row--bottom" />

          <div className="home-bottom-quote__visual">
            <img src={section.image} alt="Rocket Rubbish truck" className="home-bottom-quote__image" />
          </div>
        </div>

        <QuoteFormCard
          content={quoteFormContent}
          clearingOptions={clearingOptions}
          loadOptions={loadOptions}
          quoteForm={quoteForm}
          setQuoteForm={setQuoteForm}
          quoteError={quoteError}
          quoteMessage={quoteMessage}
          handleQuoteSubmit={handleQuoteSubmit}
        />
      </div>
    </section>
  );
}
