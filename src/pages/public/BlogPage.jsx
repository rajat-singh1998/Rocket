import { ArrowRight } from "lucide-react";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import ActionButtonsRow from "../../components/shared/ActionButtonsRow";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import { bookingLinks } from "../../data/homeContent";
import "./BlogPage.css";

const actionItems = [{ key: "phone" }, { key: "whatsapp" }, { key: "bookNow" }];

const blogPosts = [
  {
    title: "How to Choose the Right Rubbish Removal Service in London",
    image: "/images/rocket/quote-photo.jpg",
    excerpt:
      "Choosing a reliable rubbish removal service can be confusing, especially with so many options available. This guide walks you through what to check before booking.",
    date: "20 April 2026"
  },
  {
    title: "Rubbish Clearance vs Skip Hire - Which One Should You Choose?",
    image: "/images/rocket/quote-photo.jpg",
    excerpt:
      "Learn practical ways to manage weekly waste collection more effectively while reducing unnecessary clutter and avoiding overpaying for disposal.",
    date: "20 April 2026"
  },
  {
    title: "Eco-Friendly Waste Disposal: How We Recycle in London",
    image: "/images/rocket/quote-photo.jpg",
    excerpt:
      "Learn practical ways to manage weekly waste collection more effectively while reducing unnecessary clutter at home with better recycling habits.",
    date: "20 April 2026"
  },
  {
    title: "A Simple Guide to Junk Removal for Homes & Offices",
    image: "/images/rocket/quote-photo.jpg",
    excerpt:
      "This guide shares simple strategies for clearing clutter safely and choosing the right collection option for bigger or more awkward loads.",
    date: "20 April 2026"
  },
  {
    title: "Waste Collection Tips: Reduce, Reuse, Declutter Smartly",
    image: "/images/rocket/quote-photo.jpg",
    excerpt:
      "Small routines can make weekly waste management easier. Here are practical ways to stay organised and keep disposal costs under control.",
    date: "20 April 2026"
  },
  {
    title: "How Much Does Rubbish Removal Cost?",
    image: "/images/rocket/quote-photo.jpg",
    excerpt:
      "Understand the cost of rubbish removal so you can plan your clean-up more efficiently and avoid surprise fees on collection day.",
    date: "20 April 2026"
  }
];

export default function BlogPage() {
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
                <article key={post.title} className="blog-page__card">
                  <div className="blog-page__card-image-wrap">
                    <img src={post.image} alt={post.title} className="blog-page__card-image" />
                  </div>

                  <div className="blog-page__card-body">
                    <div className="blog-page__card-meta">
                      <span>Admin - Rocket Rubbish</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="blog-page__card-title">{post.title}</h3>
                    <p className="blog-page__card-text">{post.excerpt}</p>
                    <a href="/" className="blog-page__card-link">
                      <span>Read More</span>
                      <ArrowRight size={14} />
                    </a>
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


