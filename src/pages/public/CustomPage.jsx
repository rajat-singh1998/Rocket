import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import SharedTestimonialsSection from "../../components/sections/SharedTestimonialsSection";
import SharedFaqSection from "../../components/sections/SharedFaqSection";
import { buildApiUrl } from "../../lib/api";
import "./CustomPage.css";

export default function CustomPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(buildApiUrl(`/api/public/pages/${slug}`));
        const data = await response.json();

        if (ignore) {
          return;
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Page not found.");
        }

        setPage(data.page);
      } catch (loadError) {
        setError(loadError.message || "Page not found.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      ignore = true;
    };
  }, [slug]);

  return (
    <>
      <SiteHeader />
      <main className="custom-page">
        <section className="custom-page__hero">
          <div className="page-shell custom-page__hero-inner">
            {loading ? (
              <div className="custom-page__state">Loading page...</div>
            ) : error ? (
              <div className="custom-page__state">
                <h1>Page Not Found</h1>
                <p>{error}</p>
                <Link to="/" className="custom-page__back-link">Back To Home</Link>
              </div>
            ) : (
              <>
                <p className="section-eyebrow">Custom Page</p>
                <h1 className="custom-page__title">{page.title || page.name}</h1>
              </>
            )}
          </div>
        </section>

        {!loading && !error ? (
          <section className="custom-page__content-section">
            <div className="page-shell custom-page__content-shell">
              {page.sections?.map((section, index) => (
                <article key={`${page.id}-${index}`} className="custom-page__section-block">
                  <h2 className="custom-page__section-title">{section.heading}</h2>
                  <p className="custom-page__paragraph">{section.content}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {!loading && !error ? <SharedTestimonialsSection /> : null}
        {!loading && !error ? <SharedFaqSection /> : null}

        <SiteFooter />
      </main>
    </>
  );
}
