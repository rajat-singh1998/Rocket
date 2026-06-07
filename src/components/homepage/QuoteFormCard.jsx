function ChoiceCard({ item, selected, onClick }) {
  return (
    <button type="button" className={`home-choice-card ${selected ? "home-choice-card--active" : ""}`} onClick={onClick}>
      <div className="home-choice-card__image-wrap">
        <img src={item.image} alt={item.alt} className="home-choice-card__image" />
      </div>
      <h3 className="home-choice-card__title">{item.title}</h3>
      <p className="home-choice-card__description">{item.description}</p>
    </button>
  );
}

export default function QuoteFormCard({
  content,
  clearingOptions,
  quoteForm,
  setQuoteForm,
  quoteError,
  quoteMessage,
  handleQuoteSubmit
}) {
  return (
    <form onSubmit={handleQuoteSubmit} className="home-quote-card">
      <h2 className="home-quote-card__title">{content.title}</h2>
      <div className="home-quote-card__choice-grid">
        {clearingOptions.map((item) => (
          <ChoiceCard
            key={item.title}
            item={item}
            selected={quoteForm.clearing === item.title}
            onClick={() => setQuoteForm((current) => ({ ...current, clearing: item.title }))}
          />
        ))}
      </div>

      {quoteError ? <p className="status-note status-note-error">{quoteError}</p> : null}
      {quoteMessage ? <p className="status-note status-note-success">{quoteMessage}</p> : null}

      <button type="submit" className="home-quote-card__submit">
        {content.submitLabel}
      </button>
    </form>
  );
}
