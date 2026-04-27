import { BadgePoundSterling, CalendarDays, Leaf, MapPin, Recycle } from "lucide-react";

const tickerIcons = {
  leaf: Leaf,
  recycle: Recycle,
  map: MapPin,
  calendar: CalendarDays,
  price: BadgePoundSterling
};

export default function TickerSection({ tickerItems }) {
  const loopItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <section className="home-ticker">
      <div className="home-ticker__viewport">
        <div className="home-ticker__track">
          {loopItems.map((item, index) => {
            const Icon = tickerIcons[item.icon];

            return (
              <div key={`${item.label}-${index}`} className="home-ticker__item">
                <Icon size={14} className="home-ticker__icon" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
