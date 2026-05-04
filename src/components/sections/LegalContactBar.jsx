import { Mail, MapPin, Phone } from "lucide-react";
import "./LegalContactBar.css";

const items = [
  { label: "0800 123 4567", icon: Phone },
  { label: "hello@rocketrubbish.co.uk", icon: Mail },
  { label: "London, UK", icon: MapPin }
];

export default function LegalContactBar() {
  return (
    <div className="legal-contact-bar">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="legal-contact-bar__item">
            <span className="legal-contact-bar__icon"><Icon size={14} /></span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
