import "dotenv/config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { copyFile, mkdir, readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { allAdminPermissions, readAdmin, writeAdmin } from "./adminStore.js";
import { readSiteContent, writeSiteContent } from "./contentStore.js";
import { createDefaultLocationPage, defaultLocationSectionVisibility } from "./locationPageFactory.js";
import { backendRoot, publicWriteDirectory, uploadsDirectory } from "./runtimePaths.js";

const app = express();
const port = process.env.PORT || 5000;
const adminAuthSecret = process.env.ADMIN_AUTH_SECRET || "rocket-admin-secret";
const sessionLifetimeMs = 1000 * 60 * 60 * 12;
const maxUploadSizeBytes = 8 * 1024 * 1024;
const minAdminPasswordLength = 10;
const allowedUploadTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((item) => item.trim()).filter(Boolean)
  : true;
const publicUploadsDirectory = path.join(publicWriteDirectory, "uploads");
const frontendIndexPath = path.join(publicWriteDirectory, "index.html");
const publicSiteOrigin = String(process.env.PUBLIC_SITE_ORIGIN || process.env.SITE_ORIGIN || "https://rocketrubbishremoval.com")
  .trim()
  .replace(/\/+$/, "");

await mkdir(uploadsDirectory, { recursive: true });
await mkdir(publicUploadsDirectory, { recursive: true });

function getFrontendHtmlPath(requestPath = "/") {
  const cleanPath = decodeURIComponent(String(requestPath || "/").split("?")[0])
    .replace(/\/+$/, "") || "/";

  if (cleanPath === "/") {
    return frontendIndexPath;
  }

  const segments = cleanPath.split("/").filter(Boolean);
  const safeSegments = segments.map((segment) => segment.replace(/[^a-zA-Z0-9-_]/g, ""));

  const candidates = [
    path.join(publicWriteDirectory, `${safeSegments.join("/")}.html`),
    path.join(publicWriteDirectory, ...safeSegments, "index.html")
  ];

  if (safeSegments[0] === "blog" && safeSegments[1]) {
    candidates.push(path.join(publicWriteDirectory, "blog", "[slug].html"));
  }

  if (safeSegments[0] === "cities" && safeSegments[1]) {
    candidates.push(path.join(publicWriteDirectory, "cities", "[slug].html"));
  }

  if (safeSegments[0] === "admin" && safeSegments[1] === "blogs" && safeSegments[2]) {
    candidates.push(path.join(publicWriteDirectory, "admin", "blogs", "[id].html"));
  }

  if (safeSegments.length === 1) {
    candidates.push(path.join(publicWriteDirectory, "[slug].html"));
  }

  return candidates.find((candidate) => existsSync(candidate)) || frontendIndexPath;
}

async function mirrorUploadedFile(file) {
  if (!file?.filename || !file?.path) {
    return "";
  }

  const publicPath = `/uploads/${file.filename}`;

  try {
    await mkdir(publicUploadsDirectory, { recursive: true });
    await copyFile(file.path, path.join(publicUploadsDirectory, file.filename));
  } catch (error) {
    console.error(`Unable to mirror uploaded file ${file.filename}`, error);
  }

  return publicPath;
}

async function mirrorExistingUploads() {
  try {
    await mkdir(publicUploadsDirectory, { recursive: true });
    const entries = await readdir(uploadsDirectory, { withFileTypes: true });

    await Promise.all(entries
      .filter((entry) => entry.isFile())
      .map((entry) => copyFile(
        path.join(uploadsDirectory, entry.name),
        path.join(publicUploadsDirectory, entry.name)
      ).catch((error) => {
        console.error(`Unable to mirror existing upload ${entry.name}`, error);
      })));
  } catch (error) {
    console.error("Unable to mirror existing uploads", error);
  }
}

await mirrorExistingUploads();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${file.fieldname}-${Date.now()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxUploadSizeBytes,
    files: 4
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedUploadTypes.has(file.mimetype)) {
      callback(new Error("Only image files can be uploaded."));
      return;
    }

    callback(null, true);
  }
});
const cityPageUpload = upload.fields([
  { name: 'heroImageFile', maxCount: 1 },
  { name: 'wasteImageFile', maxCount: 1 }
]);
const blogPostUpload = upload.fields([
  { name: 'heroImageFile', maxCount: 1 },
  { name: 'featuredImageFile', maxCount: 1 },
  { name: 'cardImageFile', maxCount: 1 },
  { name: 'sectionTwoImageFile', maxCount: 1 }
]);

const adminPermissionLabels = {
  dashboard: "Dashboard",
  seo: "SEO",
  "city-pages": "City Pages",
  blogs: "Blogs",
  contacts: "Contacts",
  profile: "Profile",
  users: "Users"
};

function getPublicAdminProfile(admin) {
  return {
    id: admin.id || "owner",
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    avatar: admin.avatar || "/images/rocket/form2.png",
    role: admin.role || "owner",
    status: admin.status || "Active",
    permissions: Array.isArray(admin.permissions) ? admin.permissions : allAdminPermissions,
    isOwner: (admin.role || "owner") === "owner",
    updatedAt: admin.updatedAt || ""
  };
}

function validateAdminPassword(password) {
  const nextPassword = String(password || "");

  if (nextPassword.length < minAdminPasswordLength) {
    return `Password must be at least ${minAdminPasswordLength} characters.`;
  }

  if (!/[A-Za-z]/.test(nextPassword) || !/[0-9]/.test(nextPassword)) {
    return "Password must include at least one letter and one number.";
  }

  return "";
}

async function verifyUserPassword(user, password) {
  const candidate = String(password || "");

  if (user.passwordHash) {
    return bcrypt.compare(candidate, user.passwordHash);
  }

  return Boolean(user.password) && candidate === user.password;
}

async function hashAdminPassword(password) {
  return bcrypt.hash(String(password || ""), 12);
}

function createAdminToken(admin) {
  const payload = {
    userId: admin.id || "owner",
    email: admin.email,
    role: admin.role || "owner",
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

async function requireAdminAuth(req, res, next) {
  const session = verifyAdminToken(getBearerToken(req));

  if (!session) {
    return res.status(401).json({ ok: false, message: "Unauthorized request." });
  }

  const admin = await readAdmin();
  const user = (admin.users || []).find((item) => item.id === session.userId || item.email === session.email);

  if (!user || user.status === "Inactive") {
    return res.status(401).json({ ok: false, message: "Unauthorized request." });
  }

  req.adminSession = session;
  req.adminUser = user;
  return next();
}

function userHasPermission(user, permission) {
  if ((user?.role || "") === "owner") {
    return true;
  }

  return Array.isArray(user?.permissions) && user.permissions.includes(permission);
}

function userCanAccessCityPage(user, pageId) {
  if ((user?.role || "") === "owner") {
    return true;
  }

  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  return permissions.includes("city-pages") || permissions.includes(`city:${pageId}`);
}

function toCityPageSummary(page) {
  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    canonicalPath: page.canonicalPath || `/cities/${page.slug}`,
    updatedAt: page.updatedAt || page.createdAt || ""
  };
}

function filterAccessibleCityPages(pages, user) {
  const nextPages = Array.isArray(pages) ? pages : [];

  if ((user?.role || "") === "owner") {
    return nextPages;
  }

  return nextPages.filter((page) => userCanAccessCityPage(user, page.id));
}

function requireAdminOwner(req, res, next) {
  if ((req.adminUser?.role || "") !== "owner") {
    return res.status(403).json({ ok: false, message: "Only the main admin can manage users." });
  }

  return next();
}

function requireAdminPermission(permission) {
  return (req, res, next) => {
    const hasCitySpecificAccess = permission === "city-pages" && Array.isArray(req.adminUser?.permissions)
      ? req.adminUser.permissions.some((item) => String(item).startsWith("city:"))
      : false;

    if (!userHasPermission(req.adminUser, permission) && !hasCitySpecificAccess) {
      return res.status(403).json({
        ok: false,
        message: `You do not have access to ${adminPermissionLabels[permission] || "this page"}.`
      });
    }

    return next();
  };
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseJsonField(value, fallback = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function parseListField(value, fallback = []) {
  if (Array.isArray(value)) {
    const next = value.map((item) => String(item).trim()).filter(Boolean);
    return next.length > 0 ? next : fallback;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      const next = parsed.map((item) => String(item).trim()).filter(Boolean);
      return next.length > 0 ? next : fallback;
    }
  } catch {
  }

  const next = trimmed
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return next.length > 0 ? next : fallback;
}

function normaliseFaqItems(value, fallback = []) {
  if (Array.isArray(value)) {
    const next = value
      .map((item) => ({
        question: String(item?.question || "").trim(),
        answer: String(item?.answer || "").trim()
      }))
      .filter((item) => item.question && item.answer);

    return next.length > 0 ? next : fallback;
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return normaliseFaqItems(parsed, fallback);
      }
    } catch {
    }
  }

  return fallback;
}
function defaultCitySectionVisibility() {
  return defaultLocationSectionVisibility();
}

function createDefaultCityPage(name, slug, options = {}) {
  const pageName = String(name || "City").trim() || "City";
  const pageSlug = slugify(slug || name || pageName);
  const sourceType = String(options.sourceType || "location").trim() === "region" ? "region" : "location";
  const regionName = String(options.regionName || pageName).trim() || pageName;

  return createDefaultLocationPage({
    name: pageName,
    slug: pageSlug,
    regionName,
    sourceType
  });
}

function normaliseBulletList(value, fallback = []) {
  return parseListField(value, fallback);
}

function buildUpdatedCityPage(current, payload = {}) {
  const name = String(payload.name ?? current.name ?? "").trim() || current.name;
  const slug = slugify(payload.slug || current.slug || name);
  const sourceType = String(payload.sourceType ?? current.sourceType ?? "location").trim() === "region" ? "region" : "location";
  const regionName = String(payload.regionName ?? current.regionName ?? name).trim() || name;
  const generated = createDefaultLocationPage({
    name,
    slug,
    regionName,
    sourceType
  });
  const sectionVisibility = {
    ...defaultCitySectionVisibility(),
    ...(generated.sectionVisibility || {}),
    ...(current.sectionVisibility || {}),
    ...(payload.sectionVisibility || {})
  };
  const sameDayBullets = normaliseBulletList(payload.sameDayBullets, current.sameDayBullets || generated.sameDayBullets || []);
  const faqItems = normaliseFaqItems(payload.faqItems, current.faqItems || generated.faqItems || []);

  return {
    ...generated,
    ...current,
    sectionVisibility,
    name,
    slug,
    sourceType,
    locationType: generated.locationType,
    regionName: generated.regionName,
    callButtonNumber: String(payload.callButtonNumber ?? current.callButtonNumber ?? current.phoneNumber ?? "").trim(),
    whatsappButtonNumber: String(payload.whatsappButtonNumber ?? current.whatsappButtonNumber ?? current.whatsappNumber ?? "").trim(),
    metaTitle: String(payload.metaTitle ?? current.metaTitle ?? generated.metaTitle).trim() || generated.metaTitle,
    metaDescription:
      String(payload.metaDescription ?? current.metaDescription ?? generated.metaDescription).trim() || generated.metaDescription,
    canonicalPath: String(payload.canonicalPath ?? current.canonicalPath ?? generated.canonicalPath).trim() || generated.canonicalPath,
    ogTitle: String(payload.ogTitle ?? current.ogTitle ?? generated.ogTitle).trim() || generated.ogTitle,
    ogDescription:
      String(payload.ogDescription ?? current.ogDescription ?? generated.ogDescription).trim() || generated.ogDescription,
    ogImage:
      String(payload.ogImage ?? current.ogImage ?? payload.heroImage ?? current.heroImage ?? generated.ogImage).trim() ||
      generated.ogImage,
    heroAlt: String(payload.heroAlt ?? current.heroAlt ?? generated.heroAlt).trim() || generated.heroAlt,
    heroTitle: String(payload.heroTitle ?? current.heroTitle ?? generated.heroTitle).trim() || generated.heroTitle,
    heroSubheadline:
      String(payload.heroSubheadline ?? current.heroSubheadline ?? generated.heroSubheadline ?? "").trim() ||
      generated.heroSubheadline,
    heroText: String(payload.heroText ?? current.heroText ?? generated.heroText).trim() || generated.heroText,
    heroImage: String(payload.heroImage ?? current.heroImage ?? generated.heroImage).trim() || generated.heroImage,
    servicesTitle: String(payload.servicesTitle ?? current.servicesTitle ?? generated.servicesTitle).trim() || generated.servicesTitle,
    servicesText: String(payload.servicesText ?? current.servicesText ?? generated.servicesText).trim() || generated.servicesText,
    highlightsTitle: String(payload.highlightsTitle ?? current.highlightsTitle ?? generated.highlightsTitle).trim() || generated.highlightsTitle,
    sameDayTitle: String(payload.sameDayTitle ?? current.sameDayTitle ?? generated.sameDayTitle).trim() || generated.sameDayTitle,
    sameDayIntro: String(payload.sameDayIntro ?? current.sameDayIntro ?? generated.sameDayIntro).trim() || generated.sameDayIntro,
    sameDayBullets,
    sameDayFooter: String(payload.sameDayFooter ?? current.sameDayFooter ?? generated.sameDayFooter).trim() || generated.sameDayFooter,
    wasteTitle: String(payload.wasteTitle ?? current.wasteTitle ?? generated.wasteTitle).trim() || generated.wasteTitle,
    wasteText: String(payload.wasteText ?? current.wasteText ?? generated.wasteText).trim() || generated.wasteText,
    wasteImage: String(payload.wasteImage ?? current.wasteImage ?? generated.wasteImage).trim() || generated.wasteImage,
    wasteAlt:
      String(payload.wasteAlt ?? current.wasteAlt ?? generated.wasteAlt ?? payload.wasteTitle ?? current.wasteTitle ?? generated.wasteTitle).trim() ||
      generated.wasteTitle,
    wasteSubTitle: String(payload.wasteSubTitle ?? current.wasteSubTitle ?? generated.wasteSubTitle).trim() || generated.wasteSubTitle,
    wasteSubText: String(payload.wasteSubText ?? current.wasteSubText ?? generated.wasteSubText).trim() || generated.wasteSubText,
    propertyTitle:
      String(payload.propertyTitle ?? current.propertyTitle ?? generated.propertyTitle).trim() || generated.propertyTitle,
    propertyText: String(payload.propertyText ?? current.propertyText ?? generated.propertyText).trim() || generated.propertyText,
    propertyImage:
      String(payload.propertyImage ?? current.propertyImage ?? generated.propertyImage).trim() || generated.propertyImage,
    propertyAlt:
      String(
        payload.propertyAlt ??
          current.propertyAlt ??
          generated.propertyAlt ??
          payload.propertyTitle ??
          current.propertyTitle ??
          generated.propertyTitle
      ).trim() || generated.propertyTitle,
    greenTitle: String(payload.greenTitle ?? current.greenTitle ?? generated.greenTitle).trim() || generated.greenTitle,
    greenSubtitle:
      String(payload.greenSubtitle ?? current.greenSubtitle ?? generated.greenSubtitle).trim() || generated.greenSubtitle,
    greenFooter: String(payload.greenFooter ?? current.greenFooter ?? generated.greenFooter).trim() || generated.greenFooter,
    compareTitle: String(payload.compareTitle ?? current.compareTitle ?? generated.compareTitle).trim() || generated.compareTitle,
    compareText: String(payload.compareText ?? current.compareText ?? generated.compareText).trim() || generated.compareText,
    mapTitle: String(payload.mapTitle ?? current.mapTitle ?? generated.mapTitle).trim() || generated.mapTitle,
    mapText: String(payload.mapText ?? current.mapText ?? generated.mapText).trim() || generated.mapText,
    faqItems,
    createdAt: current.createdAt || generated.createdAt,
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
  const blogImage =
    String(payload.featuredImage || payload.heroImage || payload.cardImage || "/images/rocket/Post_Image1.png").trim() ||
    "/images/rocket/Post_Image1.png";

  return {
    id: crypto.randomUUID(),
    title,
    slug,
    category: String(payload.category || "Rubbish Removal Tips").trim() || "Rubbish Removal Tips",
    author: String(payload.author || "Admin - Rocket Rubbish").trim() || "Admin - Rocket Rubbish",
    date: formatBlogDate(payload.date),
    status: String(payload.status || "Draft").trim() || "Draft",
    metaTitle: String(payload.metaTitle || "").trim(),
    metaDescription: String(payload.metaDescription || "").trim(),
    heroImage: blogImage,
    featuredImage: blogImage,
    cardImage: blogImage,
    excerpt: String(payload.excerpt || "").trim(),
    intro: String(payload.intro || "").trim(),
    introHtml: String(payload.introHtml || "").trim(),
    contentHtml: String(payload.contentHtml || "").trim(),
    faqItems: normaliseFaqItems(payload.faqItems),
    sectionOneTitle: String(payload.sectionOneTitle || "1. Section Title").trim() || "1. Section Title",
    sectionOneParagraphs: normaliseBulletList(payload.sectionOneParagraphs),
    sectionOneBodyHtml: String(payload.sectionOneBodyHtml || "").trim(),
    sectionTwoTitle: String(payload.sectionTwoTitle || "2. Section Title").trim() || "2. Section Title",
    sectionTwoParagraphs: normaliseBulletList(payload.sectionTwoParagraphs),
    sectionTwoBodyHtml: String(payload.sectionTwoBodyHtml || "").trim(),
    sectionTwoChecklistTitle: String(payload.sectionTwoChecklistTitle || "").trim(),
    sectionTwoChecklist: normaliseBulletList(payload.sectionTwoChecklist),
    sectionTwoImage: String(payload.sectionTwoImage || "").trim(),
    quoteText: String(payload.quoteText || "").trim(),
    quoteHtml: String(payload.quoteHtml || "").trim(),
    quoteAuthor: String(payload.quoteAuthor || "").trim(),
    sectionThreeTitle: String(payload.sectionThreeTitle || "3. Section Title").trim() || "3. Section Title",
    sectionThreeParagraphs: normaliseBulletList(payload.sectionThreeParagraphs),
    sectionThreeBodyHtml: String(payload.sectionThreeBodyHtml || "").trim(),
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
  const blogImage = String(
    payload.featuredImage ??
      payload.heroImage ??
      payload.cardImage ??
      current.featuredImage ??
      current.heroImage ??
      current.cardImage ??
      ""
  ).trim();

  return {
    ...current,
    title,
    slug,
    category: String(payload.category ?? current.category ?? "").trim(),
    author: String(payload.author ?? current.author ?? "").trim(),
    date: formatBlogDate(payload.date ?? current.date),
    status: String(payload.status ?? current.status ?? "").trim() || current.status,
    metaTitle: String(payload.metaTitle ?? current.metaTitle ?? "").trim(),
    metaDescription: String(payload.metaDescription ?? current.metaDescription ?? "").trim(),
    heroImage: blogImage,
    featuredImage: blogImage,
    cardImage: blogImage,
    excerpt: String(payload.excerpt ?? current.excerpt ?? "").trim(),
    intro: String(payload.intro ?? current.intro ?? "").trim(),
    introHtml: String(payload.introHtml ?? current.introHtml ?? "").trim(),
    contentHtml: String(payload.contentHtml ?? current.contentHtml ?? "").trim(),
    faqItems: normaliseFaqItems(payload.faqItems, current.faqItems || []),
    sectionOneTitle: String(payload.sectionOneTitle ?? current.sectionOneTitle ?? "").trim(),
    sectionOneParagraphs: normaliseBulletList(payload.sectionOneParagraphs, current.sectionOneParagraphs || []),
    sectionOneBodyHtml: String(payload.sectionOneBodyHtml ?? current.sectionOneBodyHtml ?? "").trim(),
    sectionTwoTitle: String(payload.sectionTwoTitle ?? current.sectionTwoTitle ?? "").trim(),
    sectionTwoParagraphs: normaliseBulletList(payload.sectionTwoParagraphs, current.sectionTwoParagraphs || []),
    sectionTwoBodyHtml: String(payload.sectionTwoBodyHtml ?? current.sectionTwoBodyHtml ?? "").trim(),
    sectionTwoChecklistTitle: String(payload.sectionTwoChecklistTitle ?? current.sectionTwoChecklistTitle ?? "").trim(),
    sectionTwoChecklist: normaliseBulletList(payload.sectionTwoChecklist, current.sectionTwoChecklist || []),
    sectionTwoImage: String(payload.sectionTwoImage ?? current.sectionTwoImage ?? "").trim(),
    quoteText: String(payload.quoteText ?? current.quoteText ?? "").trim(),
    quoteHtml: String(payload.quoteHtml ?? current.quoteHtml ?? "").trim(),
    quoteAuthor: String(payload.quoteAuthor ?? current.quoteAuthor ?? "").trim(),
    sectionThreeTitle: String(payload.sectionThreeTitle ?? current.sectionThreeTitle ?? "").trim(),
    sectionThreeParagraphs: normaliseBulletList(payload.sectionThreeParagraphs, current.sectionThreeParagraphs || []),
    sectionThreeBodyHtml: String(payload.sectionThreeBodyHtml ?? current.sectionThreeBodyHtml ?? "").trim(),
    sectionThreeChecklistTitle: String(payload.sectionThreeChecklistTitle ?? current.sectionThreeChecklistTitle ?? "").trim(),
    sectionThreeChecklist: normaliseBulletList(payload.sectionThreeChecklist, current.sectionThreeChecklist || []),
    tags: normaliseBulletList(payload.tags, current.tags || []),
    updatedAt: new Date().toISOString()
  };
}

function formatContactInquiryDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value);
}

function createContactInquiry(payload = {}) {
  const sourceKey = String(payload.source || "homepage").trim().toLowerCase();
  const source = sourceKey === "contact" ? "Contact Page Quote Form" : "Homepage Quote Form";
  const clearing = String(payload.clearing || "").trim();
  const load = String(payload.load || "").trim();
  const postcode = String(payload.postcode || "").trim().toUpperCase();
  const timing = String(payload.timing || "").trim();
  const extraMessage = String(payload.message || "").trim();
  const now = new Date();
  const messageParts = [
    `Source: ${source}`,
    clearing ? `Clearing: ${clearing}` : "",
    load ? `Load: ${load}` : "",
    postcode ? `Postcode: ${postcode}` : "",
    timing ? `Collection Timing: ${timing}` : "",
    extraMessage ? `Message: ${extraMessage}` : ""
  ].filter(Boolean);
  const previewParts = [clearing, load, postcode].filter(Boolean);

  return {
    id: crypto.randomUUID(),
    name: String(payload.name || source).trim() || source,
    email: String(payload.email || "Not provided").trim() || "Not provided",
    messagePreview: previewParts.length > 0 ? previewParts.join(" | ") : source,
    message: messageParts.join("\n"),
    date: formatContactInquiryDate(now),
    status: "New",
    source,
    clearing,
    load,
    postcode,
    timing,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
}

function escapeHtmlAttribute(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalisePagePath(value = "/") {
  const [pathName = "/"] = String(value || "/").split("?");
  const cleanPath = pathName || "/";
  return cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : "/";
}

function buildAbsoluteUrl(req, value = "/") {
  const nextValue = String(value || "/").trim();

  if (/^https?:\/\//i.test(nextValue)) {
    return nextValue;
  }

  const requestOrigin = req
    ? `${req.headers["x-forwarded-proto"] || req.protocol || "https"}://${req.headers["x-forwarded-host"] || req.headers.host || publicSiteOrigin.replace(/^https?:\/\//, "")}`
    : publicSiteOrigin;

  return `${String(requestOrigin).replace(/\/+$/, "")}${nextValue.startsWith("/") ? nextValue : `/${nextValue}`}`;
}

function resolveHtmlSeo(req, content) {
  const pathName = normalisePagePath(req.path);
  const defaultSeo = {
    title: "Rocket Rubbish Removal",
    description: "Rocket Rubbish Removal provides rubbish clearance, waste collection, junk removal, waste disposal, and skip hire support across the UK.",
    path: pathName,
    image: "/images/rocket/logo_h.svg",
    type: "website",
    robots: "index,follow"
  };
  const pageImages = {
    "/": "/images/rocket/home-page-banner-mobile.jpg",
    "/services": "/images/rocket/gb_1.png",
    "/blog": "/images/rocket/quote-photo.jpg",
    "/locations": "/images/rocket/generic-uk-residential-banner.jpg",
    "/how-it-works": "/images/rocket/how_work.png",
    "/about-us": "/images/rocket/Article_Image.jpg",
    "/contact-us": "/images/rocket/contact_page.jpg"
  };

  if (pathName.startsWith("/admin")) {
    return {
      ...defaultSeo,
      title: "Admin Login",
      description: "Secure admin area for Rocket Rubbish Removal.",
      path: pathName,
      robots: "noindex,nofollow"
    };
  }

  if (pathName.startsWith("/cities/")) {
    const slug = pathName.replace("/cities/", "");
    const page = (content.cityPages || []).find((item) => item.slug === slug);

    if (page) {
      return {
        ...defaultSeo,
        title: page.metaTitle || page.heroTitle || page.name,
        description: page.metaDescription || page.heroText || defaultSeo.description,
        path: page.canonicalPath || `/cities/${page.slug}`,
        image: page.ogImage || page.heroImage || defaultSeo.image
      };
    }
  }

  if (pathName.startsWith("/blog/")) {
    const slug = pathName.replace("/blog/", "");
    const post = (content.blogPosts || []).find((item) => item.slug === slug && item.status !== "Draft");

    if (post) {
      return {
        ...defaultSeo,
        title: post.metaTitle || post.title || defaultSeo.title,
        description: post.metaDescription || post.excerpt || stripHtml(post.introHtml) || post.intro || defaultSeo.description,
        path: `/blog/${post.slug}`,
        image: post.heroImage || post.featuredImage || post.cardImage || defaultSeo.image,
        type: "article"
      };
    }
  }

  const managedPage = Object.values(content.pageSeo || {}).find((item) => normalisePagePath(item.path) === pathName);
  if (managedPage) {
    return {
      ...defaultSeo,
      title: managedPage.metaTitle || defaultSeo.title,
      description: managedPage.metaDescription || defaultSeo.description,
      path: managedPage.path || pathName,
      image: pageImages[pathName] || defaultSeo.image
    };
  }

  const customPage = (content.customPages || []).find((item) => normalisePagePath(`/${item.slug}`) === pathName);
  if (customPage) {
    return {
      ...defaultSeo,
      title: customPage.metaTitle || customPage.title || customPage.pageTitle || defaultSeo.title,
      description: customPage.metaDescription || customPage.description || defaultSeo.description,
      path: `/${customPage.slug}`,
      image: customPage.ogImage || customPage.heroImage || defaultSeo.image
    };
  }

  return defaultSeo;
}

function replaceOrInsertHeadTag(html, matcher, replacement) {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }

  return html.replace("</head>", `  ${replacement}\n</head>`);
}

function injectHtmlSeo(html, seo, req) {
  const title = escapeHtmlAttribute(seo.title);
  const description = escapeHtmlAttribute(seo.description);
  const canonical = escapeHtmlAttribute(buildAbsoluteUrl(req, seo.path));
  const image = escapeHtmlAttribute(buildAbsoluteUrl(req, seo.image));
  const type = escapeHtmlAttribute(seo.type || "website");
  const robots = escapeHtmlAttribute(seo.robots || "index,follow");
  let nextHtml = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  const tags = [
    {
      matcher: /<meta\s+name=["']description["'][^>]*>/i,
      replacement: `<meta name="description" content="${description}" />`
    },
    {
      matcher: /<meta\s+name=["']robots["'][^>]*>/i,
      replacement: `<meta name="robots" content="${robots}" />`
    },
    {
      matcher: /<link\s+rel=["']canonical["'][^>]*>/i,
      replacement: `<link rel="canonical" href="${canonical}" />`
    },
    {
      matcher: /<meta\s+property=["']og:title["'][^>]*>/i,
      replacement: `<meta property="og:title" content="${title}" />`
    },
    {
      matcher: /<meta\s+property=["']og:description["'][^>]*>/i,
      replacement: `<meta property="og:description" content="${description}" />`
    },
    {
      matcher: /<meta\s+property=["']og:type["'][^>]*>/i,
      replacement: `<meta property="og:type" content="${type}" />`
    },
    {
      matcher: /<meta\s+property=["']og:url["'][^>]*>/i,
      replacement: `<meta property="og:url" content="${canonical}" />`
    },
    {
      matcher: /<meta\s+property=["']og:image["'][^>]*>/i,
      replacement: `<meta property="og:image" content="${image}" />`
    },
    {
      matcher: /<meta\s+name=["']twitter:title["'][^>]*>/i,
      replacement: `<meta name="twitter:title" content="${title}" />`
    },
    {
      matcher: /<meta\s+name=["']twitter:description["'][^>]*>/i,
      replacement: `<meta name="twitter:description" content="${description}" />`
    },
    {
      matcher: /<meta\s+name=["']twitter:image["'][^>]*>/i,
      replacement: `<meta name="twitter:image" content="${image}" />`
    }
  ];

  tags.forEach((tag) => {
    nextHtml = replaceOrInsertHeadTag(nextHtml, tag.matcher, tag.replacement);
  });

  return nextHtml;
}
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use("/uploads", express.static(uploadsDirectory, {
  etag: true,
  maxAge: "1h"
}));
app.use(express.static(publicWriteDirectory, {
  etag: true,
  index: false,
  maxAge: "30d"
}));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Rocket backend is running." });
});

app.post("/api/admin/login", async (req, res) => {
  const { email = "", password = "" } = req.body ?? {};
  const admin = await readAdmin();
  const loginEmail = String(email || "").trim().toLowerCase();
  const loginPassword = String(password || "").trim();
  const user = loginEmail
    ? (admin.users || []).find((item) => item.email.toLowerCase() === loginEmail)
    : (admin.users || []).find((item) => item.role === "owner") || admin;

  if (!user || user.status === "Inactive" || !(await verifyUserPassword(user, loginPassword))) {
    return res.status(401).json({ ok: false, message: "Invalid password." });
  }

  if (!user.passwordHash) {
    const passwordHash = await hashAdminPassword(loginPassword);
    const updatedUsers = (admin.users || []).map((item) => (
      item.id === user.id ? { ...item, passwordHash, password: undefined, updatedAt: new Date().toISOString() } : item
    ));
    const ownerUser = updatedUsers.find((item) => item.role === "owner") || user;
    await writeAdmin({
      ...admin,
      passwordHash: ownerUser.passwordHash,
      password: undefined,
      users: updatedUsers
    });
    user.passwordHash = passwordHash;
    delete user.password;
  }

  return res.json({
    ok: true,
    token: createAdminToken(user),
    admin: getPublicAdminProfile(user)
  });
});

app.get("/api/admin/profile", requireAdminAuth, async (req, res) => {
  res.json({ ok: true, profile: getPublicAdminProfile(req.adminUser) });
});

app.put("/api/admin/profile", requireAdminAuth, upload.single("profileImage"), async (req, res) => {
  const { name = "", email = "", phone = "" } = req.body ?? {};
  const admin = await readAdmin();
  const userId = req.adminUser.id;
  const nextEmail = email.trim() || req.adminUser.email;
  const uploadedAvatar = req.file ? await mirrorUploadedFile(req.file) : "";
  const hasDuplicateEmail = (admin.users || []).some((user) => user.id !== userId && user.email.toLowerCase() === nextEmail.toLowerCase());

  if (hasDuplicateEmail) {
    return res.status(400).json({ ok: false, message: "This email is already used by another admin user." });
  }

  const updatedUsers = (admin.users || []).map((user) => {
    if (user.id !== userId) {
      return user;
    }

    return {
      ...user,
      name: name.trim() || user.name,
      email: nextEmail,
      phone: phone.trim() || user.phone,
      avatar: uploadedAvatar || user.avatar || "/images/rocket/form2.png",
      updatedAt: new Date().toISOString()
    };
  });
  const updatedAdminUser = updatedUsers.find((user) => user.id === userId) || req.adminUser;
  const ownerUser = updatedUsers.find((user) => user.role === "owner") || updatedAdminUser;
  const updatedAdmin = {
    ...admin,
    name: ownerUser.name,
    email: ownerUser.email,
    phone: ownerUser.phone,
    avatar: ownerUser.avatar,
    passwordHash: ownerUser.passwordHash,
    password: ownerUser.password,
    users: updatedUsers
  };

  await writeAdmin(updatedAdmin);
  const savedAdmin = await readAdmin();
  const savedAdminUser = (savedAdmin.users || []).find((user) => user.id === userId) || updatedAdminUser;
  const publicProfile = getPublicAdminProfile({
    ...savedAdminUser,
    avatar: uploadedAvatar || savedAdminUser.avatar
  });

  res.json({
    ok: true,
    message: "Profile updated successfully.",
    avatarUpdated: Boolean(req.file),
    uploadedAvatar,
    profile: publicProfile
  });
});

app.put("/api/admin/change-password", requireAdminAuth, async (req, res) => {
  const { oldPassword = "", newPassword = "", confirmPassword = "" } = req.body ?? {};
  const admin = await readAdmin();
  const userId = req.adminUser.id;

  if (!(await verifyUserPassword(req.adminUser, oldPassword))) {
    return res.status(400).json({ ok: false, message: "Old password is incorrect." });
  }

  const passwordError = validateAdminPassword(newPassword);

  if (passwordError) {
    return res.status(400).json({ ok: false, message: passwordError });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ ok: false, message: "Passwords do not match." });
  }

  const passwordHash = await hashAdminPassword(newPassword);
  const updatedUsers = (admin.users || []).map((user) => (
    user.id === userId
      ? { ...user, passwordHash, password: undefined, updatedAt: new Date().toISOString() }
      : user
  ));
  const ownerUser = updatedUsers.find((user) => user.role === "owner") || admin.users?.[0] || admin;
  const updatedAdmin = {
    ...admin,
    passwordHash: ownerUser.passwordHash,
    password: ownerUser.password,
    users: updatedUsers
  };

  await writeAdmin(updatedAdmin);
  res.json({ ok: true, message: "Password updated successfully." });
});

app.get("/api/admin/users", requireAdminAuth, requireAdminOwner, async (_req, res) => {
  const admin = await readAdmin();
  const content = await readSiteContent();
  const users = (admin.users || []).map(getPublicAdminProfile);
  const cityPages = (content.cityPages || [])
    .map((page) => ({ id: page.id, name: page.name, slug: page.slug }))
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB", { sensitivity: "base" }));
  res.json({ ok: true, users, permissions: allAdminPermissions, permissionLabels: adminPermissionLabels, cityPages });
});

app.post("/api/admin/users", requireAdminAuth, requireAdminOwner, async (req, res) => {
  const { name = "", email = "", password = "", confirmPassword = "", permissions = [], status = "Active" } = req.body ?? {};
  const admin = await readAdmin();
  const nextEmail = String(email || "").trim().toLowerCase();
  const nextPassword = String(password || "").trim();

  if (!String(name || "").trim()) {
    return res.status(400).json({ ok: false, message: "User name is required." });
  }

  if (!nextEmail) {
    return res.status(400).json({ ok: false, message: "Email is required." });
  }

  if (!nextPassword) {
    return res.status(400).json({ ok: false, message: "Password is required." });
  }

  if (nextPassword !== String(confirmPassword || "").trim()) {
    return res.status(400).json({ ok: false, message: "Passwords do not match." });
  }

  const passwordError = validateAdminPassword(nextPassword);

  if (passwordError) {
    return res.status(400).json({ ok: false, message: passwordError });
  }

  if ((admin.users || []).some((user) => user.email.toLowerCase() === nextEmail)) {
    return res.status(400).json({ ok: false, message: "This email is already used." });
  }

  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: nextEmail,
    phone: "",
    avatar: "/images/rocket/form2.png",
    passwordHash: await hashAdminPassword(nextPassword),
    role: "editor",
    status: status === "Inactive" ? "Inactive" : "Active",
    permissions: Array.isArray(permissions)
      ? permissions.filter((permission) => (allAdminPermissions.includes(permission) && permission !== "users") || String(permission).startsWith("city:"))
      : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const savedAdmin = await writeAdmin({
    ...admin,
    users: [user, ...(admin.users || [])]
  }).then(readAdmin);

  res.status(201).json({ ok: true, message: "Admin user created successfully.", users: savedAdmin.users.map(getPublicAdminProfile) });
});

app.put("/api/admin/users/:id", requireAdminAuth, requireAdminOwner, async (req, res) => {
  const { id } = req.params;
  const { name = "", email = "", password = "", confirmPassword = "", permissions = [], status = "Active" } = req.body ?? {};
  const admin = await readAdmin();
  const targetUser = (admin.users || []).find((user) => user.id === id);

  if (!targetUser) {
    return res.status(404).json({ ok: false, message: "Admin user not found." });
  }

  if (targetUser.role === "owner") {
    return res.status(400).json({ ok: false, message: "The main admin must be edited from Profile." });
  }

  const nextEmail = String(email || "").trim().toLowerCase();

  if (!String(name || "").trim() || !nextEmail) {
    return res.status(400).json({ ok: false, message: "Name and email are required." });
  }

  if ((admin.users || []).some((user) => user.id !== id && user.email.toLowerCase() === nextEmail)) {
    return res.status(400).json({ ok: false, message: "This email is already used." });
  }

  const nextPassword = String(password || "").trim();
  const passwordError = nextPassword ? validateAdminPassword(nextPassword) : "";

  if (nextPassword && nextPassword !== String(confirmPassword || "").trim()) {
    return res.status(400).json({ ok: false, message: "Passwords do not match." });
  }

  if (passwordError) {
    return res.status(400).json({ ok: false, message: passwordError });
  }

  const nextPasswordHash = nextPassword ? await hashAdminPassword(nextPassword) : "";

  const updatedUsers = (admin.users || []).map((user) => {
    if (user.id !== id) {
      return user;
    }

    return {
      ...user,
      name: String(name).trim(),
      email: nextEmail,
      passwordHash: nextPasswordHash || user.passwordHash,
      password: nextPasswordHash ? undefined : user.password,
      status: status === "Inactive" ? "Inactive" : "Active",
      permissions: Array.isArray(permissions)
        ? permissions.filter((permission) => (allAdminPermissions.includes(permission) && permission !== "users") || String(permission).startsWith("city:"))
        : [],
      updatedAt: new Date().toISOString()
    };
  });

  await writeAdmin({ ...admin, users: updatedUsers });
  const savedAdmin = await readAdmin();
  res.json({ ok: true, message: "Admin user updated successfully.", users: savedAdmin.users.map(getPublicAdminProfile) });
});

app.delete("/api/admin/users/:id", requireAdminAuth, requireAdminOwner, async (req, res) => {
  const { id } = req.params;
  const admin = await readAdmin();
  const targetUser = (admin.users || []).find((user) => user.id === id);

  if (!targetUser) {
    return res.status(404).json({ ok: false, message: "Admin user not found." });
  }

  if (targetUser.role === "owner") {
    return res.status(400).json({ ok: false, message: "The main admin cannot be deleted." });
  }

  await writeAdmin({
    ...admin,
    users: (admin.users || []).filter((user) => user.id !== id)
  });
  const savedAdmin = await readAdmin();
  res.json({ ok: true, message: "Admin user deleted successfully.", users: savedAdmin.users.map(getPublicAdminProfile) });
});

app.use("/api/admin/dashboard-counts", requireAdminAuth, requireAdminPermission("dashboard"));
app.use("/api/admin/seo-pages", requireAdminAuth, requireAdminPermission("seo"));
app.use("/api/admin/city-pages", requireAdminAuth, requireAdminPermission("city-pages"));
app.use("/api/admin/blog-posts", requireAdminAuth, requireAdminPermission("blogs"));
app.use("/api/admin/contact-inquiries", requireAdminAuth, requireAdminPermission("contacts"));

app.get("/api/admin/dashboard-counts", requireAdminAuth, async (_req, res) => {
  const content = await readSiteContent();

  res.json({
    ok: true,
    counts: {
      cityPages: (content.cityPages || []).length,
      seoPages: Object.keys(content.pageSeo || {}).length,
      blogs: (content.blogPosts || []).length
    }
  });
});

app.get("/api/admin/seo-pages", requireAdminAuth, async (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const content = await readSiteContent();
  res.json({ ok: true, pages: content.pageSeo || {} });
});

app.put("/api/admin/seo-pages/:key", requireAdminAuth, async (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const { key } = req.params;
  const { metaTitle = "", metaDescription = "" } = req.body ?? {};
  const content = await readSiteContent();
  const currentPage = content.pageSeo?.[key];

  if (!currentPage) {
    return res.status(404).json({ ok: false, message: "SEO page not found." });
  }

  const updatedPage = {
    ...currentPage,
    metaTitle: String(metaTitle).trim() || currentPage.metaTitle,
    metaDescription: String(metaDescription).trim() || currentPage.metaDescription
  };

  const savedContent = await writeSiteContent({
    ...content,
    pageSeo: {
      ...(content.pageSeo || {}),
      [key]: updatedPage
    }
  });

  res.json({
    ok: true,
    message: "SEO settings updated successfully.",
    page: updatedPage,
    pages: savedContent.pageSeo
  });
});

app.get("/api/public/seo-pages", async (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const content = await readSiteContent();
  res.json({ ok: true, pages: content.pageSeo || {} });
});

app.get("/api/admin/city-pages", requireAdminAuth, async (req, res) => {
  const content = await readSiteContent();
  const pages = filterAccessibleCityPages(content.cityPages, req.adminUser).map(toCityPageSummary);
  res.json({ ok: true, pages });
});

app.post("/api/admin/city-pages", requireAdminAuth, requireAdminOwner, async (req, res) => {
  res.status(405).json({ ok: false, message: "New city page creation is disabled." });
});

app.get("/api/admin/city-pages/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const content = await readSiteContent();
  const page = (content.cityPages || []).find((item) => item.id === id);

  if (!page) {
    return res.status(404).json({ ok: false, message: "City page not found." });
  }

  if (!userCanAccessCityPage(req.adminUser, page.id)) {
    return res.status(403).json({ ok: false, message: "You do not have access to edit this city page." });
  }

  res.json({ ok: true, page });
});

app.put("/api/admin/city-pages/:id", requireAdminAuth, cityPageUpload, async (req, res) => {
  const { id } = req.params;
  const siteContent = await readSiteContent();
  const targetPage = siteContent.cityPages.find((item) => item.id === id);

  if (!targetPage) {
    return res.status(404).json({ ok: false, message: "City page not found." });
  }

  if (!userCanAccessCityPage(req.adminUser, targetPage.id)) {
    return res.status(403).json({ ok: false, message: "You do not have access to edit this city page." });
  }

  const files = req.files || {};
  const heroImageUpload = await mirrorUploadedFile(files.heroImageFile?.[0]);
  const wasteImageUpload = await mirrorUploadedFile(files.wasteImageFile?.[0]);
  const payload = {
    ...(req.body ?? {}),
    sectionVisibility: parseJsonField(req.body?.sectionVisibility, targetPage.sectionVisibility || defaultCitySectionVisibility()),
    heroImage: heroImageUpload || req.body?.heroImage,
    wasteImage: wasteImageUpload || req.body?.wasteImage
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

  const pages = filterAccessibleCityPages(savedContent.cityPages, req.adminUser).map(toCityPageSummary);
  res.json({ ok: true, message: "City page updated successfully.", page: updatedPage, pages });
});

app.delete("/api/admin/city-pages/:id", requireAdminAuth, requireAdminOwner, async (req, res) => {
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

  res.json({ ok: true, message: "City page deleted successfully.", pages: savedContent.cityPages.map(toCityPageSummary) });
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
  const heroImageUpload = await mirrorUploadedFile(files.heroImageFile?.[0]);
  const featuredImageUpload = await mirrorUploadedFile(files.featuredImageFile?.[0]);
  const cardImageUpload = await mirrorUploadedFile(files.cardImageFile?.[0]);
  const sectionTwoImageUpload = await mirrorUploadedFile(files.sectionTwoImageFile?.[0]);
  const blogImage =
    featuredImageUpload ||
    heroImageUpload ||
    cardImageUpload ||
    req.body?.featuredImage ||
    req.body?.heroImage ||
    req.body?.cardImage;
  const payload = {
    ...(req.body ?? {}),
    heroImage: blogImage,
    featuredImage: blogImage,
    cardImage: blogImage,
    sectionTwoImage: sectionTwoImageUpload || req.body?.sectionTwoImage,
    introHtml: req.body?.introHtml,
    contentHtml: req.body?.contentHtml,
    faqItems: req.body?.faqItems,
    sectionOneBodyHtml: req.body?.sectionOneBodyHtml,
    sectionTwoBodyHtml: req.body?.sectionTwoBodyHtml,
    quoteHtml: req.body?.quoteHtml,
    sectionThreeBodyHtml: req.body?.sectionThreeBodyHtml,
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
  const savedPost = (savedContent.blogPosts || []).find((item) => item.id === post.id) || post;

  res.json({ ok: true, message: "Blog post created successfully.", post: savedPost, posts: savedContent.blogPosts });
});

app.put("/api/admin/blog-posts/:id", requireAdminAuth, blogPostUpload, async (req, res) => {
  const { id } = req.params;
  const siteContent = await readSiteContent();
  const targetPost = (siteContent.blogPosts || []).find((item) => item.id === id);

  if (!targetPost) {
    return res.status(404).json({ ok: false, message: "Blog post not found." });
  }

  const files = req.files || {};
  const heroImageUpload = await mirrorUploadedFile(files.heroImageFile?.[0]);
  const featuredImageUpload = await mirrorUploadedFile(files.featuredImageFile?.[0]);
  const cardImageUpload = await mirrorUploadedFile(files.cardImageFile?.[0]);
  const sectionTwoImageUpload = await mirrorUploadedFile(files.sectionTwoImageFile?.[0]);
  const blogImage =
    featuredImageUpload ||
    heroImageUpload ||
    cardImageUpload ||
    req.body?.featuredImage ||
    req.body?.heroImage ||
    req.body?.cardImage;
  const payload = {
    ...(req.body ?? {}),
    heroImage: blogImage,
    featuredImage: blogImage,
    cardImage: blogImage,
    sectionTwoImage: sectionTwoImageUpload || req.body?.sectionTwoImage,
    introHtml: req.body?.introHtml,
    contentHtml: req.body?.contentHtml,
    faqItems: req.body?.faqItems,
    sectionOneBodyHtml: req.body?.sectionOneBodyHtml,
    sectionTwoBodyHtml: req.body?.sectionTwoBodyHtml,
    quoteHtml: req.body?.quoteHtml,
    sectionThreeBodyHtml: req.body?.sectionThreeBodyHtml,
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
  const savedPost = (savedContent.blogPosts || []).find((item) => item.id === id) || updatedPost;

  res.json({ ok: true, message: "Blog post updated successfully.", post: savedPost, posts: savedContent.blogPosts });
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

app.get("/api/admin/contact-inquiries", requireAdminAuth, async (_req, res) => {
  const content = await readSiteContent();
  res.json({ ok: true, inquiries: content.contactInquiries || [] });
});

app.patch("/api/admin/contact-inquiries/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const nextStatus = String(req.body?.status || "").trim();
  const content = await readSiteContent();
  const targetInquiry = (content.contactInquiries || []).find((item) => item.id === id);

  if (!targetInquiry) {
    return res.status(404).json({ ok: false, message: "Contact inquiry not found." });
  }

  const updatedInquiry = {
    ...targetInquiry,
    status: ["New", "Helped"].includes(nextStatus) ? nextStatus : targetInquiry.status,
    updatedAt: new Date().toISOString()
  };

  const savedContent = await writeSiteContent({
    ...content,
    contactInquiries: (content.contactInquiries || []).map((item) => (item.id === id ? updatedInquiry : item))
  });

  res.json({ ok: true, message: "Contact inquiry updated successfully.", inquiries: savedContent.contactInquiries });
});

app.delete("/api/admin/contact-inquiries/:id", requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const content = await readSiteContent();
  const targetInquiry = (content.contactInquiries || []).find((item) => item.id === id);

  if (!targetInquiry) {
    return res.status(404).json({ ok: false, message: "Contact inquiry not found." });
  }

  const savedContent = await writeSiteContent({
    ...content,
    contactInquiries: (content.contactInquiries || []).filter((item) => item.id !== id)
  });

  res.json({ ok: true, message: "Contact inquiry deleted successfully.", inquiries: savedContent.contactInquiries });
});

app.post("/api/public/contact-inquiries", async (req, res) => {
  const payload = req.body ?? {};
  const postcode = String(payload.postcode || "").trim();

  if (!postcode) {
    return res.status(400).json({ ok: false, message: "Postcode is required." });
  }

  const content = await readSiteContent();
  const inquiry = createContactInquiry(payload);
  const savedContent = await writeSiteContent({
    ...content,
    contactInquiries: [inquiry, ...(content.contactInquiries || [])]
  });

  res.status(201).json({
    ok: true,
    message: "Thanks, your enquiry has been sent.",
    inquiry,
    inquiries: savedContent.contactInquiries
  });
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

app.get("/api/public/city-pages", async (_req, res) => {
  const siteContent = await readSiteContent();
  const pages = (siteContent.cityPages || [])
    .map((page) => ({
      id: page.id,
      name: page.name,
      slug: page.slug,
      regionName: page.regionName || "",
      heroTitle: page.heroTitle || page.name
    }))
    .filter((page) => page.name && page.slug)
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB", { sensitivity: "base" }));

  res.json({ ok: true, pages });
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

app.get("*", async (req, res, next) => {
  const requestPath = req.path || "/";

  if (
    requestPath.startsWith("/api/") ||
    requestPath.startsWith("/uploads/") ||
    /\.[a-zA-Z0-9]+$/.test(requestPath)
  ) {
    return next();
  }

  try {
    const [html, content] = await Promise.all([
      readFile(getFrontendHtmlPath(requestPath), "utf8"),
      readSiteContent()
    ]);
    const seo = resolveHtmlSeo(req, content);

    res.set("Content-Type", "text/html; charset=utf-8");
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return res.send(injectHtmlSeo(html, seo, req));
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, next) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Image is too large. Please upload an optimized image under 8 MB."
      : "Image upload failed. Please choose a valid image and try again.";

    return res.status(400).json({ ok: false, message });
  }

  if (error.message === "Only image files can be uploaded.") {
    return res.status(400).json({ ok: false, message: error.message });
  }

  console.error(error);
  return res.status(500).json({ ok: false, message: "Something went wrong while saving. Please try again." });
});

app.listen(port, () => {
  console.log(`Rocket backend listening on port ${port}`);
});






