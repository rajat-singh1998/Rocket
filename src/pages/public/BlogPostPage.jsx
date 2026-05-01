import { FolderOpen, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import SharedBottomCtaSection from "../../components/sections/SharedBottomCtaSection";
import { buildApiUrl } from "../../lib/api";
import "./BlogPostPage.css";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);

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

  if (!post) {
    return (
      <>
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
      <SiteHeader />
      <main className="blog-post-page">
        <section className="blog-post-page__hero" style={{ backgroundImage: `linear-gradient(rgba(25, 33, 20, 0.58), rgba(25, 33, 20, 0.58)), url(${post.heroImage})` }}>
          <div className="page-shell blog-post-page__hero-inner">
            <h1 className="blog-post-page__hero-title">{post.title}</h1>
          </div>
        </section>

        <section className="blog-post-page__content">
          <div className="page-shell blog-post-page__grid">
            <article className="blog-post-page__article">
              <div className="blog-post-page__featured-wrap">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="blog-post-page__featured-image"
                />
              </div>

              <div className="blog-post-page__meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>

              <h2 className="blog-post-page__title">{post.title}</h2>
              <p className="blog-post-page__intro">{post.intro}</p>

              <section className="blog-post-page__section">
                <h3 className="blog-post-page__section-title">{post.sectionOneTitle}</h3>
                {post.sectionOneParagraphs?.map((paragraph) => (
                  <p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
                ))}
              </section>

              <section className="blog-post-page__section">
                <h3 className="blog-post-page__section-title">{post.sectionTwoTitle}</h3>
                {post.sectionTwoParagraphs?.map((paragraph) => (
                  <p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
                ))}

                {post.sectionTwoChecklistTitle ? <h4 className="blog-post-page__subheading">{post.sectionTwoChecklistTitle}</h4> : null}

                {post.sectionTwoImage ? (
                  <div className="blog-post-page__split-block">
                    <ul className="blog-post-page__checklist">
                      {(post.sectionTwoChecklist || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="blog-post-page__inline-image-wrap">
                      <img src={post.sectionTwoImage} alt={post.sectionTwoTitle} className="blog-post-page__inline-image" />
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

              {post.quoteText ? (
                <div className="blog-post-page__quote-box">
                  <p className="blog-post-page__quote-text">{post.quoteText}</p>
                  <p className="blog-post-page__quote-author">{post.quoteAuthor}</p>
                </div>
              ) : null}

              <section className="blog-post-page__section">
                <h3 className="blog-post-page__section-title">{post.sectionThreeTitle}</h3>
                {post.sectionThreeParagraphs?.map((paragraph) => (
                  <p key={paragraph} className="blog-post-page__paragraph">{paragraph}</p>
                ))}
                {post.sectionThreeChecklistTitle ? <h4 className="blog-post-page__subheading">{post.sectionThreeChecklistTitle}</h4> : null}
                {post.sectionThreeChecklist?.length ? (
                  <ul className="blog-post-page__checklist blog-post-page__checklist--stacked">
                    {post.sectionThreeChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </article>

            <aside className="blog-post-page__sidebar">
              <section className="blog-post-page__panel">
                <h3 className="blog-post-page__panel-title">Categories</h3>
                <div className="blog-post-page__category-list">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`blog-post-page__category-item ${category === post.category ? "blog-post-page__category-item--active" : ""}`}
                    >
                      <span className="blog-post-page__category-main">
                        <FolderOpen size={16} className="blog-post-page__category-icon" />
                        <span>{category}</span>
                      </span>
                      <ArrowRight size={14} className="blog-post-page__category-arrow" />
                    </button>
                  ))}
                </div>
              </section>

              <section className="blog-post-page__panel">
                <div className="blog-post-page__panel-head">
                  <h3 className="blog-post-page__panel-title">Popular Post</h3>
                  <a href="/blog" className="blog-post-page__panel-link">View all</a>
                </div>
                <div className="blog-post-page__popular-list">
                  {popularPosts.map((item) => (
                    <article key={item.id} className="blog-post-page__popular-item">
                      <p className="blog-post-page__popular-meta">{item.author}   {item.date}</p>
                      <h4 className="blog-post-page__popular-title">{item.title}</h4>
                    </article>
                  ))}
                </div>
              </section>

              <section className="blog-post-page__panel">
                <h3 className="blog-post-page__panel-title">All Tags</h3>
                <div className="blog-post-page__tags">
                  {tags.map((tag) => (
                    <span key={tag} className="blog-post-page__tag">{tag}</span>
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
