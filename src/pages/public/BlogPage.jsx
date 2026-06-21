import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import { buildApiUrl } from "../../lib/api";
import { bookingLinks } from "../../data/homeContent";
import "./BlogPage.css";

const actionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];
const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeTag = searchParams.get("tag") || "";

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

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = !activeCategory || post.category === activeCategory;
      const matchesTag = !activeTag || (post.tags || []).includes(activeTag);
      return matchesCategory && matchesTag;
    });
  }, [activeCategory, activeTag, blogPosts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeTag, blogPosts.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [currentPage, filteredPosts]);

  const listingTitle = activeCategory
    ? `${activeCategory} Articles`
    : activeTag
      ? `Articles Tagged "${activeTag}"`
      : "Tips, Advice & Guides For Easy Rubbish Removal";

  const listingText = activeCategory || activeTag
    ? "Browse the matching blog posts and open any article for the full guide."
    : "From home cleanouts to garden waste and bulky junk, our blog covers everything related to rubbish clearance, waste collection, and responsible junk removal.";

  return (
    <>
      <SiteHeader />
      <main className="blog-page">
        <section className="blog-page__hero">
          <img src="/images/rocket/Rectangle231-fast.jpg" alt="" className="blog-page__hero-mobile-image" aria-hidden="true" />
          <div className="page-shell blog-page__hero-inner">
            <div className="blog-page__hero-copy">
              <h1 className="blog-page__hero-title">Blog's</h1>
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
              <h2 className="blog-page__section-title">{listingTitle}</h2>
              <p className="blog-page__section-text">{listingText}</p>
            </div>

            <div className="blog-page__grid">
              {paginatedPosts.map((post) => (
                <article key={post.id} className="blog-page__card">
                  <Link to={`/blog/${post.slug}`} className="blog-page__card-image-wrap blog-page__card-image-link" aria-label={post.title}>
                    <img
                      src={post.cardImage || post.featuredImage}
                      alt={post.title}
                      className="blog-page__card-image"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>

                  <div className="blog-page__card-body">
                    <div className="blog-page__card-meta">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="blog-page__card-title">
                      <Link to={`/blog/${post.slug}`} className="blog-page__card-title-link">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="blog-page__card-text">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-page__card-link">
                      <span>Read More</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 ? <p className="blog-page__empty-state">No blog posts match this selection.</p> : null}

            {totalPages > 1 ? (
              <div className="blog-page__pagination">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`blog-page__page-dot ${isActive ? "blog-page__page-dot--active" : ""}`}
                      onClick={() => setCurrentPage(pageNumber)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {String(pageNumber).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            ) : null}
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
