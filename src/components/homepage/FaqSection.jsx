import { ChevronDown } from "lucide-react";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <article className={`home-faq-item ${isOpen ? "home-faq-item--open" : ""}`}>
      <button type="button" className="home-faq-item__summary" onClick={onToggle}>
        <span>{item.question}</span>
        <ChevronDown size={18} className={`home-faq-item__icon ${isOpen ? "home-faq-item__icon--open" : ""}`} />
      </button>
      {isOpen ? <p className="home-faq-item__answer">{item.answer}</p> : null}
    </article>
  );
}

export default function FaqSection({ section, faqs, openFaqIndex, setOpenFaqIndex }) {
  const leftFaqs = faqs.filter((_, index) => index % 2 === 0);
  const rightFaqs = faqs.filter((_, index) => index % 2 === 1);

  return (
    <section id="faq" className="home-faq">
      <div className="page-shell">
        <div className="home-section-head home-section-head--centered">
          <h2 className="section-title">{section.title}</h2>
          <p className="home-section-head__text">{section.description}</p>
        </div>

        <div className="home-faq__list">
          <div className="home-faq__column">
            {leftFaqs.map((item, index) => {
              const originalIndex = index * 2;

              return (
                <FaqItem
                  key={item.question}
                  item={item}
                  isOpen={openFaqIndex === originalIndex}
                  onToggle={() => setOpenFaqIndex((current) => (current === originalIndex ? -1 : originalIndex))}
                />
              );
            })}
          </div>

          <div className="home-faq__column">
            {rightFaqs.map((item, index) => {
              const originalIndex = index * 2 + 1;

              return (
                <FaqItem
                  key={item.question}
                  item={item}
                  isOpen={openFaqIndex === originalIndex}
                  onToggle={() => setOpenFaqIndex((current) => (current === originalIndex ? -1 : originalIndex))}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
