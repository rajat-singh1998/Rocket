import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import { buildApiUrl } from "../../lib/api";
import "./LocationsPage.css";

const fallbackLocations = [
  { id: "london", name: "London", slug: "london" }
];

function groupLocationsByLetter(locations) {
  return locations.reduce((groups, location) => {
    const firstLetter = location.name.trim().charAt(0).toUpperCase();
    const letter = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";

    if (!groups[letter]) {
      groups[letter] = [];
    }

    groups[letter].push(location);
    return groups;
  }, {});
}

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadLocations() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(buildApiUrl("/api/public/city-pages"));
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Unable to load locations.");
        }

        if (!ignore) {
          setLocations(data.pages || []);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Unable to load locations.");
          setLocations(fallbackLocations);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadLocations();

    return () => {
      ignore = true;
    };
  }, []);

  const groupedLocations = useMemo(() => groupLocationsByLetter(locations), [locations]);
  const letters = useMemo(() => Object.keys(groupedLocations).sort(), [groupedLocations]);

  return (
    <>
      <SiteHeader />
      <main className="locations-page">
        <section className="locations-page__hero">
          <img src="/images/rocket/generic-uk-residential-banner-mobile.jpg" alt="" className="locations-page__hero-mobile-image" aria-hidden="true" />
          <div className="page-shell locations-page__hero-inner">
            <p className="section-eyebrow">UK Locations</p>
            <h1 className="locations-page__title">Rubbish Removal Locations</h1>
            <p className="locations-page__subtitle">
              Find your local Rocket Rubbish removal page. Locations are sorted alphabetically so you can quickly open the right city page.
            </p>
          </div>
        </section>

        <section className="locations-page__content">
          <div className="page-shell">
            <div className="locations-page__summary">
              <p>{isLoading ? "Loading locations..." : `${locations.length.toLocaleString()} locations covered across the UK.`}</p>
              {error ? <span>{error}</span> : null}
            </div>

            {letters.length > 0 ? (
              <nav className="locations-page__letters" aria-label="Location letters">
                {letters.map((letter) => (
                  <a key={letter} href={`#locations-${letter}`} className="locations-page__letter-link">
                    {letter}
                  </a>
                ))}
              </nav>
            ) : null}

            <div className="locations-page__groups">
              {letters.map((letter) => (
                <section key={letter} id={`locations-${letter}`} className="locations-page__group">
                  <h2 className="locations-page__group-title">{letter}</h2>
                  <div className="locations-page__grid">
                    {groupedLocations[letter].map((location) => (
                      <Link key={location.id || location.slug} to={`/cities/${location.slug}`} className="locations-page__link">
                        <span>{location.name}</span>
                        {location.regionName ? <small>{location.regionName}</small> : null}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <SharedBottomCtaSection
          title="Need Rubbish Cleared Today?"
          text="Choose your nearest location and book a fast, licensed rubbish removal collection."
        />
      </main>
      <SiteFooter />
    </>
  );
}
