import { Clock3, Search } from "lucide-react";

function CoverageCard({ item }) {
  return (
    <article className={`home-coverage-card ${item.wide ? "home-coverage-card--wide" : ""}`}>
      <div>
        <p className="home-coverage-card__value">{item.value}</p>
        <h3 className="home-coverage-card__title">{item.label}</h3>
        <p className="home-coverage-card__description">{item.description}</p>
      </div>
      {item.icon === "clock" ? (
        <div className="home-coverage-card__icon-badge">
          <Clock3 size={28} />
        </div>
      ) : null}
    </article>
  );
}

export default function CoverageSection({
  section,
  coverageStats,
  popularLocations,
  locationSearch,
  setLocationSearch,
  coverageMessage,
  handleCoverageSearch
}) {
  return (
    <section id="coverage" className="home-coverage">
      <div className="page-shell">
        <div className="home-coverage__shell">
          <div className="home-coverage__grid">
            <div className="home-coverage__content">
              <p className="section-eyebrow home-coverage__eyebrow">{section.eyebrow}</p>
              <h2 className="home-coverage__title">
                {section.title.split("\n").map((line) => (
                  <span key={line} className="home-coverage__title-line">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="home-coverage__text">{section.description}</p>

              <form onSubmit={handleCoverageSearch} className="home-coverage__search">
                <div className="home-coverage__search-input-wrap">
                  <Search size={16} className="home-coverage__search-icon" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(event) => setLocationSearch(event.target.value)}
                    placeholder={section.searchPlaceholder}
                    className="home-coverage__search-input"
                  />
                </div>
                <button type="submit" className="home-coverage__search-button">
                  Go
                </button>
              </form>

              {coverageMessage ? <p className="home-coverage__status">{coverageMessage}</p> : null}
            </div>

            <div className="home-coverage__cards">
              {coverageStats.map((item) => (
                <CoverageCard key={item.label} item={item} />
              ))}
            </div>
          </div>

          <div className="home-coverage__locations">
            <div className="home-coverage__divider" />
            <p className="home-coverage__locations-title">{section.locationsTitle}</p>
            <div className="home-coverage__locations-list">
              {popularLocations.map((item) => {
                const isActive = locationSearch.trim() ? locationSearch.trim().toLowerCase() === item.toLowerCase() : item === popularLocations[0];

                return (
                  <button
                    key={item}
                    type="button"
                    className={`home-coverage__location-chip ${isActive ? "home-coverage__location-chip--active" : ""}`}
                    onClick={() => setLocationSearch(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
