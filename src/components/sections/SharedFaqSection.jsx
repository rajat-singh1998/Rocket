import { useState } from "react";
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

export default function SharedFaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const leftFaqs = faqs.filter((_, index) => index % 2 === 0);
  const rightFaqs = faqs.filter((_, index) => index % 2 === 1);

  return (
    <section className="shared-faq">
      <div className="page-shell">
        <div className="shared-faq__head">
          <p className="section-eyebrow">Got Questions?</p>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="shared-faq__text">Everything you need to know about the service, pricing, and coverage.</p>
        </div>

        <div className="shared-faq__list">
          <div className="shared-faq__column">
            {leftFaqs.map((item, columnIndex) => {
              const originalIndex = columnIndex * 2;

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

          <div className="shared-faq__column">
            {rightFaqs.map((item, columnIndex) => {
              const originalIndex = columnIndex * 2 + 1;

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
