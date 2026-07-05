
const actionConfig = {
  phone: {
    label: "0800 123 4567",
    icon: "/images/rocket/call.svg",
    href: (bookingLinks) => bookingLinks.phone
  },
  whatsapp: {
    label: "WhatsApp Us Now",
    icon: "/images/rocket/whatsapp-fill.svg",
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
        const label = item.label || bookingLinks?.[`${item.key}Label`] || config.label;
        const Icon = item.iconImage || config.icon;

        return (
          <a key={`${item.key}-${label}`} href={href} className="action-buttons-row__button">
            {typeof Icon === "string" ? (
              <img src={Icon} alt="" className="action-buttons-row__icon-image" width="20" height="20" />
            ) : (
              <Icon size={15} />
            )}
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}
