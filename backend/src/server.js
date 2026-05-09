import "dotenv/config";
import crypto from "crypto";
import { mkdir } from "fs/promises";
import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { readAdmin, writeAdmin } from "./adminStore.js";
import { readSiteContent, writeSiteContent } from "./contentStore.js";

const app = express();
const port = process.env.PORT || 5000;
const uploadsDirectory = path.resolve(process.cwd(), "uploads");
const adminAuthSecret = process.env.ADMIN_AUTH_SECRET || "rocket-admin-secret";
const sessionLifetimeMs = 1000 * 60 * 60 * 12;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((item) => item.trim()).filter(Boolean)
  : true;

await mkdir(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${file.fieldname}-${Date.now()}${extension}`);
  }
});

const upload = multer({ storage });
const cityPageUpload = upload.fields([
  { name: 'heroImageFile', maxCount: 1 },
  { name: 'wasteImageFile', maxCount: 1 },
  { name: 'propertyImageFile', maxCount: 1 }
]);
const blogPostUpload = upload.fields([
  { name: 'heroImageFile', maxCount: 1 },
  { name: 'featuredImageFile', maxCount: 1 },
  { name: 'cardImageFile', maxCount: 1 },
  { name: 'sectionTwoImageFile', maxCount: 1 }
]);

function getPublicAdminProfile(admin) {
  return {
    name: admin.name,
    email: admin.email,
    phone: admin.phone
  };
}

function createAdminToken(admin) {
  const payload = {
    email: admin.email,
    exp: Date.now() + sessionLifetimeMs
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", adminAuthSecret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac("sha256", adminAuthSecret).update(encodedPayload).digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
}

function requireAdminAuth(req, res, next) {
  const session = verifyAdminToken(getBearerToken(req));

  if (!session) {
    return res.status(401).json({ ok: false, message: "Unauthorized request." });
  }

  req.adminSession = session;
  return next();
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normaliseSections(sections = []) {
  const defaults = [
    { heading: "Section 1", content: "" },
    { heading: "Section 2", content: "" },
    { heading: "Section 3", content: "" }
  ];

  return defaults.map((item, index) => ({
    heading: String(sections[index]?.heading || item.heading).trim() || item.heading,
    content: String(sections[index]?.content || "")
  }));
}
function defaultCitySectionVisibility() {
  return {
    hero: true,
    services: true,
    sameDay: true,
    waste: true,
    property: true,
    greenBanner: true
  };
}

function createDefaultCityPage(name, slug) {
  const cityName = String(name || "City").trim();
  const citySlug = slugify(slug || name || cityName);
  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name: cityName,
    slug: citySlug,
    sectionVisibility: defaultCitySectionVisibility(),
    heroTitle: `Rubbish Removal In ${cityName}`,
    heroText: `Fast, friendly, and fully licensed rubbish collection across . From single items to full property clearances, our team handles the heavy lifting, loading, and responsible disposal.`,
    heroImage: '/images/rocket/RC_1551.png',
    servicesTitle: `Our Most Popular Waste Collection Services In ${cityName}`,
    servicesText: `Choose the service that suits your load size, budget, and property type. From a few bags to full van collections, we keep pricing simple and collection fast in ${cityName}.`,
    sameDayTitle: `Same-Day Rubbish Removal Across ${cityName}`,
    sameDayIntro: `Get fast, affordable rubbish removal in ${cityName} today. We cover homes, offices, shops, and gardens with same-day and next-day slots across the area.`,
    sameDayBullets: [
      "No skip permits needed",
      "No lifting required - we load everything",
      "Flexible load sizes for all property types",
      "Licensed waste disposal at certified recycling centres"
    ],
    sameDayFooter: "Ideal for homes, offices, shops, rental properties, and renovation projects.",
    wasteTitle: "Responsible Waste Disposal & Skip Hire Alternative",
    wasteText: `Need fast waste collection without the delays and hassle of skip hire? Our  team offers a quicker, cleaner option for homes and businesses.`,
    wasteImage: '/images/rocket/rc_29.png',
    wasteSubTitle: "The Better Skip Hire Alternative",
    wasteSubText: "With labour included, same-day availability, and fixed pricing, you get everything collected in one visit without permits, overfilled skips, or blocked driveways.",
    propertyTitle: "Complete Property Rubbish Clearance",
    propertyText: `From lofts and basements to garages and full house clearances, we collect bulky waste, mixed rubbish, furniture, and general junk across .`,
    propertyImage: '/images/rocket/quote-photo.jpg',
    greenTitle: `Fast & Affordable Junk Removal In ${cityName}`,
    greenSubtitle: `Choose the collection type that matches your waste and let our ${cityName} team handle everything from lifting to licensed disposal.`,
    greenFooter: `From a single sofa to full van loads, our crews cover ${cityName} with fixed transparent pricing.`,
    compareTitle: `What Can Our ${cityName} Team Collect?`,
    compareText: "We take most non-hazardous household, office, garden, and bulky waste. Restricted waste still needs specialist disposal.",
    mapTitle: "Rocket Rubbish Near Me",
    mapText: `See our ${cityName} service area and central coverage point.`,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function normaliseBulletList(value, fallback = []) {
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

function buildUpdatedCityPage(current, payload = {}) {
  const name = String(payload.name || current.name || "").trim() || current.name;
  const slug = slugify(payload.slug || current.slug || name);
  const sectionVisibility = {
    ...defaultCitySectionVisibility(),
    ...(current.sectionVisibility || {}),
    ...(payload.sectionVisibility || {})
  };

  return {
    ...current,
    sectionVisibility,
    name,
    slug,
    heroTitle: String(payload.heroTitle ?? current.heroTitle ?? '').trim(),
    heroText: String(payload.heroText ?? current.heroText ?? '').trim(),
    heroImage: String(payload.heroImage ?? current.heroImage ?? '').trim(),
    servicesTitle: String(payload.servicesTitle ?? current.servicesTitle ?? "").trim(),
    servicesText: String(payload.servicesText ?? current.servicesText ?? "").trim(),
    sameDayTitle: String(payload.sameDayTitle ?? current.sameDayTitle ?? "").trim(),
    sameDayIntro: String(payload.sameDayIntro ?? current.sameDayIntro ?? "").trim(),
    sameDayBullets: normaliseBulletList(payload.sameDayBullets, current.sameDayBullets || []),
    sameDayFooter: String(payload.sameDayFooter ?? current.sameDayFooter ?? "").trim(),
    wasteTitle: String(payload.wasteTitle ?? current.wasteTitle ?? '').trim(),
    wasteText: String(payload.wasteText ?? current.wasteText ?? '').trim(),
    wasteImage: String(payload.wasteImage ?? current.wasteImage ?? '').trim(),
    wasteSubTitle: String(payload.wasteSubTitle ?? current.wasteSubTitle ?? "").trim(),
    wasteSubText: String(payload.wasteSubText ?? current.wasteSubText ?? "").trim(),
    propertyTitle: String(payload.propertyTitle ?? current.propertyTitle ?? '').trim(),
    propertyText: String(payload.propertyText ?? current.propertyText ?? '').trim(),
    propertyImage: String(payload.propertyImage ?? current.propertyImage ?? '').trim(),
    greenTitle: String(payload.greenTitle ?? current.greenTitle ?? "").trim(),
    greenSubtitle: String(payload.greenSubtitle ?? current.greenSubtitle ?? "").trim(),
    greenFooter: String(payload.greenFooter ?? current.greenFooter ?? "").trim(),
    compareTitle: String(payload.compareTitle ?? current.compareTitle ?? "").trim(),
    compareText: String(payload.compareText ?? current.compareText ?? "").trim(),
    mapTitle: String(payload.mapTitle ?? current.mapTitle ?? "").trim(),
    mapText: String(payload.mapText ?? current.mapText ?? "").trim(),
    updatedAt: new Date().toISOString()
  };
}

function formatBlogDate(value) {
  const fallback = "20 April 2026";
  const next = String(value || "").trim();
  return next || fallback;
}

function createDefaultBlogPost(payload = {}) {
  const title = String(payload.title || "").trim() || "Untitled Blog Post";
  const slug = slugify(payload.slug || title);
  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title,
    slug,
    category: String(payload.category || "Rubbish Removal Tips").trim() || "Rubbish Removal Tips",
    author: String(payload.author || "Admin - Rocket Rubbish").trim() || "Admin - Rocket Rubbish",
    date: formatBlogDate(payload.date),
    status: String(payload.status || "Draft").trim() || "Draft",
    heroImage: String(payload.heroImage || "/images/rocket/Rectangle231.png").trim() || "/images/rocket/Rectangle231.png",
    featuredImage:
      String(payload.featuredImage || "/images/rocket/Post_Image1.png").trim() || "/images/rocket/Post_Image1.png",
    cardImage:
      String(payload.cardImage || payload.featuredImage || "/images/rocket/Post_Image1.png").trim() ||
      "/images/rocket/Post_Image1.png",
    excerpt: String(payload.excerpt || "").trim(),
    intro: String(payload.intro || "").trim(),
    sectionOneTitle: String(payload.sectionOneTitle || "1. Section Title").trim() || "1. Section Title",
    sectionOneParagraphs: normaliseBulletList(payload.sectionOneParagraphs),
    sectionTwoTitle: String(payload.sectionTwoTitle || "2. Section Title").trim() || "2. Section Title",
    sectionTwoParagraphs: normaliseBulletList(payload.sectionTwoParagraphs),
    sectionTwoChecklistTitle: String(payload.sectionTwoChecklistTitle || "").trim(),
    sectionTwoChecklist: normaliseBulletList(payload.sectionTwoChecklist),
    sectionTwoImage: String(payload.sectionTwoImage || "").trim(),
    quoteText: String(payload.quoteText || "").trim(),
    quoteAuthor: String(payload.quoteAuthor || "").trim(),
    sectionThreeTitle: String(payload.sectionThreeTitle || "3. Section Title").trim() || "3. Section Title",
    sectionThreeParagraphs: normaliseBulletList(payload.sectionThreeParagraphs),
    sectionThreeChecklistTitle: String(payload.sectionThreeChecklistTitle || "").trim(),
    sectionThreeChecklist: normaliseBulletList(payload.sectionThreeChecklist),
    tags: normaliseBulletList(payload.tags),
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function buildUpdatedBlogPost(current, payload = {}) {
  const title = String(payload.title ?? current.title ?? "").trim() || current.title;
  const slug = slugify(payload.slug || current.slug || title);

  return {
    ...current,
    title,
    slug,
    category: String(payload.category ?? current.category ?? "").trim(),
    author: String(payload.author ?? current.author ?? "").trim(),
    date: formatBlogDate(payload.date ?? current.date),
    status: String(payload.status ?? current.status ?? "").trim() || current.status,
    heroImage: String(payload.heroImage ?? current.heroImage ?? "").trim(),
    featuredImage: String(payload.featuredImage ?? current.featuredImage ?? "").trim(),
    cardImage: String(payload.cardImage ?? current.cardImage ?? payload.featuredImage ?? current.featuredImage ?? "").trim(),
    excerpt: String(payload.excerpt ?? current.excerpt ?? "").trim(),
    intro: String(payload.intro ?? current.intro ?? "").trim(),
    sectionOneTitle: String(payload.sectionOneTitle ?? current.sectionOneTitle ?? "").trim(),
    sectionOneParagraphs: normaliseBulletList(payload.sectionOneParagraphs, current.sectionOneParagraphs || []),
    sectionTwoTitle: String(payload.sectionTwoTitle ?? current.sectionTwoTitle ?? "").trim(),
    sectionTwoParagraphs: normaliseBulletList(payload.sectionTwoParagraphs, current.sectionTwoParagraphs || []),
    sectionTwoChecklistTitle: String(payload.sectionTwoChecklistTitle ?? current.sectionTwoChecklistTitle ?? "").trim(),
    sectionTwoChecklist: normaliseBulletList(payload.sectionTwoChecklist, current.sectionTwoChecklist || []),
    sectionTwoImage: String(payload.sectionTwoImage ?? current.sectionTwoImage ?? "").trim(),
    quoteText: String(payload.quoteText ?? current.quoteText ?? "").trim(),
    quoteAuthor: String(payload.quoteAuthor ?? current.quoteAuthor ?? "").trim(),
    sectionThreeTitle: String(payload.sectionThreeTitle ?? current.sectionThreeTitle ?? "").trim(),
    sectionThreeParagraphs: normaliseBulletList(payload.sectionThreeParagraphs, current.sectionThreeParagraphs || []),
    sectionThreeChecklistTitle: String(payload.sectionThreeChecklistTitle ?? current.sectionThreeChecklistTitle ?? "").trim(),
    sectionThreeChecklist: normaliseBulletList(payload.sectionThreeChecklist, current.sectionThreeChecklist || []),
    tags: normaliseBulletList(payload.tags, current.tags || []),
    updatedAt: new Date().toISOString()
  };
}

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDirectory));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Rocket backend is running." });
});

app.post("/api/admin/login", async (req, res) => {
  const { password = "" } = req.body ?? {};
  const admin = await readAdmin();

  if (password.trim() !== admin.password) {
    return res.status(401).json({ ok: false, message: "Invalid password." });
  }

  return res.json({
    ok: true,
    token: createAdminToken(admin),
    admin: getPublicAdminProfile(admin)
  });
});

app.get("/api/admin/profile", requireAdminAuth, async (_req, res) => {
  const admin = await readAdmin();
  res.json({ ok: true, profile: getPublicAdminProfile(admin) });
});

app.put("/api/admin/profile", requireAdminAuth, async (req, res) => {
  const { name = "", email = "", phone = "" } = req.body ?? {};
  const admin = await readAdmin();

  const updatedAdmin = {
    ...admin,
    name: name.trim() || admin.name,
    email: email.trim() || admin.email,
    phone: phone.trim() || admin.phone
  };

  await writeAdmin(updatedAdmin);

  res.json({
    ok: true,
    message: "Profile updated successfully.",
    profile: getPublicAdminProfile(updatedAdmin)
  });
});

app.put("/api/admin/change-password", requireAdminAuth, async (req, res) => {
  const { oldPassword = "", newPassword = "", confirmPassword = "" } = req.body ?? {};
  const admin = await readAdmin();

  if (oldPassword !== admin.password) {
    return res.status(400).json({ ok: false, message: "Old password is incorrect." });
  }

  if (!newPassword.trim()) {
    return res.status(400).json({ ok: false, message: "New password is required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ ok: false, message: "Passwords do not match." });
  }

  const updatedAdmin = {
    ...admin,
    password: newPassword
  };

  await writeAdmin(updatedAdmin);
  res.json({ ok: true, message: "Password updated successfully." });
});

app.get("/api/admin/content", requireAdminAuth, async (_req, res) => {
  const content = await readSiteContent();
  res.json({ ok: true, content });
});

app.put("/api/admin/content/sections", requireAdminAuth, async (req, res) => {
  const { sections = [] } = req.body ?? {};

  if (!Array.isArray(sections)) {
    return res.status(400).json({ ok: false, message: "Sections payload must be an array." });
  }

  const content = await readSiteContent();
  const nextSections = sections
    .map((item) => ({
      label: String(item.label || "").trim(),
      key: String(item.key || "").trim(),
      active: Boolean(item.active)
    }))
    .filter((item) => item.label && item.key);

  const updatedContent = {
    ...content,
    sections: nextSections.length > 0 ? nextSections : content.sections
  };

  const savedContent = await writeSiteContent(updatedContent);

  res.json({
    ok: true,
    message: "Sections updated successfully.",
    sections: savedContent.sections
  });
});

app.put("/api/admin/content/hero", requireAdminAuth, upload.single("backgroundImage"), async (req, res) => {
  const { headline = "", subheadline = "" } = req.body ?? {};
  const content = await readSiteContent();

  const updatedHero = {
    ...content.hero,
    headline: headline.trim() || content.hero.headline,
    subheadline: subheadline.trim() || content.hero.subheadline,
    backgroundImage: req.file ? `/uploads/${req.file.filename}` : content.hero.backgroundImage
  };

  const savedContent = await writeSiteContent({
    ...content,
    hero: updatedHero
  });

  res.json({
    ok: true,
    message: "Hero section updated successfully.",
    hero: savedContent.hero
  });
});

app.get("/api/admin/content/pages", requireAdminAuth, async (_req, res) => {
  const content = await readSiteContent();
  res.json({ ok: true, pages: content.customPages || [] });
});

app.post("/api/admin/content/pages", requireAdminAuth, async (req, res) => {
  const { name = "", slug = "", title = "" } = req.body ?? {};
  const pageName = name.trim();
  const pageSlug = slugify(slug || name);
  const pageTitle = title.trim() || pageName;

  if (!pageName) {
    return res.status(400).json({ ok: false, message: "Page name is required." });
  }

  if (!pageSlug) {
    return res.status(400).json({ ok: false, message: "Page slug is required." });
  }

  const siteContent = await readSiteContent();
  const hasDuplicateSlug = siteContent.customPages.some((item) => item.slug === pageSlug);

  if (hasDuplicateSlug) {
    return res.status(400).json({ ok: false, message: "This slug is already in use." });
  }

  const page = {
    id: crypto.randomUUID(),
    name: pageName,
    slug: pageSlug,
    title: pageTitle,
    sections: normaliseSections(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const savedContent = await writeSiteContent({
    ...siteContent,
    customPages: [page, ...siteContent.customPages]
  });

  res.json({ ok: true, message: "Page created successfully.", page, pages: savedContent.customPages });
});

app.put("/api/admin/content/pages/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { name = "", slug = "", title = "", sections = [] } = req.body ?? {};
  const pageName = name.trim();
  const pageSlug = slugify(slug || name);
  const pageTitle = title.trim() || pageName;
  const pageSections = normaliseSections(sections);

  if (!pageName) {
    return res.status(400).json({ ok: false, message: "Page name is required." });
  }

  if (!pageSlug) {
    return res.status(400).json({ ok: false, message: "Page slug is required." });
  }

  const siteContent = await readSiteContent();
  const targetPage = siteContent.customPages.find((item) => item.id === id);

  if (!targetPage) {
    return res.status(404).json({ ok: false, message: "Page not found." });
  }

  const hasDuplicateSlug = siteContent.customPages.some((item) => item.id !== id && item.slug === pageSlug);

  if (hasDuplicateSlug) {
    return res.status(400).json({ ok: false, message: "This slug is already in use." });
  }

  const updatedPage = {
    ...targetPage,
    name: pageName,
    slug: pageSlug,
    title: pageTitle,
    sections: pageSections,
    updatedAt: new Date().toISOString()
  };

  const savedContent = await writeSiteContent({
    ...siteContent,
    customPages: siteContent.customPages.map((item) => (item.id === id ? updatedPage : item))
  });

  res.json({ ok: true, message: "Page updated successfully.", page: updatedPage, pages: savedContent.customPages });
});

app.delete("/api/admin/content/pages/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const siteContent = await readSiteContent();
  const targetPage = siteContent.customPages.find((item) => item.id === id);

  if (!targetPage) {
    return res.status(404).json({ ok: false, message: "Page not found." });
  }

  const savedContent = await writeSiteContent({
    ...siteContent,
    customPages: siteContent.customPages.filter((item) => item.id !== id)
  });

  res.json({ ok: true, message: "Page deleted successfully.", pages: savedContent.customPages });
});

app.get("/api/admin/city-pages", requireAdminAuth, async (_req, res) => {
  const content = await readSiteContent();
  res.json({ ok: true, pages: content.cityPages || [] });
});

app.post("/api/admin/city-pages", requireAdminAuth, async (req, res) => {
  const { name = "", slug = "" } = req.body ?? {};
  const pageName = name.trim();
  const pageSlug = slugify(slug || name);

  if (!pageName) {
    return res.status(400).json({ ok: false, message: "City name is required." });
  }

  if (!pageSlug) {
    return res.status(400).json({ ok: false, message: "City slug is required." });
  }

  const siteContent = await readSiteContent();
  const hasDuplicateSlug = siteContent.cityPages.some((item) => item.slug === pageSlug);

  if (hasDuplicateSlug) {
    return res.status(400).json({ ok: false, message: "This city slug is already in use." });
  }

  const page = createDefaultCityPage(pageName, pageSlug);

  const savedContent = await writeSiteContent({
    ...siteContent,
    cityPages: [page, ...siteContent.cityPages]
  });

  res.json({ ok: true, message: "City page created successfully.", page, pages: savedContent.cityPages });
});

app.put("/api/admin/city-pages/:id", requireAdminAuth, cityPageUpload, async (req, res) => {
  const { id } = req.params;
  const siteContent = await readSiteContent();
  const targetPage = siteContent.cityPages.find((item) => item.id === id);

  if (!targetPage) {
    return res.status(404).json({ ok: false, message: "City page not found." });
  }

  const files = req.files || {};
  const payload = {
    ...(req.body ?? {}),
    sectionVisibility: parseJsonField(req.body?.sectionVisibility, targetPage.sectionVisibility || defaultCitySectionVisibility()),
    heroImage: files.heroImageFile?.[0] ? `/uploads/${files.heroImageFile[0].filename}` : req.body?.heroImage,
    wasteImage: files.wasteImageFile?.[0] ? `/uploads/${files.wasteImageFile[0].filename}` : req.body?.wasteImage,
    propertyImage: files.propertyImageFile?.[0] ? `/uploads/${files.propertyImageFile[0].filename}` : req.body?.propertyImage
  };

  const updatedPage = buildUpdatedCityPage(targetPage, payload);
  const hasDuplicateSlug = siteContent.cityPages.some((item) => item.id !== id && item.slug === updatedPage.slug);

  if (hasDuplicateSlug) {
    return res.status(400).json({ ok: false, message: "This city slug is already in use." });
  }

  const savedContent = await writeSiteContent({
    ...siteContent,
    cityPages: siteContent.cityPages.map((item) => (item.id === id ? updatedPage : item))
  });

  res.json({ ok: true, message: "City page updated successfully.", page: updatedPage, pages: savedContent.cityPages });
});

app.delete("/api/admin/city-pages/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const siteContent = await readSiteContent();
  const targetPage = siteContent.cityPages.find((item) => item.id === id);

  if (!targetPage) {
    return res.status(404).json({ ok: false, message: "City page not found." });
  }

  const savedContent = await writeSiteContent({
    ...siteContent,
    cityPages: siteContent.cityPages.filter((item) => item.id !== id)
  });

  res.json({ ok: true, message: "City page deleted successfully.", pages: savedContent.cityPages });
});

app.get("/api/admin/blog-posts", requireAdminAuth, async (_req, res) => {
  const content = await readSiteContent();
  res.json({ ok: true, posts: content.blogPosts || [] });
});

app.post("/api/admin/blog-posts", requireAdminAuth, blogPostUpload, async (req, res) => {
  const { title = "", slug = "" } = req.body ?? {};
  const postTitle = String(title).trim();
  const postSlug = slugify(slug || title);

  if (!postTitle) {
    return res.status(400).json({ ok: false, message: "Post title is required." });
  }

  if (!postSlug) {
    return res.status(400).json({ ok: false, message: "Post slug is required." });
  }

  const siteContent = await readSiteContent();
  const hasDuplicateSlug = (siteContent.blogPosts || []).some((item) => item.slug === postSlug);

  if (hasDuplicateSlug) {
    return res.status(400).json({ ok: false, message: "This post slug is already in use." });
  }

  const files = req.files || {};
  const payload = {
    ...(req.body ?? {}),
    heroImage: files.heroImageFile?.[0] ? `/uploads/${files.heroImageFile[0].filename}` : req.body?.heroImage,
    featuredImage: files.featuredImageFile?.[0] ? `/uploads/${files.featuredImageFile[0].filename}` : req.body?.featuredImage,
    cardImage: files.cardImageFile?.[0] ? `/uploads/${files.cardImageFile[0].filename}` : req.body?.cardImage,
    sectionTwoImage: files.sectionTwoImageFile?.[0] ? `/uploads/${files.sectionTwoImageFile[0].filename}` : req.body?.sectionTwoImage,
    sectionOneParagraphs: parseListField(req.body?.sectionOneParagraphs),
    sectionTwoParagraphs: parseListField(req.body?.sectionTwoParagraphs),
    sectionTwoChecklist: parseListField(req.body?.sectionTwoChecklist),
    sectionThreeParagraphs: parseListField(req.body?.sectionThreeParagraphs),
    sectionThreeChecklist: parseListField(req.body?.sectionThreeChecklist),
    tags: parseListField(req.body?.tags)
  };

  const post = createDefaultBlogPost(payload);
  const savedContent = await writeSiteContent({
    ...siteContent,
    blogPosts: [post, ...(siteContent.blogPosts || [])]
  });

  res.json({ ok: true, message: "Blog post created successfully.", post, posts: savedContent.blogPosts });
});

app.put("/api/admin/blog-posts/:id", requireAdminAuth, blogPostUpload, async (req, res) => {
  const { id } = req.params;
  const siteContent = await readSiteContent();
  const targetPost = (siteContent.blogPosts || []).find((item) => item.id === id);

  if (!targetPost) {
    return res.status(404).json({ ok: false, message: "Blog post not found." });
  }

  const files = req.files || {};
  const payload = {
    ...(req.body ?? {}),
    heroImage: files.heroImageFile?.[0] ? `/uploads/${files.heroImageFile[0].filename}` : req.body?.heroImage,
    featuredImage: files.featuredImageFile?.[0] ? `/uploads/${files.featuredImageFile[0].filename}` : req.body?.featuredImage,
    cardImage: files.cardImageFile?.[0] ? `/uploads/${files.cardImageFile[0].filename}` : req.body?.cardImage,
    sectionTwoImage: files.sectionTwoImageFile?.[0] ? `/uploads/${files.sectionTwoImageFile[0].filename}` : req.body?.sectionTwoImage,
    sectionOneParagraphs: parseListField(req.body?.sectionOneParagraphs, targetPost.sectionOneParagraphs || []),
    sectionTwoParagraphs: parseListField(req.body?.sectionTwoParagraphs, targetPost.sectionTwoParagraphs || []),
    sectionTwoChecklist: parseListField(req.body?.sectionTwoChecklist, targetPost.sectionTwoChecklist || []),
    sectionThreeParagraphs: parseListField(req.body?.sectionThreeParagraphs, targetPost.sectionThreeParagraphs || []),
    sectionThreeChecklist: parseListField(req.body?.sectionThreeChecklist, targetPost.sectionThreeChecklist || []),
    tags: parseListField(req.body?.tags, targetPost.tags || [])
  };

  const updatedPost = buildUpdatedBlogPost(targetPost, payload);
  const hasDuplicateSlug = (siteContent.blogPosts || []).some((item) => item.id !== id && item.slug === updatedPost.slug);

  if (hasDuplicateSlug) {
    return res.status(400).json({ ok: false, message: "This post slug is already in use." });
  }

  const savedContent = await writeSiteContent({
    ...siteContent,
    blogPosts: (siteContent.blogPosts || []).map((item) => (item.id === id ? updatedPost : item))
  });

  res.json({ ok: true, message: "Blog post updated successfully.", post: updatedPost, posts: savedContent.blogPosts });
});

app.delete("/api/admin/blog-posts/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const siteContent = await readSiteContent();
  const targetPost = (siteContent.blogPosts || []).find((item) => item.id === id);

  if (!targetPost) {
    return res.status(404).json({ ok: false, message: "Blog post not found." });
  }

  const savedContent = await writeSiteContent({
    ...siteContent,
    blogPosts: (siteContent.blogPosts || []).filter((item) => item.id !== id)
  });

  res.json({ ok: true, message: "Blog post deleted successfully.", posts: savedContent.blogPosts });
});

app.get("/api/public/blog-posts", async (_req, res) => {
  const content = await readSiteContent();
  const posts = (content.blogPosts || []).filter((item) => item.status !== "Draft");
  res.json({ ok: true, posts });
});

app.get("/api/public/blog-posts/:slug", async (req, res) => {
  const { slug } = req.params;
  const content = await readSiteContent();
  const post = (content.blogPosts || []).find((item) => item.slug === slug && item.status !== "Draft");

  if (!post) {
    return res.status(404).json({ ok: false, message: "Blog post not found." });
  }

  const posts = (content.blogPosts || []).filter((item) => item.status !== "Draft");
  res.json({ ok: true, post, posts });
});

app.get("/api/public/content", async (_req, res) => {
  const content = await readSiteContent();
  res.json({ ok: true, content });
});

app.get("/api/public/content/hero", async (_req, res) => {
  const content = await readSiteContent();
  res.json({ ok: true, hero: content.hero });
});

app.get("/api/public/pages/:slug", async (req, res) => {
  const { slug } = req.params;
  const siteContent = await readSiteContent();
  const page = siteContent.customPages.find((item) => item.slug === slug);

  if (!page) {
    return res.status(404).json({ ok: false, message: "Page not found." });
  }

  res.json({ ok: true, page });
});

app.get("/api/public/city-pages/:slug", async (req, res) => {
  const { slug } = req.params;
  const siteContent = await readSiteContent();
  const page = siteContent.cityPages.find((item) => item.slug === slug);

  if (!page) {
    return res.status(404).json({ ok: false, message: "City page not found." });
  }

  res.json({ ok: true, page });
});

app.listen(port, () => {
  console.log(`Rocket backend running on http://localhost:${port}`);
});







