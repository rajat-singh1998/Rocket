import { readFile } from "fs/promises";
import path from "path";
import { readSiteContent, writeSiteContent } from "../src/contentStore.js";
import {
  createLocationPageFromImportRecord,
  createLocationSlug,
  isSupportedLocationName,
  isSupportedRegionName,
  sanitiseImportedLocationName,
  sanitiseImportedRegionName,
  slugify
} from "../src/locationPageFactory.js";

const backendRoot = process.cwd();
const seedPath = path.resolve(backendRoot, "data", "locationWorkbookSeed.json");

const generatedTextKeys = [
  "heroTitle",
  "heroText",
  "servicesTitle",
  "servicesText",
  "highlightsTitle",
  "sameDayTitle",
  "sameDayIntro",
  "sameDayFooter",
  "wasteTitle",
  "wasteText",
  "wasteSubTitle",
  "wasteSubText",
  "propertyTitle",
  "propertyText",
  "greenTitle",
  "greenSubtitle",
  "greenFooter",
  "compareTitle",
  "compareText",
  "mapTitle",
  "mapText"
];

const legacyPatterns = [
  /Ceremonial county/i,
  /Statistical region/i,
  /Durham\/North Yorkshire/i
];

function buildLookupKey(record = {}) {
  const sourceType = String(record.sourceType || "location").trim() === "region" ? "region" : "location";
  const name = slugify(sanitiseImportedLocationName(record.name || ""));
  const regionName = slugify(sanitiseImportedRegionName(record.regionName || record.name || ""));
  return `${sourceType}|${name}|${regionName}`;
}

function normaliseLocationRecord(record = {}) {
  const rawRegionName = String(record.regionName || record.name || "").trim();
  const cleanedRegionName = rawRegionName.includes("/")
    ? rawRegionName.split("/")[0].trim()
    : rawRegionName;

  return {
    ...record,
    name: sanitiseImportedLocationName(record.name || ""),
    regionName: sanitiseImportedRegionName(cleanedRegionName)
  };
}

function normaliseRegionRecord(record = {}) {
  const rawRegionName = String(record.name || record.regionName || "").trim();
  const regionName = sanitiseImportedRegionName(rawRegionName);
  return {
    ...record,
    rawRegionName,
    name: regionName,
    regionName
  };
}

function hasLegacyGeneratedText(existing = {}) {
  for (const key of generatedTextKeys) {
    const value = existing?.[key];
    if (typeof value === "string" && legacyPatterns.some((pattern) => pattern.test(value))) {
      return true;
    }
  }

  if (typeof existing?.metaTitle === "string" && legacyPatterns.some((pattern) => pattern.test(existing.metaTitle))) {
    return true;
  }
  if (typeof existing?.metaDescription === "string" && legacyPatterns.some((pattern) => pattern.test(existing.metaDescription))) {
    return true;
  }
  if (typeof existing?.ogTitle === "string" && legacyPatterns.some((pattern) => pattern.test(existing.ogTitle))) {
    return true;
  }
  if (typeof existing?.ogDescription === "string" && legacyPatterns.some((pattern) => pattern.test(existing.ogDescription))) {
    return true;
  }
  if (typeof existing?.heroAlt === "string" && legacyPatterns.some((pattern) => pattern.test(existing.heroAlt))) {
    return true;
  }

  if (Array.isArray(existing?.faqItems)) {
    for (const item of existing.faqItems) {
      if (typeof item?.question === "string" && legacyPatterns.some((pattern) => pattern.test(item.question))) {
        return true;
      }
      if (typeof item?.answer === "string" && legacyPatterns.some((pattern) => pattern.test(item.answer))) {
        return true;
      }
    }
  }

  return false;
}

function mergeLocationPage(existing, generated) {
  const refreshGeneratedContent = hasLegacyGeneratedText(existing);
  const nextPage = {
    ...generated,
    ...existing,
    id: existing.id || generated.id,
    name: generated.name,
    slug: generated.slug,
    sourceType: generated.sourceType,
    locationType: generated.locationType,
    regionName: generated.regionName,
    metaTitle: generated.metaTitle,
    metaDescription: generated.metaDescription,
    canonicalPath: generated.canonicalPath,
    ogTitle: generated.ogTitle,
    ogDescription: generated.ogDescription,
    ogImage: existing.ogImage || existing.heroImage || generated.ogImage,
    heroAlt: generated.heroAlt,
    sectionVisibility: {
      ...(generated.sectionVisibility || {}),
      ...(existing.sectionVisibility || {})
    },
    sameDayBullets: Array.isArray(existing.sameDayBullets) && existing.sameDayBullets.length > 0 && !refreshGeneratedContent
      ? existing.sameDayBullets
      : generated.sameDayBullets,
    faqItems: Array.isArray(existing.faqItems) && existing.faqItems.length > 0 && !refreshGeneratedContent
      ? existing.faqItems
      : generated.faqItems,
    createdAt: existing.createdAt || generated.createdAt,
    updatedAt: existing.updatedAt || generated.updatedAt
  };

  for (const key of generatedTextKeys) {
    nextPage[key] = refreshGeneratedContent
      ? generated[key]
      : (existing[key] || generated[key]);
  }

  return nextPage;
}

const seedText = (await readFile(seedPath, "utf8")).replace(/^\uFEFF/, "");
const seed = JSON.parse(seedText);
const siteContent = await readSiteContent();
const existingPages = Array.isArray(siteContent.cityPages) ? siteContent.cityPages : [];
const existingByLookup = new Map(existingPages.map((page) => [buildLookupKey(page), page]));
const usedSlugs = new Set();
const locationNameCounts = new Map();

const locationRecords = (seed.locations || [])
  .map(normaliseLocationRecord)
  .filter((record) => isSupportedLocationName(record.name));

const regionRecords = [];
const seenRegionNames = new Set();
for (const record of (seed.regions || []).map(normaliseRegionRecord)) {
  if (record.rawRegionName?.includes("/")) {
    continue;
  }
  if (!isSupportedRegionName(record.name)) {
    continue;
  }
  const regionKey = slugify(record.name);
  if (seenRegionNames.has(regionKey)) {
    continue;
  }
  seenRegionNames.add(regionKey);
  regionRecords.push(record);
}

for (const page of existingPages) {
  if (page?.slug) {
    usedSlugs.add(page.slug);
  }
}

for (const record of locationRecords) {
  const key = slugify(record.name || "");
  locationNameCounts.set(key, (locationNameCounts.get(key) || 0) + 1);
}

const nextPages = [];

for (const record of locationRecords) {
  const lookupKey = buildLookupKey(record);
  const existing = existingByLookup.get(lookupKey);
  const nameKey = slugify(record.name || "");
  const slugSource = (locationNameCounts.get(nameKey) || 0) > 1
    ? `${record.name} ${record.regionName}`
    : record.name;
  const expectedLocationSlug = createLocationSlug("location", slugSource, new Set());
  const slug = existing?.slug && slugify(existing.slug) === slugify(expectedLocationSlug)
    ? existing.slug
    : createLocationSlug("location", slugSource, usedSlugs);
  const generated = createLocationPageFromImportRecord({
    ...record,
    slug,
    sourceType: "location"
  });
  nextPages.push(existing ? mergeLocationPage(existing, generated) : generated);
}

const regionSlugReserve = new Set(nextPages.map((page) => page.slug).filter(Boolean));
for (const record of regionRecords) {
  const lookupKey = buildLookupKey(record);
  const existing = existingByLookup.get(lookupKey);
  const slug = createLocationSlug("region", record.name, regionSlugReserve);
  const generated = createLocationPageFromImportRecord({
    name: record.name,
    regionName: record.name,
    sourceType: "region",
    slug
  });
  nextPages.push(existing ? mergeLocationPage(existing, generated) : generated);
}

const dedupedPages = [];
const seenSlugs = new Set();
for (const page of nextPages) {
  if (page.slug && !seenSlugs.has(page.slug)) {
    seenSlugs.add(page.slug);
    dedupedPages.push(page);
  }
}

dedupedPages.sort((left, right) => {
  if (left.sourceType !== right.sourceType) {
    return left.sourceType === "location" ? -1 : 1;
  }
  return String(left.name || "").localeCompare(String(right.name || ""), "en", { sensitivity: "base" });
});

const saved = await writeSiteContent({
  ...siteContent,
  cityPages: dedupedPages
});

const locationsCount = saved.cityPages.filter((page) => page.sourceType !== "region").length;
const regionsCount = saved.cityPages.filter((page) => page.sourceType === "region").length;
console.log(`Imported ${saved.cityPages.length} location pages (${locationsCount} locations, ${regionsCount} regions).`);
