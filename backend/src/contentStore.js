import { promises as fs } from "fs";
import path from "path";
import { createDefaultLocationPage, defaultLocationSectionVisibility } from "./locationPageFactory.js";

const backendRoot = process.cwd();
const contentFilePath = path.resolve(backendRoot, "data", "siteContent.json");
const publicDirectoryPath = path.resolve(backendRoot, "..", "public");
const sitemapFilePath = path.join(publicDirectoryPath, "sitemap.xml");
const robotsFilePath = path.join(publicDirectoryPath, "robots.txt");
const siteOrigin = String(process.env.PUBLIC_SITE_ORIGIN || process.env.SITE_ORIGIN || "https://www.rocketrubbishremoval.co.uk")
  .trim()
  .replace(/\/+$/, "");

const defaultSections = [
  { label: "Hero Section", key: "hero", active: true },
  { label: "Services Grid", key: "services", active: true },
  { label: "How It Works", key: "howItWorks", active: true },
  { label: "Testimonials", key: "testimonials", active: true },
  { label: "FAQ", key: "faq", active: true },
  { label: "Footer", key: "footer", active: true }
];

const defaultHero = {
  headline: "UK-Wide Rubbish Clearance\nFast, Easy & Hassle-Free",
  subheadline: "Man & Van rubbish clearance across the UK. Book in 60 seconds. We collect, sort & recycle, same day.",
  backgroundImage: "/images/rocket/Hero_Section.jpg"
};

const defaultCityPages = [
  createDefaultLocationPage({
    name: "London",
    slug: "london",
    regionName: "London",
    sourceType: "location"
  })
];

const defaultPageSeo = {
  home: {
    key: "home",
    label: "Homepage",
    path: "/",
    metaTitle: "UK-Wide Rubbish Removal, Rubbish Clearance & Waste Collection",
    metaDescription: "Rocket Rubbish Removal provides UK-wide rubbish removal, rubbish clearance, waste collection, waste disposal, and junk removal with fast booking and same-day availability.",
    order: 1
  },
  services: {
    key: "services",
    label: "Services Page",
    path: "/services",
    metaTitle: "Rubbish Clearance Services Across The UK",
    metaDescription: "Compare rubbish removal load sizes and book UK-wide rubbish clearance, waste collection, junk removal, and responsible waste disposal services.",
    order: 2
  },
  blog: {
    key: "blog",
    label: "Blog Page",
    path: "/blog",
    metaTitle: "Blog | Rubbish Removal Tips, Advice & Guides",
    metaDescription: "Explore Rocket Rubbish blog posts covering rubbish removal, rubbish clearance, waste collection, junk removal, waste disposal tips, and skip hire alternatives.",
    order: 3
  },
  howItWorks: {
    key: "howItWorks",
    label: "How It Works Page",
    path: "/how-it-works",
    metaTitle: "How Our Rubbish Removal & Waste Collection Process Works",
    metaDescription: "See how Rocket Rubbish handles rubbish removal, rubbish clearance, waste collection, junk removal, and responsible waste disposal in four simple steps across the UK.",
    order: 4
  },
  aboutUs: {
    key: "aboutUs",
    label: "About Us Page",
    path: "/about-us",
    metaTitle: "About Rocket Rubbish Removal",
    metaDescription: "Learn more about Rocket Rubbish, our UK-wide rubbish removal team, our sustainability standards, and why customers choose our rubbish clearance and waste collection services.",
    order: 5
  },
  creditAccount: {
    key: "creditAccount",
    label: "Credit Account Page",
    path: "/credit-account",
    metaTitle: "Credit Account Application | Rocket Rubbish Removal",
    metaDescription: "Apply for a Rocket Rubbish credit account for ongoing rubbish removal, rubbish clearance, waste collection, waste disposal, and skip hire support.",
    order: 6
  },
  contactUs: {
    key: "contactUs",
    label: "Contact Us Page",
    path: "/contact-us",
    metaTitle: "Contact Rocket Rubbish Removal",
    metaDescription: "Contact Rocket Rubbish for fast rubbish removal, rubbish clearance, waste collection, junk removal, and responsible waste disposal bookings anywhere in the UK.",
    order: 7
  },
  faq: {
    key: "faq",
    label: "FAQ Page",
    path: "/faq",
    metaTitle: "Frequently Asked Questions | Rocket Rubbish Removal",
    metaDescription: "Read our UK rubbish removal FAQs covering rubbish clearance, waste collection, junk removal, skip hire alternatives, pricing, coverage, and waste disposal.",
    order: 8
  },
  privacyPolicy: {
    key: "privacyPolicy",
    label: "Privacy Policy Page",
    path: "/privacy-policy",
    metaTitle: "Privacy Policy | Rocket Rubbish Removal",
    metaDescription: "Read the Rocket Rubbish privacy policy to understand how we collect, use, protect, and process personal data for rubbish removal, waste collection, and booking services.",
    order: 9
  },
  termsConditions: {
    key: "termsConditions",
    label: "Terms & Conditions Page",
    path: "/terms-and-conditions",
    metaTitle: "Terms & Conditions | Rocket Rubbish Removal",
    metaDescription: "Read the Rocket Rubbish terms and conditions covering bookings, rubbish removal services, pricing, waste collection, cancellations, liabilities, and environmental commitments.",
    order: 10
  }
};

function normalisePageSeo(value = {}) {
  const next = {};

  Object.entries(defaultPageSeo).forEach(([key, item]) => {
    const current = value?.[key] || {};
    next[key] = {
      ...item,
      ...current,
      key,
      label: String(current.label || item.label).trim() || item.label,
      path: String(current.path || item.path).trim() || item.path,
      metaTitle: String(current.metaTitle || item.metaTitle).trim() || item.metaTitle,
      metaDescription: String(current.metaDescription || item.metaDescription).trim() || item.metaDescription,
      order: Number.isFinite(Number(current.order)) ? Number(current.order) : item.order
    };
  });

  return next;
}

const defaultContent = {
  sections: defaultSections,
  hero: defaultHero,
  customPages: [],
  cityPages: defaultCityPages,
  pageSeo: defaultPageSeo,
  blogPosts: [],
  contactInquiries: []
};

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function titleCaseFromSlug(slug = "") {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normaliseStringArray(value, fallback = []) {
  if (Array.isArray(value)) {
    const next = value.map((item) => String(item).trim()).filter(Boolean);
    return next.length > 0 ? next : fallback;
  }

  if (typeof value === "string") {
    const next = value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    return next.length > 0 ? next : fallback;
  }

  return fallback;
}

function normaliseFaqItems(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const next = value
    .map((item) => ({
      question: String(item?.question || "").trim(),
      answer: String(item?.answer || "").trim()
    }))
    .filter((item) => item.question && item.answer);

  return next.length > 0 ? next : fallback;
}

function inferSourceType(page = {}) {
  if (page.sourceType === "region") {
    return "region";
  }

  if (page.locationType === "area" || page.locationType === "county") {
    return "region";
  }

  return "location";
}

function normaliseLocationPage(page = {}) {
  const name = String(page?.name || titleCaseFromSlug(page?.slug) || "Location").trim() || "Location";
  const slug = slugify(page?.slug || name) || slugify(name);
  const sourceType = inferSourceType(page);
  const regionName = String(page?.regionName || name).trim();
  const generated = createDefaultLocationPage({
    name,
    slug,
    regionName,
    sourceType
  });
  const heroImage = String(page?.heroImage || generated.heroImage).trim() || generated.heroImage;
  const wasteImage = String(page?.wasteImage || generated.wasteImage).trim() || generated.wasteImage;
  const propertyImage = String(page?.propertyImage || generated.propertyImage).trim() || generated.propertyImage;

  return {
    ...generated,
    ...page,
    id: page.id || generated.id,
    name,
    slug,
    sourceType,
    locationType: generated.locationType,
    regionName: generated.regionName,
    metaTitle: String(page?.metaTitle || generated.metaTitle).trim() || generated.metaTitle,
    metaDescription: String(page?.metaDescription || generated.metaDescription).trim() || generated.metaDescription,
    canonicalPath: String(page?.canonicalPath || generated.canonicalPath).trim() || generated.canonicalPath,
    ogTitle: String(page?.ogTitle || generated.ogTitle).trim() || generated.ogTitle,
    ogDescription: String(page?.ogDescription || generated.ogDescription).trim() || generated.ogDescription,
    ogImage: String(page?.ogImage || heroImage || generated.ogImage).trim() || generated.ogImage,
    heroAlt: String(page?.heroAlt || generated.heroAlt).trim() || generated.heroAlt,
    heroImage,
    heroSubheadline: String(page?.heroSubheadline || generated.heroSubheadline || "").trim(),
    wasteImage,
    wasteAlt: String(page?.wasteAlt || generated.wasteAlt || page?.wasteTitle || generated.wasteTitle).trim(),
    propertyImage,
    propertyAlt: String(page?.propertyAlt || generated.propertyAlt || page?.propertyTitle || generated.propertyTitle).trim(),
    sectionVisibility: {
      ...defaultLocationSectionVisibility(),
      ...(page.sectionVisibility || {})
    },
    sameDayBullets: normaliseStringArray(page.sameDayBullets, generated.sameDayBullets),
    faqItems: normaliseFaqItems(page.faqItems, generated.faqItems),
    createdAt: page.createdAt || generated.createdAt,
    updatedAt: page.updatedAt || generated.updatedAt
  };
}

function normaliseBlogPost(post = {}) {
  return {
    ...post,
    title: String(post.title || "").trim(),
    slug: slugify(post.slug || post.title || ""),
    category: String(post.category || "").trim(),
    author: String(post.author || "").trim(),
    date: String(post.date || "").trim(),
    status: String(post.status || "Draft").trim() || "Draft",
    excerpt: String(post.excerpt || "").trim(),
    intro: String(post.intro || "").trim(),
    sectionOneTitle: String(post.sectionOneTitle || "").trim(),
    sectionOneParagraphs: normaliseStringArray(post.sectionOneParagraphs),
    sectionTwoTitle: String(post.sectionTwoTitle || "").trim(),
    sectionTwoParagraphs: normaliseStringArray(post.sectionTwoParagraphs),
    sectionTwoChecklistTitle: String(post.sectionTwoChecklistTitle || "").trim(),
    sectionTwoChecklist: normaliseStringArray(post.sectionTwoChecklist),
    sectionThreeTitle: String(post.sectionThreeTitle || "").trim(),
    sectionThreeParagraphs: normaliseStringArray(post.sectionThreeParagraphs),
    sectionThreeChecklistTitle: String(post.sectionThreeChecklistTitle || "").trim(),
    sectionThreeChecklist: normaliseStringArray(post.sectionThreeChecklist),
    tags: normaliseStringArray(post.tags)
  };
}

function normaliseContactInquiry(inquiry = {}) {
  return {
    ...inquiry,
    name: String(inquiry.name || "").trim(),
    email: String(inquiry.email || "Not provided").trim() || "Not provided",
    messagePreview: String(inquiry.messagePreview || "").trim(),
    message: String(inquiry.message || "").trim(),
    date: String(inquiry.date || "").trim(),
    status: String(inquiry.status || "New").trim() || "New",
    source: String(inquiry.source || "").trim(),
    clearing: String(inquiry.clearing || "").trim(),
    load: String(inquiry.load || "").trim(),
    postcode: String(inquiry.postcode || "").trim(),
    timing: String(inquiry.timing || "").trim()
  };
}

function normaliseContent(content = {}) {
  return {
    ...defaultContent,
    ...content,
    sections: Array.isArray(content.sections) && content.sections.length > 0 ? content.sections : defaultSections,
    hero: {
      ...defaultHero,
      ...(content.hero || {})
    },
    customPages: Array.isArray(content.customPages) ? content.customPages : [],
    cityPages: Array.isArray(content.cityPages) && content.cityPages.length > 0
      ? content.cityPages.map(normaliseLocationPage)
      : defaultCityPages.map(normaliseLocationPage),
    pageSeo: normalisePageSeo(content.pageSeo || {}),
    blogPosts: Array.isArray(content.blogPosts) ? content.blogPosts.map(normaliseBlogPost) : [],
    contactInquiries: Array.isArray(content.contactInquiries) ? content.contactInquiries.map(normaliseContactInquiry) : []
  };
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(content) {
  const staticRoutes = [
    "/",
    "/services",
    "/blog",
    "/how-it-works",
    "/about-us",
    "/credit-account",
    "/contact-us",
    "/faq",
    "/privacy-policy",
    "/terms-and-conditions"
  ];

  const entries = [];
  const seen = new Set();
  const addEntry = (routePath, lastModified = new Date().toISOString()) => {
    if (!routePath || seen.has(routePath)) {
      return;
    }

    seen.add(routePath);
    entries.push({
      loc: `${siteOrigin}${routePath}`,
      lastmod: lastModified.slice(0, 10)
    });
  };

  staticRoutes.forEach((routePath) => addEntry(routePath));
  (content.customPages || []).forEach((page) => addEntry(`/${page.slug}`, page.updatedAt || page.createdAt || new Date().toISOString()));
  (content.cityPages || []).forEach((page) => addEntry(page.canonicalPath || `/cities/${page.slug}`, page.updatedAt || page.createdAt || new Date().toISOString()));
  (content.blogPosts || [])
    .filter((post) => post.status !== "Draft")
    .forEach((post) => addEntry(`/blog/${post.slug}`, post.updatedAt || post.createdAt || new Date().toISOString()));

  const urls = entries
    .map((entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteOrigin}/sitemap.xml`
  ].join("\n");
}

async function writeSeoSupportFiles(content) {
  await fs.mkdir(publicDirectoryPath, { recursive: true });
  await fs.writeFile(sitemapFilePath, buildSitemapXml(content), "utf8");
  await fs.writeFile(robotsFilePath, buildRobotsTxt(), "utf8");
}

async function tryWriteSeoSupportFiles(content) {
  try {
    await writeSeoSupportFiles(content);
  } catch (error) {
    console.warn(`Unable to refresh SEO support files: ${error.message}`);
  }
}

async function ensureContentFile() {
  let shouldCreateDefault = false;

  try {
    await fs.access(contentFilePath);
    const file = await fs.readFile(contentFilePath, "utf8");
    const parsed = JSON.parse(file);
    const normalised = normaliseContent(parsed);

    if (JSON.stringify(parsed) !== JSON.stringify(normalised)) {
      await fs.writeFile(contentFilePath, JSON.stringify(normalised, null, 2), "utf8");
    }

    await tryWriteSeoSupportFiles(normalised);
  } catch {
    shouldCreateDefault = true;
  }

  if (shouldCreateDefault) {
    const normalised = normaliseContent(defaultContent);
    await fs.writeFile(contentFilePath, JSON.stringify(normalised, null, 2), "utf8");
    await tryWriteSeoSupportFiles(normalised);
  }
}

export async function readSiteContent() {
  await ensureContentFile();
  const file = await fs.readFile(contentFilePath, "utf8");
  return normaliseContent(JSON.parse(file));
}

export async function writeSiteContent(content) {
  const normalised = normaliseContent(content);
  await fs.writeFile(contentFilePath, JSON.stringify(normalised, null, 2), "utf8");
  await writeSeoSupportFiles(normalised);
  return normalised;
}
