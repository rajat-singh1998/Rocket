import { promises as fs } from "fs";
import path from "path";

const contentFilePath = path.resolve(process.cwd(), "data", "siteContent.json");

const defaultCityPages = [
  {
    id: "city-london",
    name: "London",
    slug: "london",
    heroTitle: "Rubbish Removal In London",
    heroText:
      "Fast, friendly, and fully licensed rubbish collection across London. From single items to full property clearances, our team handles the heavy lifting, loading, and responsible disposal.",
    servicesTitle: "Our Most Popular Waste Collection Services In London",
    servicesText:
      "Choose the service that suits your load size, budget, and property type. From a few bags to full van collections, we keep pricing simple and collection fast.",
    sameDayTitle: "Same-Day Rubbish Removal Across London",
    sameDayIntro:
      "Get fast, affordable rubbish removal in London today. We cover homes, offices, shops, and gardens with same-day and next-day slots across the capital.",
    sameDayBullets: [
      "No skip permits needed",
      "No lifting required - we load everything",
      "Flexible load sizes for all property types",
      "Licensed waste disposal at certified recycling centres"
    ],
    sameDayFooter: "Ideal for homes, offices, shops, rental properties, and renovation projects.",
    wasteTitle: "Responsible Waste Disposal & Skip Hire Alternative",
    wasteText:
      "Need fast waste collection without the delays and hassle of skip hire? Our London team offers a quicker, cleaner option for homes and businesses.",
    wasteSubTitle: "The Better Skip Hire Alternative",
    wasteSubText:
      "With labour included, same-day availability, and fixed pricing, you get everything collected in one visit without permits, overfilled skips, or blocked driveways.",
    propertyTitle: "Complete Property Rubbish Clearance",
    propertyText:
      "From lofts and basements to garages and full house clearances, we collect bulky waste, mixed rubbish, furniture, and general junk across London.",
    greenTitle: "Fast & Affordable Junk Removal In London",
    greenSubtitle:
      "Choose the collection type that matches your waste and let our London team handle everything from lifting to licensed disposal.",
    greenFooter:
      "From a single sofa to full van loads, our crews cover North, South, East, and West London with fixed transparent pricing.",
    compareTitle: "What Can Our London Team Collect?",
    compareText:
      "We take most non-hazardous household, office, garden, and bulky waste. Restricted waste still needs specialist disposal.",
    mapTitle: "Rocket Rubbish Near Me",
    mapText: "See our London service area and central coverage point. We collect across Greater London and nearby surrounding areas.",
    createdAt: "2026-04-26T00:00:00.000Z",
    updatedAt: "2026-04-26T00:00:00.000Z"
  }
];

const defaultContent = {
  sections: [
    { label: "Hero Section", key: "hero", active: true },
    { label: "Services Grid", key: "services", active: true },
    { label: "How It Works", key: "howItWorks", active: true },
    { label: "Testimonials", key: "testimonials", active: true },
    { label: "FAQ", key: "faq", active: true },
    { label: "Footer", key: "footer", active: true }
  ],
  hero: {
    headline: "UK-Wide Rubbish Clearance\nFast, Easy & Hassle-Free",
    subheadline: "Man & Van rubbish clearance across the UK. Book in 60 seconds. We collect, sort & recycle, same day.",
    backgroundImage: "/images/rocket/Hero_Section.png"
  },
  customPages: [],
  cityPages: defaultCityPages
};

function normaliseContent(content = {}) {
  return {
    ...defaultContent,
    ...content,
    sections: Array.isArray(content.sections) && content.sections.length > 0 ? content.sections : defaultContent.sections,
    hero: {
      ...defaultContent.hero,
      ...(content.hero || {})
    },
    customPages: Array.isArray(content.customPages) ? content.customPages : [],
    cityPages: Array.isArray(content.cityPages) ? content.cityPages : defaultCityPages
  };
}

async function ensureContentFile() {
  try {
    await fs.access(contentFilePath);
    const file = await fs.readFile(contentFilePath, "utf8");
    const parsed = JSON.parse(file);
    const normalised = normaliseContent(parsed);

    if (JSON.stringify(parsed) !== JSON.stringify(normalised)) {
      await fs.writeFile(contentFilePath, JSON.stringify(normalised, null, 2));
    }
  } catch {
    await fs.writeFile(contentFilePath, JSON.stringify(defaultContent, null, 2));
  }
}

export async function readSiteContent() {
  await ensureContentFile();
  const file = await fs.readFile(contentFilePath, "utf8");
  return normaliseContent(JSON.parse(file));
}

export async function writeSiteContent(content) {
  const normalised = normaliseContent(content);
  await fs.writeFile(contentFilePath, JSON.stringify(normalised, null, 2));
  return normalised;
}

