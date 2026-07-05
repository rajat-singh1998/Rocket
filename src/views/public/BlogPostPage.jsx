import { ArrowRight, ChevronDown, FolderOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "../../lib/router";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import PageSeo, { buildBreadcrumbSchema } from "../../components/seo/PageSeo";
import { buildApiUrl } from "../../lib/api";

function HtmlBlock({ className, html, fallbackText }) {
  if (html) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return fallbackText ? <p className={className}>{fallbackText}</p> : null;
}

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadPost() {
      try {
        const response = await fetch(buildApiUrl(`/api/public/blog-posts/${slug}`));
        const data = await response.json();

        if (!ignore && response.ok && data.ok) {
          setPost(data.post || null);
          setPosts(data.posts || []);
        }
      } catch {
        if (!ignore) {
          setPost(null);
          setPosts([]);
        }
      }
    }

    loadPost();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const categories = useMemo(() => {
    return [...new Set(posts.map((item) => item.category).filter(Boolean))];
  }, [posts]);

  const popularPosts = useMemo(() => {
    return posts.filter((item) => item.slug !== slug).slice(0, 4);
  }, [posts, slug]);

  const tags = post?.tags || [];
  const faqItems = Array.isArray(post?.faqItems)
    ? post.faqItems.filter((item) => item.question && item.answer)
    : [];
  const faqSplitIndex = Math.ceil(faqItems.length / 2);
  const leftFaqItems = faqItems.slice(0, faqSplitIndex);
  const rightFaqItems = faqItems.slice(faqSplitIndex);

  if (!post) {
    return (
      <>
        <PageSeo
          title="Blog Post Not Found"
          description="The requested Rocket Rubbish blog post could not be found."
          path={`/blog/${slug}`}
          robots="noindex,follow"
        />
        <SiteHeader />
        <main className="blog-post-page">
          <section className="blog-post-page__content">
            <div className="page-shell">
              <p className="blog-post-page__intro">Post not found.</p>
            </div>
          </section>
          <SiteFooter />
        </main>
      </>
    );
  }

  return (
    <>
      <PageSeo
        title={post.title}
        description={post.excerpt || post.intro}
        path={`/blog/${post.slug}`}
        image={post.heroImage || post.featuredImage || post.cardImage}
        type="article"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt || post.intro,
            image: [`https://www.rocketrubbishremoval.co.uk${post.heroImage || post.featuredImage || post.cardImage}`],
            author: {
              "@type": "Person",
              name: post.author
            },
            publisher: {
              "@type": "Organization",
              name: "Rocket Rubbish Removal",
              logo: {
                "@type": "ImageObject",
                url: "https://www.rocketrubbishremoval.co.uk/images/rocket/logo_h.svg"
              }
            },
            datePublished: post.date,
            mainEntityOfPage: `https://www.rocketrubbishremoval.co.uk/blog/${post.slug}`
          },
          faqItems.length
            ? {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer
                  }
                }))
              }
            : null,
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ])
        ].filter(Boolean)}
      />
      <SiteHeader />
      <main className="blog-post-page">
        <section className="blog-post-page__content">
          <div className="page-shell blog-post-page__grid">
            <article className="blog-post-page__article">
              <div className="blog-post-page__featured-wrap">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="blog-post-page__featured-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="blog-post-page__meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>

              <h1 className="blog-post-page__title">{post.title}</h1>
              <HtmlBlock className="blog-post-page__intro blog-post-page__rich-text" html={post.introHtml} fallbackText={post.intro} />

              {post.contentHtml ? (
                <section className="blog-post-page__section">
                  <div className="blog-post-page__rich-text" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                </section>
              ) : (
                <>
                  <section className="blog-post-page__section">
                    <h3 className="blog-post-page__section-title">{post.sectionOneTitle}</h3>
                    {post.sectionOneBodyHtml ? (
                      <div className="blog-post-page__rich-text" dangerouslySetInnerHTML={{ __html: post.sectionOneBodyHtml }} />
                    ) : (
                      post.sectionOneParagraphs?.map((paragraph) => (
                        <p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
                      ))
                    )}
                  </section>

                  <section className="blog-post-page__section">
                    <h3 className="blog-post-page__section-title">{post.sectionTwoTitle}</h3>
                    {post.sectionTwoBodyHtml ? (
                      <div className="blog-post-page__rich-text" dangerouslySetInnerHTML={{ __html: post.sectionTwoBodyHtml }} />
                    ) : (
                      post.sectionTwoParagraphs?.map((paragraph) => (
                        <p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
                      ))
                    )}

                    {post.sectionTwoChecklistTitle ? <h4 className="blog-post-page__subheading">{post.sectionTwoChecklistTitle}</h4> : null}

                    {post.sectionTwoImage ? (
                      <div className="blog-post-page__split-block">
                        <ul className="blog-post-page__checklist">
                          {(post.sectionTwoChecklist || []).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <div className="blog-post-page__inline-image-wrap">
                          <img
                            src={post.sectionTwoImage}
                            alt={post.sectionTwoTitle}
                            className="blog-post-page__inline-image"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    ) : post.sectionTwoChecklist?.length ? (
                      <ul className="blog-post-page__checklist blog-post-page__checklist--stacked">
                        {post.sectionTwoChecklist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>

                  {post.quoteHtml || post.quoteText ? (
                    <div className="blog-post-page__quote-box">
                      <HtmlBlock className="blog-post-page__quote-text blog-post-page__rich-text" html={post.quoteHtml} fallbackText={post.quoteText} />
                      <p className="blog-post-page__quote-author">{post.quoteAuthor}</p>
                    </div>
                  ) : null}

                  <section className="blog-post-page__section">
                    <h3 className="blog-post-page__section-title">{post.sectionThreeTitle}</h3>
                    {post.sectionThreeBodyHtml ? (
                      <div className="blog-post-page__rich-text" dangerouslySetInnerHTML={{ __html: post.sectionThreeBodyHtml }} />
                    ) : (
                      post.sectionThreeParagraphs?.map((paragraph) => (
                        <p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
                      ))
                    )}
                    {post.sectionThreeChecklistTitle ? <h4 className="blog-post-page__subheading">{post.sectionThreeChecklistTitle}</h4> : null}
                    {post.sectionThreeChecklist?.length ? (
                      <ul className="blog-post-page__checklist blog-post-page__checklist--stacked">
                        {post.sectionThreeChecklist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                </>
              )}

              {faqItems.length ? (
                <section className="blog-post-page__faq-section">
                  <div className="blog-post-page__faq-head">
                    <h2>Frequently Asked Questions</h2>
                    <p>Everything you need to know about the service, pricing, and coverage.</p>
                  </div>
                  <div className="blog-post-page__faq-list">
                    <div className="blog-post-page__faq-column">
                      {leftFaqItems.map((item, index) => (
                        <article className={`blog-post-page__faq-item ${openFaqIndex === index ? "blog-post-page__faq-item--open" : ""}`} key={`${item.question}-${index}`}>
                          <button type="button" className="blog-post-page__faq-summary" onClick={() => setOpenFaqIndex((current) => (current === index ? -1 : index))} aria-expanded={openFaqIndex === index}>
                            <span>{item.question}</span>
                            <ChevronDown size={16} className={`blog-post-page__faq-icon ${openFaqIndex === index ? "blog-post-page__faq-icon--open" : ""}`} />
                          </button>
                          {openFaqIndex === index ? <p className="blog-post-page__faq-answer">{item.answer}</p> : null}
                        </article>
                      ))}
                    </div>
                    <div className="blog-post-page__faq-column">
                      {rightFaqItems.map((item, index) => {
                        const originalIndex = faqSplitIndex + index;

                        return (
                          <article className={`blog-post-page__faq-item ${openFaqIndex === originalIndex ? "blog-post-page__faq-item--open" : ""}`} key={`${item.question}-${originalIndex}`}>
                            <button type="button" className="blog-post-page__faq-summary" onClick={() => setOpenFaqIndex((current) => (current === originalIndex ? -1 : originalIndex))} aria-expanded={openFaqIndex === originalIndex}>
                              <span>{item.question}</span>
                              <ChevronDown size={16} className={`blog-post-page__faq-icon ${openFaqIndex === originalIndex ? "blog-post-page__faq-icon--open" : ""}`} />
                            </button>
                            {openFaqIndex === originalIndex ? <p className="blog-post-page__faq-answer">{item.answer}</p> : null}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ) : null}
            </article>

            <aside className="blog-post-page__sidebar">
              <section className="blog-post-page__panel">
                <h3 className="blog-post-page__panel-title">Categories</h3>
                <div className="blog-post-page__category-list">
                  {categories.map((category) => (
                    <Link
                      to={`/blog?category=${encodeURIComponent(category)}`}
                      key={category}
                      className={`blog-post-page__category-item ${category === post.category ? "blog-post-page__category-item--active" : ""}`}
                    >
                      <span className="blog-post-page__category-main">
                        <FolderOpen size={16} className="blog-post-page__category-icon" />
                        <span>{category}</span>
                      </span>
                      <ArrowRight size={14} className="blog-post-page__category-arrow" />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="blog-post-page__panel">
                <div className="blog-post-page__panel-head">
                  <h3 className="blog-post-page__panel-title">Popular Post</h3>
                  <Link to="/blog" className="blog-post-page__panel-link">View all</Link>
                </div>
                <div className="blog-post-page__popular-list">
                  {popularPosts.map((item) => (
                    <Link key={item.id} to={`/blog/${item.slug}`} className="blog-post-page__popular-item">
                      <p className="blog-post-page__popular-meta">{item.author}   {item.date}</p>
                      <h4 className="blog-post-page__popular-title">{item.title}</h4>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="blog-post-page__panel">
                <h3 className="blog-post-page__panel-title">All Tags</h3>
                <div className="blog-post-page__tags">
                  {tags.map((tag) => (
                    <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="blog-post-page__tag">{tag}</Link>
                  ))}
                </div>
              </section>
            </aside>
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
