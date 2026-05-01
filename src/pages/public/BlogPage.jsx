import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import { buildApiUrl } from "../../lib/api";
import { bookingLinks } from "../../data/homeContent";
import "./BlogPage.css";

const actionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      try {
        const response = await fetch(buildApiUrl("/api/public/blog-posts"));
        const data = await response.json();

        if (!ignore && response.ok && data.ok) {
          setBlogPosts(data.posts || []);
        }
      } catch {
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="blog-page">
        <section className="blog-page__hero">
          <div className="page-shell blog-page__hero-inner">
            <div className="blog-page__hero-copy">
              <h1 className="blog-page__hero-title">Blog</h1>
              <p className="blog-page__hero-text">
                Welcome to our blog, your go-to resource for everything related to rubbish removal, waste collection,
                rubbish clearance, junk removal, and responsible waste disposal.
              </p>

              <ActionButtonsRow items={actionItems} bookingLinks={bookingLinks} className="blog-page__hero-actions" />
            </div>
          </div>
        </section>

        <section className="blog-page__breadcrumb-wrap">
          <div className="page-shell">
            <p className="blog-page__breadcrumb">Home &nbsp;&gt;&nbsp; Blog</p>
          </div>
        </section>

        <section className="blog-page__listing">
          <div className="page-shell">
            <div className="blog-page__head">
              <h2 className="blog-page__section-title">Tips, Advice &amp; Guides For Easy Rubbish Removal</h2>
              <p className="blog-page__section-text">
                From home cleanouts to garden waste and bulky junk, our blog covers everything related to rubbish
                clearance, waste collection, and responsible junk removal.
              </p>
            </div>

            <div className="blog-page__grid">
              {blogPosts.map((post) => (
                <article key={post.id} className="blog-page__card">
                  <div className="blog-page__card-image-wrap">
                    <img src={post.cardImage || post.featuredImage} alt={post.title} className="blog-page__card-image" />
                  </div>

                  <div className="blog-page__card-body">
                    <div className="blog-page__card-meta">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="blog-page__card-title">{post.title}</h3>
                    <p className="blog-page__card-text">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-page__card-link">
                      <span>Read More</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="blog-page__pagination">
              <button type="button" className="blog-page__page-dot blog-page__page-dot--active">
                01
              </button>
              <button type="button" className="blog-page__page-dot">
                02
              </button>
              <button type="button" className="blog-page__page-dot">
                03
              </button>
            </div>
          </div>
        </section>

        <SharedBottomCtaSection
          title="Ready To Clear Your Space?"
          text="Book your trusted rubbish clearance today and let our professionals handle the heavy lifting."
        />

        <SiteFooter />
      </main>
    </>
  );
}
