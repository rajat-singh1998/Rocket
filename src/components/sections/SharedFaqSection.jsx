import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../../data/homeContent";
import "./SharedContentSections.css";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <article className={`shared-faq-item ${isOpen ? "shared-faq-item--open" : ""}`}>
      <button type="button" className="shared-faq-item__summary" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.question}</span>
        <ChevronDown size={18} className={`shared-faq-item__icon ${isOpen ? "shared-faq-item__icon--open" : ""}`} />
      </button>
      {isOpen ? <p className="shared-faq-item__answer">{item.answer}</p> : null}
    </article>
  );
}

export default function SharedFaqSection({
  items = faqs,
  eyebrow = "Got Questions?",
  title = "Frequently Asked Questions",
  description = "Everything you need to know about the service, pricing, and coverage.",
  defaultOpenIndex = 0,
  leftColumnCount
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(defaultOpenIndex);

  useEffect(() => {
    setOpenFaqIndex(defaultOpenIndex);
  }, [items, defaultOpenIndex]);

  const splitIndex = typeof leftColumnCount === "number"
    ? Math.max(0, Math.min(leftColumnCount, items.length))
    : Math.ceil(items.length / 2);

  const leftFaqs = items.slice(0, splitIndex);
  const rightFaqs = items.slice(splitIndex);

  return (
    <section className="shared-faq">
      <div className="page-shell">
        <div className="shared-faq__head">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
          <p className="shared-faq__text">{description}</p>
        </div>

        <div className="shared-faq__list">
          <div className="shared-faq__column">
            {leftFaqs.map((item, index) => (
              <FaqItem
                key={item.question}
                item={item}
                isOpen={openFaqIndex === index}
                onToggle={() => setOpenFaqIndex((current) => (current === index ? -1 : index))}
              />
            ))}
          </div>

          <div className="shared-faq__column">
            {rightFaqs.map((item, index) => {
              const originalIndex = splitIndex + index;

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
