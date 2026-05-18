import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createLocationPageFromImportRecord, createLocationSlug } from "../src/locationPageFactory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, "..", "data");
const seedFilePath = path.resolve(dataDirectory, "locationWorkbookSeed.json");
const contentFilePath = path.resolve(dataDirectory, "siteContent.json");

function mergeLocationPage(generatedPage, existingPage = null) {
  if (!existingPage) {
    return generatedPage;
  }

  return {
    ...generatedPage,
    ...existingPage,
    sectionVisibility: {
      ...generatedPage.sectionVisibility,
      ...(existingPage.sectionVisibility || {})
    },
    faqItems: Array.isArray(existingPage.faqItems) && existingPage.faqItems.length > 0
      ? existingPage.faqItems
      : generatedPage.faqItems
  };
}

async function main() {
  const [seedRaw, contentRaw] = await Promise.all([
    fs.readFile(seedFilePath, "utf8"),
    fs.readFile(contentFilePath, "utf8")
  ]);

  const seedRecords = JSON.parse(seedRaw);
  const siteContent = JSON.parse(contentRaw);
  const existingPages = Array.isArray(siteContent.cityPages) ? siteContent.cityPages : [];
  const existingBySlug = new Map(existingPages.map((page) => [page.slug, page]));
  const usedSlugs = new Set();

  const generatedPages = seedRecords.map((record) => {
    const slug = createLocationSlug(record.sourceType, record.name, usedSlugs);
    const generatedPage = createLocationPageFromImportRecord({
      ...record,
      slug
    });

    return mergeLocationPage(generatedPage, existingBySlug.get(slug));
  });

  const importedSlugs = new Set(generatedPages.map((page) => page.slug));
  const manualPages = existingPages.filter((page) => !importedSlugs.has(page.slug));

  const nextContent = {
    ...siteContent,
    cityPages: [...generatedPages, ...manualPages]
  };

  await fs.writeFile(contentFilePath, JSON.stringify(nextContent, null, 2));

  console.log(`Imported ${generatedPages.length} location pages into siteContent.json`);
}

main().catch((error) => {
  console.error("Failed to import location pages:", error);
  process.exitCode = 1;
});
