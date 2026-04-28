import "./ActionButtonsRow.css";

const actionConfig = {
  phone: {
    label: "0800 123 4567",
    icon: "/images/rocket/call.svg",
    href: (bookingLinks) => bookingLinks.phone
  },
  whatsapp: {
    label: "WhatsApp Us Now",
    icon: "/images/rocket/whatsapp-fill.png",
    href: (bookingLinks) => bookingLinks.whatsapp
  },
  bookNow: {
    label: "Book Online Now",
    icon: "/images/rocket/calender.svg",
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

        const href = item.href || config.href(bookingLinks);
        const label = item.label || config.label;

        return (
          <a key={`${item.key}-${label}`} href={href} className="action-buttons-row__button">
            {typeof config.icon === "string" ? (
              <img src={config.icon} alt="" className="action-buttons-row__icon-image" />
            ) : (
              <config.icon size={15} />
            )}
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}
