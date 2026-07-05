import { paragraphsToEditorHtml, richTextToPlainText, textToEditorHtml } from "../../utils/richTextLinks";

export const emptyBlogForm = {
  title: "",
  slug: "",
  category: "Rubbish Removal Tips",
  author: "Admin - Rocket Rubbish",
  date: "20 April 2026",
  status: "Draft",
  featuredImage: "/images/rocket/Post_Image1.png",
  excerpt: "",
  intro: "",
  introHtml: "",
  contentHtml: "",
  faqItems: [],
  sectionOneTitle: "1. Section Title",
  sectionOneParagraphsText: "",
  sectionOneBodyHtml: "",
  sectionTwoTitle: "2. Section Title",
  sectionTwoParagraphsText: "",
  sectionTwoBodyHtml: "",
  sectionTwoChecklistTitle: "",
  sectionTwoChecklistText: "",
  sectionTwoImage: "",
  quoteText: "",
  quoteHtml: "",
  quoteAuthor: "",
  sectionThreeTitle: "3. Section Title",
  sectionThreeParagraphsText: "",
  sectionThreeBodyHtml: "",
  sectionThreeChecklistTitle: "",
  sectionThreeChecklistText: "",
  tagsText: ""
};

function legacySectionToHtml(title, bodyHtml, paragraphs = [], checklistTitle = "", checklist = []) {
  const safeTitle = String(title || "").trim();
  const safeBody = bodyHtml || paragraphsToEditorHtml(paragraphs);
  const safeChecklistTitle = String(checklistTitle || "").trim();
  const safeChecklist = Array.isArray(checklist) ? checklist : [];
  const parts = [];

  if (safeTitle) {
    parts.push(`<p><strong>${safeTitle}</strong></p>`);
  }

  if (safeBody) {
    parts.push(safeBody);
  }

  if (safeChecklistTitle) {
    parts.push(`<p><strong>${safeChecklistTitle}</strong></p>`);
  }

  if (safeChecklist.length) {
    parts.push(safeChecklist.map((item) => `<p>${item}</p>`).join(""));
  }

  return parts.join("");
}

function buildLegacyContentHtml(post) {
  return [
    legacySectionToHtml(post.sectionOneTitle, post.sectionOneBodyHtml, post.sectionOneParagraphs),
    legacySectionToHtml(post.sectionTwoTitle, post.sectionTwoBodyHtml, post.sectionTwoParagraphs, post.sectionTwoChecklistTitle, post.sectionTwoChecklist),
    post.quoteHtml || textToEditorHtml(post.quoteText || ""),
    legacySectionToHtml(post.sectionThreeTitle, post.sectionThreeBodyHtml, post.sectionThreeParagraphs, post.sectionThreeChecklistTitle, post.sectionThreeChecklist)
  ].filter(Boolean).join("");
}

export function statusClass(status) {
  return status === "Published"
    ? "admin-blogs__status admin-blogs__status--published"
    : "admin-blogs__status admin-blogs__status--draft";
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function listToText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

export function textToList(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function postToForm(post) {
  const featuredImage = post.featuredImage || post.heroImage || post.cardImage || "/images/rocket/Post_Image1.png";

  return {
    title: post.title || "",
    slug: post.slug || "",
    category: post.category || "Rubbish Removal Tips",
    author: post.author || "Admin - Rocket Rubbish",
    date: post.date || "20 April 2026",
    status: post.status || "Draft",
    heroImage: featuredImage,
    featuredImage,
    cardImage: featuredImage,
    excerpt: post.excerpt || "",
    intro: post.intro || "",
    introHtml: post.introHtml || textToEditorHtml(post.intro || ""),
    contentHtml: post.contentHtml || buildLegacyContentHtml(post),
    faqItems: Array.isArray(post.faqItems)
      ? post.faqItems.map((item) => ({
          question: item.question || "",
          answer: item.answer || ""
        }))
      : [],
    sectionOneTitle: post.sectionOneTitle || "1. Section Title",
    sectionOneParagraphsText: listToText(post.sectionOneParagraphs),
    sectionOneBodyHtml: post.sectionOneBodyHtml || paragraphsToEditorHtml(post.sectionOneParagraphs),
    sectionTwoTitle: post.sectionTwoTitle || "2. Section Title",
    sectionTwoParagraphsText: listToText(post.sectionTwoParagraphs),
    sectionTwoBodyHtml: post.sectionTwoBodyHtml || paragraphsToEditorHtml(post.sectionTwoParagraphs),
    sectionTwoChecklistTitle: post.sectionTwoChecklistTitle || "",
    sectionTwoChecklistText: listToText(post.sectionTwoChecklist),
    sectionTwoImage: post.sectionTwoImage || "",
    quoteText: post.quoteText || "",
    quoteHtml: post.quoteHtml || textToEditorHtml(post.quoteText || ""),
    quoteAuthor: post.quoteAuthor || "",
    sectionThreeTitle: post.sectionThreeTitle || "3. Section Title",
    sectionThreeParagraphsText: listToText(post.sectionThreeParagraphs),
    sectionThreeBodyHtml: post.sectionThreeBodyHtml || paragraphsToEditorHtml(post.sectionThreeParagraphs),
    sectionThreeChecklistTitle: post.sectionThreeChecklistTitle || "",
    sectionThreeChecklistText: listToText(post.sectionThreeChecklist),
    tagsText: listToText(post.tags)
  };
}

export function formToPayload(form) {
  const featuredImage = form.featuredImage || form.heroImage || form.cardImage || "/images/rocket/Post_Image1.png";

  return {
    title: form.title,
    slug: form.slug,
    category: form.category,
    author: form.author,
    date: form.date,
    status: form.status,
    heroImage: featuredImage,
    featuredImage,
    cardImage: featuredImage,
    excerpt: form.excerpt,
    intro: richTextToPlainText(form.introHtml),
    introHtml: form.introHtml,
    contentHtml: form.contentHtml,
    faqItems: (Array.isArray(form.faqItems) ? form.faqItems : [])
      .map((item) => ({
        question: String(item.question || "").trim(),
        answer: String(item.answer || "").trim()
      }))
      .filter((item) => item.question || item.answer),
    tags: textToList(form.tagsText)
  };
}
