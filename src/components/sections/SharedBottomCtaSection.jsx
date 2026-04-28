import ActionButtonsRow from "../shared/ActionButtonsRow";
import { bookingLinks } from "../../data/homeContent";
import "./SharedBottomCtaSection.css";

const bottomActionItems = [
  { key: "phone", iconImage: "/images/rocket/callg.svg" },
  { key: "whatsapp", iconImage: "/images/rocket/whatsapp-fillg.svg" },
  { key: "bookNow", iconImage: "/images/rocket/calenderg.svg" }
];

export default function SharedBottomCtaSection({
  title = "Ready To Clear Your Space?",
  text = "Book your trusted rubbish clearance today and let our professionals handle the heavy lifting.",
  className = ""
}) {
  return (
    <section className={`shared-bottom-cta ${className}`.trim()}>
      <div className="page-shell shared-bottom-cta__inner">
        <h2 className="shared-bottom-cta__title">{title}</h2>
        <p className="shared-bottom-cta__text">{text}</p>
        <ActionButtonsRow
          items={bottomActionItems}
          bookingLinks={bookingLinks}
          className="shared-bottom-cta__actions"
        />
      </div>
    </section>
  );
}
