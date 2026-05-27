import crypto from "crypto";

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function defaultLocationSectionVisibility() {
  return {
    hero: true,
    services: true,
    sameDay: true,
    waste: true,
    property: true,
    greenBanner: true
  };
}

const genericRegionNameSet = new Set([
  "ceremonial county",
  "statistical region"
]);

export function sanitiseImportedLocationName(value = "") {
  return String(value || "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\s*\/\s*/g, " and ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitiseImportedRegionName(value = "") {
  return sanitiseImportedLocationName(value)
    .replace(/,\s*(england|scotland|wales)$/i, " $1")
    .replace(/\s+/g, " ")
    .trim();
}

export function isSupportedLocationName(value = "") {
  const next = sanitiseImportedLocationName(value).toLowerCase();
  return Boolean(next) && next !== "city name";
}

export function isSupportedRegionName(value = "") {
  const next = sanitiseImportedRegionName(value).toLowerCase();
  return Boolean(next) && !genericRegionNameSet.has(next);
}

const defaultLocationSectionImages = {
  heroImage: "/images/rocket/generic-uk-residential-banner.png",
  wasteImage: "/images/rocket/rc_29.png",
  propertyImage: "/images/rocket/quote-photo.jpg"
};

const heroVariations = [
  {
    hero: "Reliable rubbish removal and rubbish clearance across {location}. We support homes, shops, offices, and renovation projects with licensed waste collection, waste disposal, junk removal, and skip hire alternatives tailored to the area.",
    intro: "Need same-day rubbish removal in {location}? Our local team handles bulky waste, mixed junk, furniture, and bagged waste with clear pricing and fast booking windows."
  },
  {
    hero: "Rocket Rubbish delivers responsive rubbish removal in {location}, combining professional rubbish clearance, waste collection, ethical waste disposal, junk removal, and skip hire support for residential and commercial customers.",
    intro: "From one-off clear-outs to repeat collections, we keep rubbish clearance simple in {location} with reliable teams, flexible load sizes, and fast turnaround times."
  },
  {
    hero: "If you need rubbish removal in {location}, our licensed crews provide straightforward rubbish clearance, efficient waste collection, responsible waste disposal, practical junk removal, and skip hire alternatives without hidden hassle.",
    intro: "We cover flats, houses, offices, retail units, and building sites in {location}, giving you a quick route to clear unwanted waste and keep your property moving."
  },
  {
    hero: "Our {location} service is built for fast rubbish removal, organised rubbish clearance, dependable waste collection, compliant waste disposal, bulky junk removal, and flexible skip hire alternatives across the wider area.",
    intro: "Whether you are preparing a home for sale or managing a site clean-up in {location}, our team loads, clears, and disposes of waste responsibly from start to finish."
  }
];

const sameDayFooters = [
  "Ideal for homes, offices, shops, rental properties, and renovation projects.",
  "Designed for busy households, landlords, contractors, and businesses that need a clean space quickly.",
  "A practical solution for domestic clear-outs, office moves, retail waste, and renovation debris.",
  "Perfect for urgent property clearances, bulky item collection, and general junk removal across the area."
];

const wasteTextVariations = [
  "Need fast waste collection without the delays and hassle of skip hire? Our {location} team offers a cleaner, more flexible option for homes and businesses that want labour included from the start.",
  "For customers in {location}, our waste collection service is a simple alternative to waiting on skip permits, blocked driveways, or long rental windows. We arrive, load everything, and remove it in one visit.",
  "Our {location} waste disposal service helps households and businesses clear unwanted materials quickly while keeping the process tidy, licensed, and easy to manage.",
  "If you want practical waste disposal in {location} without arranging a skip yourself, our team can load, remove, and process the waste on the same visit."
];

const wasteSubTextVariations = [
  "With labour included, same-day availability, and fixed pricing, you get everything collected in one visit without permits, overfilled skips, or blocked driveways.",
  "You only pay for the load space you use, which makes this a smart skip hire alternative for properties with limited parking or tight access.",
  "Our approach keeps the job moving quickly because the team does the lifting, sorting, loading, and licensed disposal for you.",
  "It is a practical option for homes, offices, gardens, and trade sites that need rubbish removed efficiently without keeping a skip on site."
];

const propertyTextVariations = [
  "From lofts and basements to garages and full house clearances, we collect bulky waste, mixed rubbish, furniture, and general junk across {location}.",
  "If you are clearing a property in {location}, we can remove unwanted furniture, appliances, bagged waste, and renovation debris from individual rooms or entire buildings.",
  "Our property clearance service in {location} is built for fast, organised removal of clutter, old furnishings, white goods, and leftover waste from domestic or commercial spaces.",
  "Across {location}, we help with end-of-tenancy clear-outs, probate work, office resets, and renovation clearances where fast rubbish removal matters."
];

const greenSubtitleVariations = [
  "Choose the collection type that matches your waste and let our {location} team handle everything from lifting to licensed disposal.",
  "Need quick junk removal in {location}? Our crews clear household, garden, office, and mixed waste with labour, loading, and disposal included.",
  "From a few awkward items to full van loads, our {location} team keeps junk removal straightforward, affordable, and professionally managed.",
  "We make waste collection easy in {location} by combining quick booking, clear pricing, and responsible disposal for every load."
];

const greenFooterVariations = [
  "From a single sofa to full van loads, our crews cover {coverageText} with fixed transparent pricing.",
  "Every collection includes labour, loading, waste disposal, and responsible recycling for customers across {coverageText}.",
  "Our teams work across {coverageText}, helping homes and businesses clear junk without the delays of traditional skip hire.",
  "You get a simple same-day rubbish removal solution across {coverageText}, with flexible load sizes and licensed disposal."
];

const servicesTextVariations = [
  "Choose the service that fits your load size, property type, and timing in {location}. We support rubbish removal, rubbish clearance, waste collection, waste disposal, junk removal, and skip hire alternatives with clear pricing and local teams.",
  "Our {location} team offers flexible load sizes for rubbish removal, rubbish clearance, waste collection, waste disposal, junk removal, and skip hire alternatives, so you can book the right option without overpaying.",
  "From quick household pickups to larger commercial clear-outs, our {location} services cover rubbish removal, waste collection, junk removal, licensed waste disposal, and practical skip hire alternatives.",
  "Compare the most popular options for rubbish removal in {location}, including mixed waste collection, junk removal, bulky item clearance, responsible waste disposal, and labour-included skip hire alternatives."
];

const sameDayBulletSets = [
  [
    "No skip permits needed",
    "No lifting required - we load everything",
    "Flexible load sizes for homes, offices, and sites",
    "Licensed waste disposal at approved recycling centres"
  ],
  [
    "Same-day or next-day booking slots available",
    "Two-person clearance crews for awkward or bulky loads",
    "Suitable for domestic, office, and trade collections",
    "Responsible sorting, recycling, and compliant disposal"
  ],
  [
    "Faster than arranging a traditional skip delivery",
    "Labour, loading, transport, and disposal included",
    "Works well for flats, houses, shops, and building sites",
    "Clear prices before the collection begins"
  ]
];

const compareTextVariations = [
  "We collect most non-hazardous household, office, garden, and bulky waste in {location}. Restricted items still need specialist disposal.",
  "Our {location} team removes common domestic and commercial waste streams, while hazardous or specialist materials must be handled separately.",
  "For customers in {location}, we handle a wide mix of everyday rubbish and clearance loads, but we do not take restricted hazardous materials.",
  "Most general junk, mixed waste, furniture, bagged rubbish, and renovation debris can be collected in {location}; restricted waste still requires specialist channels."
];

const mapTextVariations = [
  "See our {location} service area and nearby coverage point. We support customers throughout {coverageText}.",
  "This map highlights our collection coverage for {location} and the surrounding service area across {coverageText}.",
  "Use the map to view our rubbish removal coverage around {location} and the wider surrounding area we serve.",
  "Our collection coverage for {location} extends across {coverageText}, helping households and businesses book locally."
];

const faqQuestionSets = [
  [
    "What areas in {location} do you cover?",
    "How quickly can you collect my rubbish in {location}?",
    "Do I need to be at home for the collection in {location}?",
    "What types of waste can you collect in {location}?",
    "How does your pricing work in {location}?",
    "Do you handle office and commercial clearances in {location}?",
    "What happens to the waste after collection in {location}?"
  ],
  [
    "Can you provide same-day rubbish removal in {location}?",
    "Do you remove bulky furniture and appliances in {location}?",
    "Is your waste collection service licensed in {location}?",
    "Do I need a skip permit for your service in {location}?",
    "How do I get an accurate quote in {location}?",
    "Can you clear garden and renovation waste in {location}?",
    "Do you recycle collected waste from {location}?"
  ],
  [
    "What makes your rubbish clearance service different in {location}?",
    "Can you collect rubbish from flats, offices, and shops in {location}?",
    "How much rubbish can you remove in one visit in {location}?",
    "Do you offer skip hire alternatives in {location}?",
    "Are there extra charges for heavy items in {location}?",
    "Can I book a collection for a landlord property in {location}?",
    "How do you dispose of waste collected in {location}?"
  ]
];

const faqAnswerSets = [
  [
    "We cover {location} and the wider {regionName} area with rubbish removal, rubbish clearance, waste collection, junk removal, and waste disposal support for homes and businesses.",
    "We often have same-day or next-day availability in {location}, depending on route planning, access, and load size.",
    "It is helpful if someone is available, but we can often work with access instructions when the waste is clearly identified and safely reachable.",
    "We collect most non-hazardous household waste, office waste, furniture, appliances, renovation debris, and general junk from properties in {location}.",
    "Our pricing is based on load size, access, labour time, and the type of material being removed, with clear quotes provided before collection starts.",
    "Yes. We regularly support commercial customers in {location} with office clearances, trade waste pickups, and scheduled rubbish collection.",
    "Collected waste from {location} is taken to licensed transfer and recycling facilities where materials are sorted for responsible waste disposal."
  ],
  [
    "Yes. Our local scheduling often allows same-day rubbish removal in {location}, especially for standard household and office loads.",
    "Yes. We remove sofas, wardrobes, beds, white goods, desks, and other bulky items across {location} as part of our rubbish clearance service.",
    "Yes. We operate as a licensed waste carrier, so collections in {location} follow the correct compliance and disposal process.",
    "No. Because our team loads and removes the waste on one visit, most customers in {location} do not need a separate skip permit.",
    "The best quotes come from a clear description, photos where possible, and an estimated load size so we can price the collection accurately.",
    "Yes. Garden waste, builders debris, and mixed renovation waste can all be collected in {location}, provided the materials are non-hazardous.",
    "Yes. Waste collected from {location} is sorted with recycling and responsible recovery in mind wherever possible."
  ],
  [
    "We combine labour, loading, transport, and licensed disposal, which means customers in {location} can clear waste without arranging a separate skip or lifting crew.",
    "Yes. We provide rubbish removal in {location} for flats, houses, offices, retail units, and mixed-use properties.",
    "We can remove anything from a few bags to a full van load in {location}, depending on access and the waste type involved.",
    "Yes. Many customers in {location} use us as a practical skip hire alternative because we load the waste and remove it straight away.",
    "Additional costs only apply where access is unusually difficult or where items are exceptionally heavy, and we explain this before the booking is confirmed.",
    "Yes. We help landlords, agents, and property managers in {location} with end-of-tenancy and pre-sale rubbish clearance.",
    "Your waste is transported from {location} to licensed facilities where it is processed for recycling, recovery, and compliant disposal."
  ]
];

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function selectVariant(collection, seed) {
  return collection[seed % collection.length];
}

function applyTokens(template, tokens) {
  return template.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? "");
}

function titleCaseFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normaliseRegionName(regionName, fallbackLocation) {
  const next = sanitiseImportedRegionName(regionName);
  return next || `${fallbackLocation} area`;
}

function buildLocationLabel(locationType, locationName, regionName) {
  if (locationType === "area") {
    return `${locationName} area`;
  }

  if (locationType === "county") {
    return `${locationName} county`;
  }

  return locationName;
}

function buildCoverageText(locationName, regionName, locationType) {
  if (locationType === "area" || locationType === "county") {
    return `${locationName} and surrounding towns`;
  }

  if (regionName && regionName !== locationName) {
    return `${locationName} and nearby parts of ${regionName}`;
  }

  return `${locationName} and nearby neighbourhoods`;
}

function inferLocationType(sourceType, locationName, regionName) {
  if (sourceType === "region") {
    if (/county/i.test(locationName) || /shire/i.test(locationName)) {
      return "county";
    }

    return "area";
  }

  return "location";
}

function buildFaqItems(seed, tokens) {
  const questionSet = selectVariant(faqQuestionSets, seed);
  const answerSet = selectVariant(faqAnswerSets, seed + 1);

  return questionSet.map((question, index) => ({
    question: applyTokens(question, tokens),
    answer: applyTokens(answerSet[index], tokens)
  }));
}

function buildMetaTitle(locationName, locationType) {
  if (locationType === "area" || locationType === "county") {
    return `Rubbish Removal & Rubbish Clearance in ${locationName} | Rocket Rubbish`;
  }

  return `Rubbish Removal in ${locationName} | Rubbish Clearance & Waste Collection`;
}

function buildMetaDescription(locationName, regionName, locationType) {
  const areaText = locationType === "area" || locationType === "county"
    ? `${locationName} and surrounding towns`
    : `${locationName}${regionName && regionName !== locationName ? `, ${regionName}` : ""}`;

  return `Book reliable rubbish removal, rubbish clearance, waste collection, waste disposal, junk removal, and skip hire alternatives in ${areaText} with Rocket Rubbish.`;
}

export function createDefaultLocationPage({
  name,
  slug,
  regionName = "",
  sourceType = "location"
}) {
  const locationName = sanitiseImportedLocationName(name) || "Location";
  const nextSlug = slugify(slug || locationName);
  const nextRegionName = normaliseRegionName(regionName, locationName);
  const locationType = inferLocationType(sourceType, locationName, nextRegionName);
  const seed = hashString(`${locationName}|${nextRegionName}|${locationType}`);
  const coverageText = buildCoverageText(locationName, nextRegionName, locationType);
  const locationLabel = buildLocationLabel(locationType, locationName, nextRegionName);
  const tokens = {
    location: locationName,
    regionName: nextRegionName,
    coverageText,
    locationLabel
  };
  const heroVariant = selectVariant(heroVariations, seed);
  const wasteText = applyTokens(selectVariant(wasteTextVariations, seed + 2), tokens);
  const wasteSubText = applyTokens(selectVariant(wasteSubTextVariations, seed + 3), tokens);
  const propertyText = applyTokens(selectVariant(propertyTextVariations, seed + 4), tokens);
  const greenSubtitle = applyTokens(selectVariant(greenSubtitleVariations, seed + 5), tokens);
  const greenFooter = applyTokens(selectVariant(greenFooterVariations, seed + 6), tokens);
  const compareText = applyTokens(selectVariant(compareTextVariations, seed + 7), tokens);
  const mapText = applyTokens(selectVariant(mapTextVariations, seed + 8), tokens);
  const servicesText = applyTokens(selectVariant(servicesTextVariations, seed + 9), tokens);
  const sameDayBullets = selectVariant(sameDayBulletSets, seed + 10);
  const faqItems = buildFaqItems(seed, tokens);
  const heroTitle = locationType === "area" || locationType === "county"
    ? `Rubbish Removal Across ${locationName}`
    : `Rubbish Removal In ${locationName}`;
  const servicesTitle = locationType === "area" || locationType === "county"
    ? `Popular Waste Collection Services Across ${locationName}`
    : `Our Most Popular Waste Collection Services In ${locationName}`;
  const sameDayTitle = locationType === "area" || locationType === "county"
    ? `Same-Day Rubbish Removal Across ${locationName}`
    : `Same-Day Rubbish Removal Across ${locationName}`;
  const sameDayIntro = applyTokens(heroVariant.intro, tokens);
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name: locationName,
    slug: nextSlug,
    sourceType,
    locationType,
    regionName: nextRegionName,
    metaTitle: buildMetaTitle(locationName, locationType),
    metaDescription: buildMetaDescription(locationName, nextRegionName, locationType),
    canonicalPath: `/cities/${nextSlug}`,
    ogTitle: buildMetaTitle(locationName, locationType),
    ogDescription: buildMetaDescription(locationName, nextRegionName, locationType),
    ogImage: defaultLocationSectionImages.heroImage,
    heroAlt: `Rocket Rubbish rubbish removal team serving ${locationLabel}`,
    sectionVisibility: defaultLocationSectionVisibility(),
    heroTitle,
    heroSubheadline: `Fast, affordable and fully licensed rubbish removal across ${locationName}`,
    heroText: applyTokens(heroVariant.hero, tokens),
    heroImage: defaultLocationSectionImages.heroImage,
    servicesTitle,
    servicesText,
    highlightsTitle: sameDayTitle,
    sameDayTitle,
    sameDayIntro,
    sameDayBullets,
    sameDayFooter: selectVariant(sameDayFooters, seed + 1),
    wasteTitle: "Responsible Waste Disposal & Skip Hire Alternative",
    wasteText,
    wasteImage: defaultLocationSectionImages.wasteImage,
    wasteAlt: `Rocket Rubbish waste collection team serving ${locationLabel}`,
    wasteSubTitle: "The Better Skip Hire Alternative",
    wasteSubText,
    propertyTitle: "Complete Property Rubbish Clearance",
    propertyText,
    propertyImage: defaultLocationSectionImages.propertyImage,
    propertyAlt: `Rocket Rubbish property clearance team serving ${locationLabel}`,
    greenTitle: `Fast & Affordable Junk Removal In ${locationName}`,
    greenSubtitle,
    greenFooter,
    compareTitle: `What Can Our ${locationName} Team Collect?`,
    compareText,
    mapTitle: `Rocket Rubbish Near ${locationName}`,
    mapText,
    faqItems,
    createdAt: now,
    updatedAt: now
  };
}

export function createLocationPageFromImportRecord(record) {
  return createDefaultLocationPage({
    ...record,
    name: sanitiseImportedLocationName(record?.name),
    regionName: sanitiseImportedRegionName(record?.regionName || record?.name)
  });
}

export function buildLocationSeoData(page, siteOrigin = "") {
  const path = page.canonicalPath || `/cities/${page.slug}`;
  const canonical = siteOrigin ? `${siteOrigin}${path}` : path;

  return {
    title: page.metaTitle || page.heroTitle,
    description: page.metaDescription || page.heroText,
    canonical,
    ogTitle: page.ogTitle || page.metaTitle || page.heroTitle,
    ogDescription: page.ogDescription || page.metaDescription || page.heroText,
    ogImage: page.ogImage || page.heroImage,
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.metaTitle || page.heroTitle,
      description: page.metaDescription || page.heroText,
      areaServed: page.name,
      provider: {
        "@type": "Organization",
        name: "Rocket Rubbish"
      },
      serviceType: [
        "Rubbish Removal",
        "Rubbish Clearance",
        "Waste Collection",
        "Waste Disposal",
        "Junk Removal",
        "Skip Hire"
      ],
      url: canonical
    }
  };
}

export function createLocationSlug(sourceType, locationName, usedSlugs = new Set()) {
  let baseSlug = slugify(locationName);

  if (usedSlugs.has(baseSlug)) {
    baseSlug = sourceType === "region" ? `${baseSlug}-area` : `${baseSlug}-location`;
  }

  let nextSlug = baseSlug;
  let suffix = 2;
  while (usedSlugs.has(nextSlug)) {
    nextSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  usedSlugs.add(nextSlug);
  return nextSlug;
}


