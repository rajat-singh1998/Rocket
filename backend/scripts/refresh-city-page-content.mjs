import "dotenv/config";
import { readSiteContent, writeSiteContent } from "../src/contentStore.js";

const targetSlugs = [
  "greater-london",
  "helmsley",
  "ripley",
  "kingston-upon-hull",
  "wigan",
  "thetford",
  "thirsk",
  "west-yorkshire",
  "staffordshire",
  "dunstable",
  "sandhurst",
  "queenborough-in-sheppey",
  "rugby",
  "launceston",
  "chagford",
  "wainfleet-all-saints",
  "rutland",
  "burnham-on-sea",
  "wales",
  "east-midlands",
  "mossley",
  "greater-manchester",
  "oundle",
  "oswestry",
  "thorpe-st-andrew",
  "sittingbourne",
  "wisbech",
  "kimberley",
  "meltham",
  "askern",
  "wolverton-and-greenleys",
  "billericay",
  "chorleywood",
  "great-torrington",
  "moreton-in-marsh",
  "epworth",
  "dartmouth",
  "weston-super-mare",
  "edinburgh",
  "prudhoe",
  "towcester",
  "pudsey",
  "batley",
  "yarmouth",
  "west-bromwich",
  "retford",
  "kent",
  "tickhill",
  "edmonton",
  "newcastle-upon-tyne",
  "conisbrough",
  "ascot",
  "dulverton",
  "tiverton",
  "ollerton-and-boughton",
  "kenilworth",
  "strood",
  "silloth",
  "north-hykeham",
  "hartlepool",
  "beverley",
  "surbiton",
  "st-ives-cambridgeshire",
  "sprowston",
  "chatham",
  "totton-and-eling",
  "leek",
  "staines-upon-thames",
  "lytham-st-annes",
  "cotgrave",
  "falmouth",
  "hornsea",
  "sandwich",
  "wellington-somerset",
  "christchurch",
  "heywood",
  "wragby",
  "ripon",
  "bury-st-edmunds",
  "fordingbridge",
  "braunstone-town",
  "carlisle",
  "crewkerne",
  "buxton",
  "bacup",
  "carlton-colville",
  "woking",
  "tipton",
  "pateley-bridge",
  "uxbridge",
  "royal-leamington-spa",
  "burton-latimer",
  "faversham",
  "basingstoke",
  "burgh-le-marsh",
  "sturminster-newton",
  "lyme-regis",
  "ryde",
  "lewes",
  "st-mary-cray",
  "maghull",
  "thatcham",
  "essex",
  "leyland",
  "maltby",
  "wixams",
  "crook",
  "keighley",
  "marlow",
  "whitchurch-shropshire",
  "pickering",
  "brading",
  "sandiacre",
  "dronfield",
  "braintree",
  "princes-risborough",
  "bishop-auckland",
  "saltash",
  "sidmouth",
  "higham-ferrers",
  "carterton",
  "clare",
  "houghton-regis",
  "gorleston-on-sea",
  "marlborough",
  "chichester",
  "filton",
  "desborough",
  "wrexham",
  "moretonhampstead",
  "rothwell-west-yorkshire",
  "grange-over-sands",
  "faringdon",
  "southwell",
  "newport-pagnell",
  "carnforth",
  "louth",
  "staveley",
  "new-malden",
  "bradley-stoke",
  "tewkesbury",
  "ilminster",
  "hexham",
  "ponteland",
  "oxford",
  "fareham",
  "banstead",
  "chatteris",
  "watchet",
  "south-cave",
  "lancaster",
  "fleet",
  "south-molton",
  "blackwater-and-hawley",
  "shepshed",
  "lechlade",
  "bromyard",
  "bishops-stortford",
  "margate",
  "newton-aycliffe",
  "burslem",
  "earley",
  "horsham",
  "cleobury-mortimer",
  "axbridge",
  "swanscombe-and-greenhithe",
  "bradford-on-avon",
  "penwortham",
  "whitchurch-hampshire",
  "gloucestershire",
  "east-riding-of-yorkshire",
  "lisburn",
  "droitwich-spa",
  "stroud",
  "hendon",
  "rushden",
  "crowland",
  "brighouse",
  "whitehaven",
  "emsworth",
  "sawbridgeworth",
  "nailsea",
  "bordon",
  "exmouth",
  "st-mawes",
  "ashington",
  "cramlington",
  "craven-arms",
  "st-ives-cornwall",
  "bottesford",
  "woodley",
  "denholme",
  "matlock",
  "farnborough",
  "yate",
  "eton",
  "padstow",
  "morecambe",
  "caterham",
  "dorchester",
  "tynemouth",
  "northampton",
  "dinnington-st-johns",
  "uttoxeter",
  "hedon",
  "shefford",
  "stevenage",
  "ongar",
  "lymington",
  "kings-lynn",
  "fenton",
  "flitwick",
  "wakefield",
  "wotton-under-edge",
  "hessle",
  "bromborough",
  "adlington",
  "birchwood"
];

const uniqueTargetSlugs = [...new Set(targetSlugs)];
const coastalSlugs = new Set([
  "margate",
  "morecambe",
  "padstow",
  "exmouth",
  "burnham-on-sea",
  "st-ives-cornwall",
  "lymington",
  "tynemouth",
  "whitehaven",
  "emsworth",
  "fareham",
  "watchet",
  "carnforth",
  "louth",
  "st-mawes",
  "launceston"
]);
const londonSlugs = new Set(["greater-london", "new-malden", "hendon", "banstead", "caterham", "earley"]);
const citySlugs = new Set([
  "oxford",
  "kingston-upon-hull",
  "wigan",
  "wakefield",
  "lancaster",
  "northampton",
  "stevenage",
  "dunstable",
  "rugby",
  "farnborough",
  "cramlington",
  "kings-lynn",
  "manchester",
  "birmingham",
  "leeds",
  "bristol",
  "liverpool",
  "leicester",
  "exeter",
  "canterbury",
  "lisburn"
]);
const regionSlugs = new Set(["west-yorkshire", "staffordshire", "gloucestershire", "east-riding-of-yorkshire", "rutland", "wales", "east-midlands"]);
const businessSlugs = new Set(["bradley-stoke", "blackwater-and-hawley", "birchwood", "bromborough", "fenton", "bordon", "fleet", "sandhurst", "shefford", "flitwick", "adlington", "woodley", "yate"]);
const marketSlugs = new Set(["helmsley", "thirsk", "southwell", "newport-pagnell", "chagford", "bromyard", "cleobury-mortimer", "south-cave", "lechlade", "bradford-on-avon", "ilminster", "hexham", "ponteland", "dorchester", "wotton-under-edge", "matlock", "padstow"]);

const openings = [
  "practical, licensed clearance for busy local properties",
  "careful waste collection for homes, shops and managed buildings",
  "a straightforward rubbish removal service built around local access",
  "tidy, reliable clearance for domestic and commercial spaces",
  "organised waste removal with loading, transport and disposal included",
  "a local collection option for bulky items, bagged waste and clear-outs"
];
const processAngles = [
  "We confirm access before arrival, protect the route through the property and load the van in a sensible order.",
  "The crew plans the collection around parking, stairways, lift access and any time limits at the address.",
  "Your items are separated where practical so reusable material, recycling and general waste follow the right route.",
  "We keep the job moving with clear arrival windows, careful lifting and tidy loading from the room, garage or garden.",
  "The service is arranged so landlords, homeowners and businesses do not need to organise separate labour or skip permits."
];
const benefits = [
  "no skip sitting outside the property",
  "clear pricing before the team starts loading",
  "less disruption for neighbours, tenants and customers",
  "licensed disposal records handled by the collection team",
  "flexible collections for one bulky item or a full clearance",
  "responsible recycling where the waste stream allows it"
];
const serviceWords = ["rubbish clearance", "waste collection", "junk removal", "property clearance", "bulky waste removal", "licensed disposal"];

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function pick(list, seed, offset = 0) {
  return list[(seed + offset) % list.length];
}

function compactTitle(text, limit = 62) {
  if (text.length <= limit) return text;
  const trimmed = text.slice(0, limit - 1);
  return trimmed.slice(0, Math.max(trimmed.lastIndexOf(" "), 30));
}

function buildProfile(page, seed) {
  const name = page.name;
  const region = page.regionName && page.regionName !== name ? page.regionName : "";
  const baseArea = region ? `${name} and nearby ${region} communities` : `${name} town centre, surrounding estates and nearby villages`;

  if (regionSlugs.has(page.slug) || page.sourceType === "region") {
    return {
      area: region || name,
      nearby: `${name} towns, villages, rural lanes, trading estates and business parks`,
      properties: "detached homes, terraces, farm outbuildings, rental houses and small commercial units",
      businesses: "local shops, workshops, hospitality premises, offices and trade sites",
      waste: "household furniture, garden cuttings, mixed bagged rubbish, office fixtures and non-hazardous renovation debris",
      access: "Access can vary from narrow village roads to busy town centres, so collections are planned before the crew arrives.",
      detail: `Because ${name} covers different property types, the team checks load size, access and disposal route before confirming the job.`,
      setting: `larger coverage area across ${name}`
    };
  }

  if (londonSlugs.has(page.slug) || /london/i.test(region)) {
    return {
      area: baseArea,
      nearby: `${name} high streets, flats, maisonettes, managed blocks and residential side roads`,
      properties: "flats, maisonettes, terraces, landlord-managed houses and compact commercial units",
      businesses: "retail units, estate agents, offices, cafes and local service businesses",
      waste: "bulky furniture, white goods, office waste, bagged rubbish and end-of-tenancy clear-out loads",
      access: "Controlled parking, tight stairwells and shared entrances are checked before lifting starts.",
      detail: `In ${name}, collections often need tidy loading from flats, rear alleys or short-stay parking bays.`,
      setting: `urban and suburban streets around ${name}`
    };
  }

  if (coastalSlugs.has(page.slug)) {
    return {
      area: baseArea,
      nearby: `${name} seafront roads, harbour-side properties, holiday lets and residential neighbourhoods`,
      properties: "holiday lets, guest houses, family homes, garages, sheds and small shops",
      businesses: "cafes, independent retailers, accommodation providers and seasonal businesses",
      waste: "old mattresses, sofas, garden waste, shop fittings, bulky household items and general clear-out rubbish",
      access: "Seasonal traffic, narrow streets and short parking windows are considered when arranging the collection.",
      detail: `${name} clearances often involve mixed household and visitor-accommodation waste, so the load is sorted carefully.`,
      setting: `coastal homes, guest accommodation and town-centre streets in ${name}`
    };
  }

  if (businessSlugs.has(page.slug)) {
    return {
      area: baseArea,
      nearby: `${name} estates, retail parades, offices, workshops and family housing areas`,
      properties: "modern homes, rental properties, warehouses, garages and small office spaces",
      businesses: "business parks, trade counters, shops, offices and light industrial units",
      waste: "office furniture, packaging, pallets, appliances, household junk and non-hazardous trade waste",
      access: "Collections are planned around loading bays, site access rules and customer parking where needed.",
      detail: `${name} jobs can combine domestic rubbish with commercial items, so the crew separates what can be reused or recycled.`,
      setting: `residential streets and business locations around ${name}`
    };
  }

  if (citySlugs.has(page.slug)) {
    return {
      area: baseArea,
      nearby: `${name} suburbs, retail areas, student lets, offices and older residential streets`,
      properties: "terraces, semis, apartments, student rentals, garages and commercial premises",
      businesses: "shops, offices, restaurants, landlords, facilities teams and local contractors",
      waste: "sofas, appliances, office desks, bagged rubbish, garden waste and renovation offcuts",
      access: "The team works around busy roads, restricted parking and multi-floor buildings.",
      detail: `${name} collections are built for varied property sizes, from single bulky items to larger managed clearances.`,
      setting: `busy residential and commercial districts across ${name}`
    };
  }

  if (marketSlugs.has(page.slug)) {
    return {
      area: baseArea,
      nearby: `${name} market streets, older cottages, residential lanes, farm drives and independent shops`,
      properties: "cottages, family homes, terraces, barns, garages, sheds and landlord-managed rentals",
      businesses: "independent retailers, offices, hospitality venues and rural workspaces",
      waste: "old furniture, loft contents, garden clippings, shed waste, appliances and non-hazardous DIY debris",
      access: "Older streets, lanes and driveways are checked so the vehicle and lifting route are planned properly.",
      detail: `${name} clearances often need careful handling in older properties, narrow lanes and mixed-use town-centre areas.`,
      setting: `market-town streets, cottages and village-edge homes around ${name}`
    };
  }

  return {
    area: baseArea,
    nearby: `${name} residential roads, local shopping areas, estates, garages and surrounding communities`,
    properties: "family homes, flats, terraces, rental properties, garages and small commercial units",
    businesses: "shops, offices, landlords, tradespeople and local facilities teams",
    waste: "household clutter, bulky furniture, appliances, bagged waste, garden waste and light renovation debris",
    access: "Parking, room access and load size are checked before the team starts, keeping the collection simple.",
    detail: `${name} customers often need a flexible service that handles both one-off bulky items and larger clearances.`,
    setting: `homes, rentals and local businesses around ${name}`
  };
}

function displayLabel(page) {
  const specialLabels = {
    "whitchurch-hampshire": "Whitchurch in Hampshire",
    "whitchurch-shropshire": "Whitchurch in Shropshire",
    "st-ives-cambridgeshire": "St Ives in Cambridgeshire",
    "st-ives-cornwall": "St Ives in Cornwall"
  };
  return specialLabels[page.slug] || page.name;
}

function buildFaqs(page, profile, label) {
  const name = page.name;
  const region = page.regionName && page.regionName !== name ? page.regionName : "the local area";
  return [
    {
      question: `Can you collect rubbish from ${label} properties with awkward access?`,
      answer: `Yes. Tell us about stairs, narrow lanes, shared entrances or parking limits when booking. For ${label}, we plan the vehicle position and lifting route before loading starts.`
    },
    {
      question: `Do you handle both residential and commercial waste in ${label}?`,
      answer: `Yes. We collect from ${profile.properties}, plus ${profile.businesses}. Hazardous or specialist-regulated items are flagged separately before collection.`
    },
    {
      question: `What types of waste are common on ${label} clearances?`,
      answer: `Typical jobs include ${profile.waste}. We also help with end-of-tenancy rubbish, garage contents and non-hazardous refurbishment waste.`
    },
    {
      question: `Can you clear garden and shed waste around ${label}?`,
      answer: "Yes. Branches, soil bags, broken garden furniture, shed contents and outdoor clutter can be removed, provided the load is safe and non-hazardous."
    },
    {
      question: `Is skip hire needed for a ${label} rubbish removal job?`,
      answer: "Usually no. Our man and van service loads the waste for you, which avoids skip permits, driveway space issues and the problem of other people adding rubbish overnight."
    },
    {
      question: `How is rubbish disposed of after collection in ${label}?`,
      answer: "The load is taken through licensed disposal routes. Reusable and recyclable material is separated where practical so the job remains traceable and responsible."
    },
    {
      question: `Can landlords book a clearance in ${label} between tenants?`,
      answer: `Yes. Landlord and agent clearances are common in ${region}. We can remove furniture, bagged rubbish, white goods and general contents after tenants leave.`
    },
    {
      question: `How do I get an accurate quote for rubbish removal in ${label}?`,
      answer: "Send photos or describe the items, access and approximate load size. We confirm the likely price before arrival so there are no surprises on the day."
    }
  ];
}

function buildPage(page) {
  const seed = hashString(page.slug);
  const label = displayLabel(page);
  const region = page.regionName && page.regionName !== page.name ? page.regionName : "";
  const profile = buildProfile(page, seed);
  const wordA = pick(serviceWords, seed);
  const wordB = pick(serviceWords, seed, 2);
  const benefitA = pick(benefits, seed);
  const benefitB = pick(benefits, seed, 3);
  const processA = pick(processAngles, seed);
  const processB = pick(processAngles, seed, 2);
  const opening = pick(openings, seed);
  const regionSuffix = region ? ` in ${region}` : "";
  const metaAction = pick(["Same-Day Waste Collection", "Licensed Waste Collection", "Property Clearance", "Bulky Waste Removal"], seed);

  return {
    ...page,
    metaTitle: compactTitle(`${label} Rubbish Removal | ${metaAction} | Rocket Rubbish`),
    metaDescription: `${label} rubbish removal for ${profile.properties}. Licensed team for ${profile.waste}, with loading and responsible disposal included.`.slice(0, 158),
    canonicalPath: page.canonicalPath || `/cities/${page.slug}`,
    ogTitle: `${label} Rubbish Removal And Waste Collection`,
    ogDescription: `${label} rubbish removal for homes, businesses and landlords with licensed loading and disposal.`,
    heroTitle: `Rubbish Removal In ${label}`,
    heroSubheadline: `${opening.charAt(0).toUpperCase() + opening.slice(1)}${regionSuffix}`,
    heroText: `Rocket Rubbish provides ${wordA} in ${label} for ${profile.properties}. The service is shaped around ${profile.nearby}, where access, parking and property layouts can vary from one job to the next. Our team loads ${profile.waste}, then moves everything through a licensed disposal route so the clearance is tidy, traceable and easy to book.`,
    heroAlt: `Rocket Rubbish removal team collecting waste from a ${label} property`,
    servicesTitle: `Rubbish Removal Services Available In ${label}`,
    servicesText: `Choose the right load size for a ${label} clearance, from a few bulky items to a full property clear-out. Each service includes labour, loading, transport and responsible disposal, making it a practical alternative to skip hire for ${profile.area}.`,
    highlightsTitle: `Local Rubbish Clearance Support For ${label}`,
    sameDayTitle: `Same-Day Rubbish Removal For ${label} Homes And Businesses`,
    sameDayIntro: `When waste needs clearing quickly in ${label}, the collection must suit the property rather than forcing you to move items outside. We help homeowners, tenants, landlords, shops and small businesses clear unwanted rubbish without arranging separate labour or transport.`,
    sameDayDetails: `${profile.access} ${processA} This keeps the collection useful for ${profile.properties} and for commercial spaces such as ${profile.businesses}.`,
    sameDayBullets: [
      `${label} household clearances, including furniture, mattresses, appliances and bagged rubbish`,
      `Landlord, probate and end-of-tenancy waste from ${profile.properties}`,
      `Commercial clear-outs for ${profile.businesses}`,
      `Garden waste, shed contents, garage clutter and outdoor items from ${profile.setting}`,
      "Non-hazardous DIY and renovation waste checked before loading",
      `Bulky items that local council collections around ${label} may not take quickly`
    ],
    sameDayFooter: `Useful for ${label} customers who need ${benefitA}, ${benefitB} and a licensed team that does the lifting for them.`,
    wasteTitle: `Licensed Waste Disposal For ${label} Clearances`,
    wasteText: `Every ${label} rubbish removal job is handled with disposal in mind from the start. The crew checks the waste type, separates reusable or recyclable material where practical and avoids mixing items that require specialist treatment.`,
    wasteAlt: `Waste prepared for licensed rubbish collection in ${label}`,
    wasteSubTitle: `Garden, Construction And Mixed Waste In ${label}`,
    wasteSubText: "We can collect garden cuttings, old shed contents, bulky household waste and non-hazardous renovation debris. If a load includes chemicals, asbestos, tyres or medical waste, we will explain that a separate specialist route is required.",
    propertyTitle: `Residential & Commercial Rubbish Clearance In ${label}`,
    propertyText: `${label} clearances can range from a single sofa in a flat to a full house, garage, office or shop clear-out. Our team works carefully through rooms, storage areas, gardens and commercial spaces so the property is left usable again.`,
    propertyDetails: `${profile.detail} We regularly support ${profile.businesses}, as well as homeowners and landlords who need a clear plan, careful lifting and responsible disposal documentation.`,
    propertyAlt: `Rocket Rubbish team carrying items during a ${label} property clearance`,
    greenTitle: `Fast, Local Junk Removal In ${label}`,
    greenSubtitle: `Book a ${label} collection that includes loading, transport and disposal without leaving you to organise a skip, lifting help or separate waste transfer.`,
    greenFooter: `A simple option for ${profile.setting}, with clear guidance before anything specialist is booked.`,
    compareTitle: `What Our ${label} Waste Collection Service Covers`,
    compareText: `Our ${label} service covers most household, office, landlord, garden and renovation waste. It is built for customers who want one team to lift, load, remove and dispose of everything properly while keeping the route local and compliant.`,
    comparePositiveTitle: `Items we collect in ${label}:`,
    compareNegativeTitle: "Items needing specialist disposal:",
    comparePositiveItems: [
      `Household furniture, sofas, beds, wardrobes and dining sets from ${label} homes`,
      "White goods, appliances, bagged junk and mixed domestic waste",
      "Garden branches, green waste, soil bags, broken planters and shed contents",
      "Office chairs, desks, packaging, shelving and commercial clear-out items",
      "Builders' timber, fixtures, light rubble and non-hazardous renovation debris",
      "Landlord, student-let, probate, garage, loft and storage clearance loads",
      `Bulky items that standard collections around ${label} may not remove quickly`
    ],
    compareNegativeItems: [
      "Asbestos or materials that may contain asbestos",
      "Clinical, biological or medical waste",
      "Paint, solvents, large chemical quantities and hazardous liquids",
      "Gas bottles, pressurised containers and specialist regulated waste",
      "Tyres or items requiring a separate licensed disposal route"
    ],
    compareSubTitle: `Responsible Waste Removal Around ${label}`,
    compareSubText: `${processB} This helps protect customers from fly-tipping risks and keeps ${wordB} suitable for both domestic and commercial clearances.`,
    compareFooter: `Ask for advice before booking if your ${label} load includes anything unusual, heavy, sharp or potentially hazardous.`,
    mapTitle: `Rubbish Removal Coverage Across ${label}`,
    mapText: `Rocket Rubbish covers ${profile.area}, including ${profile.nearby}. Internal journeys are planned around local access, property type and the safest loading point for the crew.`,
    faqEyebrow: `${label} Help`,
    faqTitle: `Frequently Asked Questions About Rubbish Removal In ${label}`,
    faqDescription: `Answers for ${label} customers planning household, garden, landlord, office or renovation waste collections.`,
    faqItems: buildFaqs(page, profile, label),
    bottomTitle: `Book Rubbish Removal In ${label}`,
    bottomText: `Tell us what needs clearing in ${label}, share photos if helpful and we will guide you to the right load size. The team arrives ready to lift, load and dispose of your rubbish responsibly.`,
    updatedAt: new Date().toISOString()
  };
}

const content = await readSiteContent();
const targetSet = new Set(uniqueTargetSlugs);
let updated = 0;

const cityPages = content.cityPages.map((page) => {
  if (!targetSet.has(page.slug)) {
    return page;
  }
  updated += 1;
  return buildPage(page);
});

const nextContent = {
  ...content,
  cityPages
};

await writeSiteContent(nextContent);

const missing = uniqueTargetSlugs.filter((slug) => !cityPages.some((page) => page.slug === slug));
console.log(`Updated ${updated} city pages.`);
if (missing.length > 0) {
  console.log(`Missing ${missing.length} city pages: ${missing.join(", ")}`);
  process.exitCode = 1;
}
