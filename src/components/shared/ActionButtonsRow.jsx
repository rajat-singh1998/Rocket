import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import "./ActionButtonsRow.css";

const actionConfig = {
  phone: {
    label: "0800 123 4567",
    icon: Phone,
    href: (bookingLinks) => bookingLinks.phone
  },
  whatsapp: {
    label: "WhatsApp Us Now",
    icon: MessageCircle,
    href: (bookingLinks) => bookingLinks.whatsapp
  },
  bookNow: {
    label: "Book Online Now",
    icon: CalendarDays,
    href: (bookingLinks) => bookingLinks.bookNow
  }
};

export default function ActionButtonsRow({ items, bookingLinks, className = "" }) {
  return (
    <div className={`action-buttons-row ${className}`.trim()}>
      {items.map((item) => {
        const config = actionConfig[item.key];

        if (!config) {
          return null;
        }

        const Icon = config.icon;
        const href = item.href || config.href(bookingLinks);
        const label = item.label || config.label;

        return (
          <a key={`${item.key}-${label}`} href={href} className="action-buttons-row__button">
            <Icon size={15} />
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}
