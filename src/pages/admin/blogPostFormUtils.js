export const emptyBlogForm = {
  title: "",
  slug: "",
  category: "Rubbish Removal Tips",
  author: "Admin - Rocket Rubbish",
  date: "20 April 2026",
  status: "Draft",
  heroImage: "/images/rocket/Rectangle231.png",
  featuredImage: "/images/rocket/Post_Image1.png",
  cardImage: "/images/rocket/Post_Image1.png",
  excerpt: "",
  intro: "",
  sectionOneTitle: "1. Section Title",
  sectionOneParagraphsText: "",
  sectionTwoTitle: "2. Section Title",
  sectionTwoParagraphsText: "",
  sectionTwoChecklistTitle: "",
  sectionTwoChecklistText: "",
  sectionTwoImage: "",
  quoteText: "",
  quoteAuthor: "",
  sectionThreeTitle: "3. Section Title",
  sectionThreeParagraphsText: "",
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
    heroImage: post.heroImage || "/images/rocket/Rectangle231.png",
    featuredImage: post.featuredImage || "/images/rocket/Post_Image1.png",
    cardImage: post.cardImage || post.featuredImage || "/images/rocket/Post_Image1.png",
    excerpt: post.excerpt || "",
    intro: post.intro || "",
    sectionOneTitle: post.sectionOneTitle || "1. Section Title",
    sectionOneParagraphsText: listToText(post.sectionOneParagraphs),
    sectionTwoTitle: post.sectionTwoTitle || "2. Section Title",
    sectionTwoParagraphsText: listToText(post.sectionTwoParagraphs),
    sectionTwoChecklistTitle: post.sectionTwoChecklistTitle || "",
    sectionTwoChecklistText: listToText(post.sectionTwoChecklist),
    sectionTwoImage: post.sectionTwoImage || "",
    quoteText: post.quoteText || "",
    quoteAuthor: post.quoteAuthor || "",
    sectionThreeTitle: post.sectionThreeTitle || "3. Section Title",
    sectionThreeParagraphsText: listToText(post.sectionThreeParagraphs),
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
    intro: form.intro,
    sectionOneTitle: form.sectionOneTitle,
    sectionOneParagraphs: textToList(form.sectionOneParagraphsText),
    sectionTwoTitle: form.sectionTwoTitle,
    sectionTwoParagraphs: textToList(form.sectionTwoParagraphsText),
    sectionTwoChecklistTitle: form.sectionTwoChecklistTitle,
    sectionTwoChecklist: textToList(form.sectionTwoChecklistText),
    sectionTwoImage: form.sectionTwoImage,
    quoteText: form.quoteText,
    quoteAuthor: form.quoteAuthor,
    sectionThreeTitle: form.sectionThreeTitle,
    sectionThreeParagraphs: textToList(form.sectionThreeParagraphsText),
    sectionThreeChecklistTitle: form.sectionThreeChecklistTitle,
    sectionThreeChecklist: textToList(form.sectionThreeChecklistText),
    tags: textToList(form.tagsText)
  };
}
