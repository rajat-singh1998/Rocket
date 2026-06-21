import { paragraphsToEditorHtml, richTextToParagraphList, richTextToPlainText, textToEditorHtml } from "../../utils/richTextLinks";

export const emptyBlogForm = {
  title: "",
  slug: "",
  category: "Rubbish Removal Tips",
  author: "Admin - Rocket Rubbish",
  date: "20 April 2026",
  status: "Draft",
  heroImage: "/images/rocket/Rectangle231.jpg",
  featuredImage: "/images/rocket/Post_Image1.png",
  cardImage: "/images/rocket/Post_Image1.png",
  excerpt: "",
  intro: "",
  introHtml: "",
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
  return {
    title: post.title || "",
    slug: post.slug || "",
    category: post.category || "Rubbish Removal Tips",
    author: post.author || "Admin - Rocket Rubbish",
    date: post.date || "20 April 2026",
    status: post.status || "Draft",
    heroImage: post.heroImage || "/images/rocket/Rectangle231.jpg",
    featuredImage: post.featuredImage || "/images/rocket/Post_Image1.png",
    cardImage: post.cardImage || post.featuredImage || "/images/rocket/Post_Image1.png",
    excerpt: post.excerpt || "",
    intro: post.intro || "",
    introHtml: post.introHtml || textToEditorHtml(post.intro || ""),
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
  return {
    title: form.title,
    slug: form.slug,
    category: form.category,
    author: form.author,
    date: form.date,
    status: form.status,
    heroImage: form.heroImage,
    featuredImage: form.featuredImage,
    cardImage: form.cardImage,
    excerpt: form.excerpt,
    intro: richTextToPlainText(form.introHtml),
    introHtml: form.introHtml,
    sectionOneTitle: form.sectionOneTitle,
    sectionOneParagraphs: richTextToParagraphList(form.sectionOneBodyHtml),
    sectionOneBodyHtml: form.sectionOneBodyHtml,
    sectionTwoTitle: form.sectionTwoTitle,
    sectionTwoParagraphs: richTextToParagraphList(form.sectionTwoBodyHtml),
    sectionTwoBodyHtml: form.sectionTwoBodyHtml,
    sectionTwoChecklistTitle: form.sectionTwoChecklistTitle,
    sectionTwoChecklist: textToList(form.sectionTwoChecklistText),
    sectionTwoImage: form.sectionTwoImage,
    quoteText: richTextToPlainText(form.quoteHtml),
    quoteHtml: form.quoteHtml,
    quoteAuthor: form.quoteAuthor,
    sectionThreeTitle: form.sectionThreeTitle,
    sectionThreeParagraphs: richTextToParagraphList(form.sectionThreeBodyHtml),
    sectionThreeBodyHtml: form.sectionThreeBodyHtml,
    sectionThreeChecklistTitle: form.sectionThreeChecklistTitle,
    sectionThreeChecklist: textToList(form.sectionThreeChecklistText),
    tags: textToList(form.tagsText)
  };
}
