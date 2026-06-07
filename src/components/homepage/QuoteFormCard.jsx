import { MapPin } from "lucide-react";

const timingOptions = ["ASAP", "Within a few days", "1 Week+", "Not Sure Yet"];

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

      <div className="home-quote-card__field-group">
        <p className="home-quote-card__field-title">{content.postcodeTitle}</p>
        <label className="home-quote-card__input-wrap">
          <MapPin size={15} className="home-quote-card__input-icon" />
          <input
            type="text"
            value={quoteForm.postcode}
            onChange={(event) => setQuoteForm((current) => ({ ...current, postcode: event.target.value }))}
            placeholder={content.postcodePlaceholder}
            className="home-quote-card__input"
          />
        </label>
      </div>

      <div className="home-quote-card__field-group">
        <p className="home-quote-card__field-title">{content.timingTitle}</p>
        <div className="home-timing-options">
          {timingOptions.map((item) => (
            <button
              key={item}
              type="button"
              className={`home-timing-option ${quoteForm.timing === item ? "home-timing-option--active" : ""}`}
              onClick={() => setQuoteForm((current) => ({ ...current, timing: item }))}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {quoteError ? <p className="status-note status-note-error">{quoteError}</p> : null}
      {quoteMessage ? <p className="status-note status-note-success">{quoteMessage}</p> : null}

      <button type="submit" className="home-quote-card__submit">
        {content.submitLabel}
      </button>
    </form>
  );
}
