import { promises as fs } from "fs";
import path from "path";

const backendRoot = process.cwd();
const siteContentPath = path.resolve(backendRoot, "data", "siteContent.json");
const publicDirectoryPath = path.resolve(backendRoot, "..", "public");
const sitemapFilePath = path.join(publicDirectoryPath, "sitemap.xml");
const robotsFilePath = path.join(publicDirectoryPath, "robots.txt");
const siteOrigin = String(process.env.PUBLIC_SITE_ORIGIN || process.env.SITE_ORIGIN || "https://www.rocketrubbishremoval.co.uk")
  .trim()
  .replace(/\/+$/, "");

const serviceContexts = [
  {
    homes: "family homes, flats, garages, lofts, rental properties, and garden clearances",
    business: "offices, shops, workshops, storage units, and light trade jobs",
    property: "end-of-tenancy clearances, probate work, pre-sale tidy-ups, and renovation waste",
    streets: "town-centre streets, residential roads, business parks, and nearby villages"
  },
  {
    homes: "terraced houses, apartments, sheds, spare rooms, student lets, and larger household clear-outs",
    business: "retail units, offices, salons, small warehouses, and commercial storerooms",
    property: "landlord clear-outs, house moves, bereavement clearances, and refurbishment debris",
    streets: "busy high streets, estates, rural edges, and neighbouring communities"
  },
  {
    homes: "bungalows, maisonettes, family houses, loft spaces, garages, and garden waste jobs",
    business: "office suites, shops, hospitality spaces, contractor waste, and archived storage",
    property: "rental handovers, full property clearances, garage clear-outs, and post-build waste",
    streets: "local neighbourhoods, main roads, industrial estates, and surrounding settlements"
  },
  {
    homes: "homes, flats, outbuildings, spare bedrooms, driveways, and accumulated household junk",
    business: "workplaces, retail premises, small sites, schools, offices, and managed properties",
    property: "void property clearances, estate clearances, downsizing jobs, and office resets",
    streets: "central areas, residential lanes, shopping parades, and nearby local routes"
  }
];

const imageSets = [
  {
    heroImage: "/images/rocket/RC_1551.png",
    wasteImage: "/images/rocket/rc_29.png",
    propertyImage: "/images/rocket/quote-photo.jpg"
  },
  {
    heroImage: "/images/rocket/Hero_section_new.png",
    wasteImage: "/images/rocket/rc_29.png",
    propertyImage: "/images/rocket/quote-photo.jpg"
  },
  {
    heroImage: "/images/rocket/Banner.png",
    wasteImage: "/images/rocket/rc_29.png",
    propertyImage: "/images/rocket/quote-photo.jpg"
  },
  {
    heroImage: "/images/rocket/About_page_banner.png",
    wasteImage: "/images/rocket/rc_29.png",
    propertyImage: "/images/rocket/quote-photo.jpg"
  },
  {
    heroImage: "/images/rocket/Banner_new_5.png",
    wasteImage: "/images/rocket/rc_29.png",
    propertyImage: "/images/rocket/quote-photo.jpg"
  },
  {
    heroImage: "/images/rocket/Hero_Section.png",
    wasteImage: "/images/rocket/rc_29.png",
    propertyImage: "/images/rocket/quote-photo.jpg"
  }
];

const sameDayBulletSets = [
  [
    "No skip permit required, our team collects directly from the property",
    "No lifting needed, we load from rooms, gardens, garages, offices, and yards",
    "Flexible load sizes for small pickups, bulky items, and full clearances",
    "Licensed waste disposal with recycling-focused handling and transfer records",
    "Same-day and next-day collection slots available across local routes"
  ],
  [
    "No roadside skip sitting outside your property for days",
    "Labour, loading, transport, and disposal are included in one booking",
    "Suitable for homes, landlords, shops, offices, and light trade waste",
    "Clear pricing based on the volume collected and access required",
    "Digital Waste Transfer Note provided after compliant disposal"
  ],
  [
    "Faster than waiting for traditional skip delivery and collection",
    "Two-person crews available for awkward furniture and heavy mixed loads",
    "Collections from inside properties, gardens, sheds, stores, and workspaces",
    "Useful for urgent clear-outs, moving dates, refurbishments, and tenancy changes",
    "Waste is taken to licensed facilities for sorting, recycling, and disposal"
  ],
  [
    "Book a load size that matches the actual rubbish you need removed",
    "Our crew carries, sorts, loads, and removes everything on the visit",
    "Ideal for bulky furniture, bagged junk, appliances, office waste, and debris",
    "No permit delays, no unused skip capacity, and no heavy lifting for you",
    "Responsible disposal route with proof supplied after collection"
  ]
];

const commonCollectedItems = [
  "Household furniture, sofas, beds, wardrobes, tables, and chairs",
  "White goods, appliances, mixed household junk, and bagged waste",
  "Garden waste, branches, soil, shed contents, and outdoor clutter",
  "Office desks, chairs, filing cabinets, packaging, and commercial clear-out items",
  "Builders' rubble, renovation debris, timber, fixtures, and non-hazardous trade waste",
  "Landlord, end-of-tenancy, probate, garage, loft, and storage clearance loads",
  "Bulky items and general rubbish that standard council collections may not take"
];

const restrictedItems = [
  "Asbestos or asbestos-containing materials",
  "Clinical, biological, or medical waste",
  "Paint, solvents, large chemical quantities, and hazardous liquids",
  "Gas bottles, pressurised containers, and specialist regulated waste",
  "Tyres or items that require a separate licensed disposal route"
];

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pick(collection, seed, offset = 0) {
  return collection[(seed + offset) % collection.length];
}

function formatArea(location, region) {
  return region && region !== location ? `${location}, ${region}` : location;
}

function coverageText(location, region) {
  if (region && region !== location) {
    return `${location}, nearby towns, surrounding villages, and wider parts of ${region}`;
  }

  return `${location}, nearby neighbourhoods, surrounding villages, and local business areas`;
}

function localRoutes(location, region, context) {
  return `${location} town centre, ${context.streets}${region && region !== location ? `, and surrounding parts of ${region}` : ""}`;
}

function makeMetaDescription(location, region, variant) {
  const area = formatArea(location, region);
  const options = [
    `Book fast rubbish removal in ${area} with same-day waste collection, rubbish clearance, junk removal and skip hire alternatives for homes and businesses.`,
    `Reliable rubbish removal in ${area}. Same-day waste collection, rubbish clearance, junk removal and licensed disposal for households, landlords and commercial customers.`,
    `Need rubbish removal in ${area}? Rocket Rubbish provides waste collection, rubbish clearance, junk removal and skip hire alternatives with labour included.`,
    `Fast, licensed rubbish removal in ${area} for bulky waste, property clearances, office junk, garden waste and responsible waste disposal.`
  ];

  return options[variant % options.length];
}

function makeFaqItems(location, region, context) {
  const coverage = coverageText(location, region);

  return [
    {
      question: `What areas in ${location} do you cover for rubbish removal?`,
      answer: `We cover ${coverage}. Our routing is designed for local household, landlord, office, and light trade collections, so we can usually advise quickly on availability for your address.`
    },
    {
      question: `Can you provide same-day rubbish clearance in ${location}?`,
      answer: `Yes, same-day rubbish clearance in ${location} is often available when the load details are confirmed early enough and access is clear. Larger property, office, or renovation clearances can normally be booked for the next suitable slot.`
    },
    {
      question: `What kind of waste collection jobs do you handle in ${location}?`,
      answer: `We collect furniture, appliances, bagged rubbish, garden waste, office clutter, landlord waste, builders' debris, and general non-hazardous junk from ${context.homes}, as well as ${context.business}.`
    },
    {
      question: `Do I need a skip permit in ${location} if I book your team?`,
      answer: `No. Our crew loads and removes the waste during the visit, so most customers do not need skip hire or a roadside skip permit. This is especially useful where parking is limited or the rubbish is stored inside the property.`
    },
    {
      question: `How is rubbish removal priced in ${location}?`,
      answer: `Pricing is based on the volume of waste, the type of material, and the access needed to remove it. We confirm the quote before loading starts, so you know what the collection will cost before the job goes ahead.`
    },
    {
      question: `Do you handle office and commercial rubbish clearance in ${location}?`,
      answer: `Yes. We clear desks, chairs, filing cabinets, shelving, packaging, shop fittings, archived waste, and mixed non-hazardous business rubbish for offices, shops, landlords, and managed properties in ${location}.`
    },
    {
      question: `What happens to the waste after collection in ${location}?`,
      answer: `Collected waste is taken to licensed transfer and recycling facilities for sorting, recovery, and compliant disposal. A digital Waste Transfer Note is provided so you have proof that the rubbish was handled through the proper legal route.`
    }
  ];
}

function enrichPage(page) {
  const location = String(page.name || "").trim();
  const slug = String(page.slug || "").trim();
  const region = String(page.regionName || location).trim();
  const seed = hashString(`${location}|${slug}|${region}`);
  const variant = seed % 4;
  const context = pick(serviceContexts, seed);
  const images = pick(imageSets, seed);
  const area = formatArea(location, region);
  const coverage = coverageText(location, region);
  const routes = localRoutes(location, region, context);
  const isAreaPage = page.sourceType === "region" || slug.endsWith("-area");
  const pageContext = region && region !== location
    ? `${location} in ${region}`
    : isAreaPage
      ? `${location} area`
      : `${location} service area`;
  const titleLocation = region && region !== location ? `${location} ${region}` : isAreaPage ? `${location} Area` : location;
  const updatedAt = new Date().toISOString();

  const heroOpeners = [
    `Rocket Rubbish delivers fast rubbish removal, rubbish clearance, waste collection, waste disposal and junk removal across ${location} with labour included from the start.`,
    `Rocket Rubbish provides dependable rubbish removal in ${location}, combining quick rubbish clearance, licensed waste collection, responsible waste disposal and practical junk removal.`,
    `If you need rubbish removal in ${location}, our crew gives you a straightforward way to clear unwanted waste without arranging skip hire or doing the lifting yourself.`,
    `Our ${location} rubbish removal service is built for busy households, landlords, businesses and contractors that need waste cleared quickly and legally.`
  ];

  const heroClosers = [
    `From bulky household items to full property and office clearances, our team arrives ready to load, remove and dispose of everything through the correct route.`,
    `Whether the job is a few awkward items or a full van load, we keep the process simple with clear pricing, careful loading and same-day availability where possible.`,
    `We handle ${context.homes}, plus ${context.business}, giving local customers a cleaner alternative to skip hire.`,
    `You get a fully managed collection with no skip permit delays, no heavy lifting and no rubbish left behind once the job is complete.`
  ];
  const heroSubheadlines = [
    `Fast, affordable and fully licensed rubbish removal across ${area}`,
    `Same-day rubbish clearance, waste collection and junk removal in ${area}`,
    `Local rubbish clearance for homes, landlords and businesses across ${area}`,
    `A cleaner skip hire alternative with labour included across ${area}`
  ];

  const servicesText = [
    `Choose the right load size for your ${location} rubbish removal job, from a Mini Load for a few awkward items to an XX-Large full property or office clearance. Every booking includes labour, loading, licensed waste collection and responsible waste disposal, giving customers across ${coverage} a practical alternative to skip hire.`,
    `Compare flexible load sizes for rubbish removal in ${location}, whether you are clearing ${context.homes} or managing ${context.business}. Each option includes the crew, loading, transport, licensed disposal and recycling-focused handling, so you only book the space you actually need.`,
    `Our ${location} waste collection options are designed for small pickups, bulky junk removal, landlord clearances and larger commercial loads. Labour, loading and responsible waste disposal are included from the start, making the service faster and easier than arranging a traditional skip.`,
    `From single-item junk removal to larger rubbish clearance projects, our ${location} team helps you choose the right van load for the job. We support domestic, landlord, office and trade customers with clear pricing, licensed disposal and a cleaner skip hire alternative.`
  ];

  const sameDayIntro = [
    `Need rubbish removal in ${location} today? Rocket Rubbish covers ${routes} with fast rubbish clearance and waste collection for ${context.homes}. Whether you are clearing a room, emptying a garage, removing office furniture or dealing with renovation waste, our local crew can often collect the same day and leave the space ready to use again.`,
    `Need waste collection in ${location} at short notice? We support customers across ${coverage} with same-day and next-day rubbish clearance for homes, landlords, workplaces and light trade jobs. Our team arrives ready to lift, load and remove the waste properly, so you do not have to wait around for a skip or make repeated tip runs.`,
    `For urgent rubbish clearance in ${location}, Rocket Rubbish provides a practical same-day collection service covering ${routes}. We collect bulky furniture, bagged junk, garden waste, office clutter and non-hazardous renovation debris with labour included and responsible disposal handled after collection.`,
    `When unwanted rubbish is holding up a move, tenancy handover, refurb or business reset in ${location}, our team can help quickly. We cover ${coverage} with fast waste collection, careful loading and licensed disposal, giving you a same-day skip hire alternative that keeps the job moving.`
  ];

  const sameDayDetails = [
    `Our junk removal process is designed to keep things simple. We inspect the load, confirm the quote, carry everything from wherever it is stored, and transport it to licensed recycling and transfer facilities. No skip permit, no container sitting outside, and no heavy lifting left for you.`,
    `The collection is fully managed from start to finish. Once the price is agreed, our crew removes the items from rooms, gardens, garages, offices or yards and loads them straight into the van. The waste then goes to licensed facilities for sorting, recycling and compliant disposal.`,
    `You do not need to organise separate labour, arrange a skip delivery or worry about unused container space. Our team brings the vehicle and the lifting support, removes the waste during the visit, and provides the correct disposal documentation after the job.`,
    `This is a hands-off service for the customer. We handle access, loading, transport and disposal, while keeping the quote clear and proportionate to the volume collected. It is ideal for urgent clear-outs where the rubbish needs to be gone without delay.`
  ];

  const wasteText = [
    `Responsible waste disposal sits at the centre of every ${location} collection. Your rubbish is taken to licensed commercial recycling and transfer facilities, where reusable and recyclable materials are separated wherever possible. After collection, you receive a digital Waste Transfer Note as proof that the rubbish clearance and waste disposal were completed legally and professionally.`,
    `Rocket Rubbish handles waste disposal in ${location} through licensed facilities that process collected materials for recycling, recovery and compliant disposal. We do not simply collect the rubbish and disappear; every job follows the correct legal route and is backed by transfer documentation for peace of mind.`,
    `Every waste collection in ${location} is managed with compliance and recycling in mind. Mixed loads are transported to approved facilities where materials are sorted and processed responsibly. That means your household, landlord, office or renovation waste is removed quickly without compromising on legal disposal standards.`,
    `Our ${location} rubbish clearance service includes proper waste disposal as part of the booking. We use licensed transfer and recycling facilities, provide documentation after collection, and aim to divert reusable material from landfill wherever the waste stream allows.`
  ];

  const wasteSubText = [
    `Skip hire is not always the easiest option in ${location}, especially where access is tight, parking is limited or the waste is stored inside the property. Our skip hire alternative means we arrive with the labour, load the van, and remove everything on the same visit, so you pay only for the space your rubbish actually uses.`,
    `Instead of waiting for a skip delivery, arranging permits and doing the lifting yourself, our crew completes the collection in one visit. This is useful for ${context.streets}, where a roadside container can be awkward, expensive or simply unnecessary for the amount of waste involved.`,
    `Our man-and-van style waste collection gives you more flexibility than traditional skip hire. We can collect from inside the property, load awkward items, remove mixed rubbish and take everything away immediately, which helps keep driveways, pavements and shared access clear.`,
    `For many ${location} customers, the smarter option is a labour-included collection rather than a skip. The team arrives at the agreed time, loads the waste safely, and removes it straight away, avoiding permit delays, overfilled containers and neighbours adding extra rubbish overnight.`
  ];

  const propertyText = [
    `Whether you are dealing with an end-of-tenancy, preparing a property for sale, clearing inherited belongings or stripping out a workspace, our ${location} property clearance service handles the job from start to finish. We clear ${context.property}, removing furniture, appliances, bagged waste, bulky junk and renovation debris with care.`,
    `Our ${location} property clearance service is built for customers who need more than a quick pickup. We clear single rooms, lofts, garages, gardens, offices, rental homes and storage spaces, taking away unwanted furniture, white goods, mixed rubbish and years of accumulated clutter.`,
    `When a property in ${location} needs to be cleared properly, our team provides the labour, vehicles and licensed disposal route in one managed service. We help with ${context.property}, working carefully so the space is left usable and ready for the next stage.`,
    `From small room clearances to full house, landlord and commercial clear-outs, Rocket Rubbish supports ${location} customers with organised property rubbish clearance. We remove awkward items, bagged junk, old appliances, office furniture and non-hazardous refurbishment waste quickly and responsibly.`
  ];

  const propertyDetails = [
    `Our trained clearance crews work methodically and respectfully, especially where the job involves sensitive circumstances or a tight deadline. Every booking includes labour, loading, waste collection and licensed disposal, so you are left with a genuinely clear property and far less stress.`,
    `We plan the clearance around access, volume and the type of waste involved. The team carries items from wherever they are stored, loads them safely, and transports them to licensed facilities, leaving the property clearer, tidier and ready for handover, sale or reuse.`,
    `The service is suitable for landlords, homeowners, agents, businesses and contractors who need a reliable clear-out without coordinating several suppliers. We manage the heavy lifting and disposal route, while you get one clear booking and one accountable team.`,
    `Because the crew loads everything for you, there is no need to drag heavy items outside or fill a skip yourself. We remove the waste directly from the property and provide responsible disposal documentation after collection.`
  ];

  const greenSubtitle = [
    `Need quick junk removal in ${location}? We clear unwanted household waste, landlord items, office clutter, garden rubbish and renovation debris with labour included and transparent pricing.`,
    `For fast junk removal in ${location}, our team collects bulky items, mixed rubbish, appliances, office waste and general clutter from homes, businesses and managed properties.`,
    `Clear unwanted junk in ${location} without hiring a skip or doing the lifting yourself. We handle loading, waste collection, recycling-focused disposal and transfer records in one visit.`,
    `Rocket Rubbish helps ${location} customers clear homes, offices, garages, rental properties and small sites quickly, with flexible load sizes and responsible disposal included.`
  ];

  const greenFooter = [
    `Every booking includes loading, rubbish clearance, waste collection and responsible disposal. A same-day skip hire alternative that keeps ${location} clear-outs moving.`,
    `From a single bulky item to a full van load, our crews cover ${coverage} with clear pricing, careful loading and licensed waste disposal.`,
    `You get a simple rubbish removal solution across ${location}, with labour included, flexible booking and no permit delays from traditional skip hire.`,
    `Our team works across ${coverage}, helping households and businesses clear space quickly while keeping disposal legal, traceable and recycling focused.`
  ];

  const compareText = [
    `Our ${location} waste collection service covers most household, office, landlord, garden and renovation waste, including bulky items that can be difficult to move without help. It is a straightforward rubbish clearance and junk removal option for customers who want one team to lift, load, remove and dispose of everything properly.`,
    `The ${location} team removes the common waste streams that build up during moves, refurbishments, tenancy changes and business clear-outs. We collect non-hazardous rubbish quickly and legally, while specialist or hazardous materials still need the correct separate disposal route.`,
    `For customers in ${location}, we handle the everyday bulky, bagged, domestic, office and trade waste that often becomes difficult to clear on short notice. Our service is designed to be faster than skip hire and more complete than a kerbside collection.`,
    `Most general junk, furniture, appliances, garden waste, office clutter and refurbishment debris can be collected in ${location}. If an item needs specialist disposal, we will advise clearly before the booking goes ahead.`
  ];

  const mapText = [
    `We provide rubbish removal, rubbish clearance, waste collection and junk removal across ${coverage}, including ${routes}.`,
    `Our collection coverage includes ${coverage}. Use the map as a guide to local availability around ${location} and nearby service areas.`,
    `Rocket Rubbish supports customers throughout ${location} and surrounding parts of ${region || "the local area"}, covering homes, workplaces, landlords and light trade collections.`,
    `We collect rubbish across ${routes}, with wider availability throughout ${coverage} depending on route planning and booking times.`
  ];

  const bottomText = [
    `Book trusted rubbish removal in ${location} with a team that handles the lifting, loading, waste collection and licensed disposal for you. Call, WhatsApp or book online for a clear quote and fast availability.`,
    `Clear your space in ${location} without skip hire delays. Rocket Rubbish provides labour-included rubbish clearance, responsible waste disposal and flexible booking for homes and businesses.`,
    `Need junk removed in ${location}? Speak to Rocket Rubbish for fast waste collection, careful loading and compliant disposal, with same-day and next-day slots available on many local routes.`,
    `From bulky items to full property clearances, our ${location} team makes rubbish removal simple. Get a quick quote, choose a convenient slot and let us handle the heavy lifting.`
  ];

  const titleConnector = variant % 2 === 0 ? "Same-Day Waste Collection" : "Rubbish Clearance & Waste Collection";

  return {
    ...page,
    metaTitle: `Rubbish Removal ${titleLocation} | ${titleConnector} | Rocket Rubbish`,
    metaDescription: makeMetaDescription(location, region, variant),
    canonicalPath: `/cities/${slug}`,
    ogTitle: `Rubbish Removal ${titleLocation} | ${titleConnector} | Rocket Rubbish`,
    ogDescription: makeMetaDescription(location, region, variant + 1),
    ogImage: page.ogImage || page.heroImage || images.heroImage,
    heroTitle: `Rubbish Removal In ${location}`,
    heroSubheadline: pick(heroSubheadlines, seed),
    heroText: `${pick(heroOpeners, seed)} ${pick(heroClosers, seed, 1)} The route is planned around ${pageContext}, keeping the collection local, practical and easy to book.`,
    heroImage: page.heroImage || images.heroImage,
    heroAlt: page.heroAlt || `Rocket Rubbish rubbish removal team serving ${location}`,
    servicesTitle: `Our Most Popular Waste Collection Services In ${location}`,
    servicesText: `${pick(servicesText, seed)} The load options are tailored to ${pageContext}, so local homes, landlords and businesses can book the right amount of space without overpaying.`,
    highlightsTitle: `Same-Day Rubbish Removal Across ${location}`,
    sameDayTitle: `Same-Day Rubbish Removal Across ${location}`,
    sameDayIntro: pick(sameDayIntro, seed),
    sameDayDetails: pick(sameDayDetails, seed),
    sameDayBullets: pick(sameDayBulletSets, seed),
    sameDayFooter: `Ideal for ${context.homes}, plus ${context.business}.`,
    wasteTitle: "Responsible Waste Disposal & Skip Hire Alternative",
    wasteText: `${pick(wasteText, seed)} For ${pageContext}, that means every collection has a clear disposal trail from pickup through to processing.`,
    wasteImage: page.wasteImage || images.wasteImage,
    wasteAlt: page.wasteAlt || `Rocket Rubbish waste collection team serving ${location}`,
    wasteSubTitle: `The Smarter Skip Hire Alternative In ${location}`,
    wasteSubText: `${pick(wasteSubText, seed)} It keeps rubbish removal in ${pageContext} simple for homes, businesses and managed properties.`,
    propertyTitle: `Complete Property Rubbish Clearance In ${location}`,
    propertyText: `${pick(propertyText, seed)} The service is shaped around the access, property types and local routes in ${pageContext}.`,
    propertyDetails: `${pick(propertyDetails, seed)} That gives customers in ${pageContext} one accountable team for the clearance rather than separate lifting, transport and disposal arrangements.`,
    propertyImage: page.propertyImage || images.propertyImage,
    propertyAlt: page.propertyAlt || `Rocket Rubbish property clearance team serving ${location}`,
    greenTitle: `Fast & Affordable Junk Removal In ${location}`,
    greenSubtitle: `${pick(greenSubtitle, seed)} Collections are organised around ${pageContext} so local jobs can be quoted and routed efficiently.`,
    greenFooter: `${pick(greenFooter, seed)} It is a practical way to keep ${pageContext} clear-outs moving without skip hire delays.`,
    compareTitle: `What Our Waste Collection Service Covers In ${location}`,
    compareText: `${pick(compareText, seed)} The guidance applies to typical collections around ${pageContext}, with clear advice given before anything specialist is booked.`,
    comparePositiveTitle: "Items we collect:",
    compareNegativeTitle: "Items requiring specialist disposal:",
    comparePositiveItems: commonCollectedItems,
    compareNegativeItems: restrictedItems,
    compareSubTitle: "Licensed Waste Disposal You Can Trust",
    compareSubText: `Every rubbish removal and waste collection job in ${area} is handled through a licensed disposal route. Using an unlicensed operator can create fly-tipping risk for the property owner, so Rocket Rubbish keeps collections traceable, documented and professionally managed.`,
    compareFooter: "If you are unsure whether we can take a specific item, contact the team and we will advise clearly before booking.",
    mapTitle: `Areas Covered Across ${location}`,
    mapText: pick(mapText, seed),
    faqEyebrow: "Got Questions?",
    faqTitle: `Frequently Asked Questions About Rubbish Removal In ${location}`,
    faqDescription: `Everything you need to know about rubbish removal, rubbish clearance, waste collection, junk removal and skip hire alternatives in ${location}.`,
    faqItems: makeFaqItems(location, region, context),
    bottomTitle: `Ready To Clear Your Space? Book Rubbish Removal In ${location} Today`,
    bottomText: `${pick(bottomText, seed)} For ${pageContext}, the aim is simple: clear pricing, careful loading and a legal disposal route from start to finish.`,
    updatedAt
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
      lastmod: String(lastModified || new Date().toISOString()).slice(0, 10)
    });
  };

  staticRoutes.forEach((routePath) => addEntry(routePath));
  (content.customPages || []).forEach((page) => addEntry(`/${page.slug}`, page.updatedAt || page.createdAt));
  (content.cityPages || []).forEach((page) => addEntry(page.canonicalPath || `/cities/${page.slug}`, page.updatedAt || page.createdAt));
  (content.blogPosts || [])
    .filter((post) => post.status !== "Draft")
    .forEach((post) => addEntry(`/blog/${post.slug}`, post.updatedAt || post.createdAt));

  const urls = entries
    .map((entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobotsTxt() {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${siteOrigin}/sitemap.xml`].join("\n");
}

const content = JSON.parse(await fs.readFile(siteContentPath, "utf8"));
const beforeCount = content.cityPages.length;
let updatedCount = 0;

const cityPages = content.cityPages.map((page) => {
  updatedCount += 1;
  return enrichPage(page);
});

const nextContent = {
  ...content,
  cityPages
};

await fs.writeFile(siteContentPath, JSON.stringify(nextContent, null, 2), "utf8");
await fs.mkdir(publicDirectoryPath, { recursive: true });
await fs.writeFile(sitemapFilePath, buildSitemapXml(nextContent), "utf8");
await fs.writeFile(robotsFilePath, buildRobotsTxt(), "utf8");

console.log(`Enriched ${updatedCount} city pages. Total city pages: ${beforeCount}.`);
