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
    heroImage: "/images/rocket/RC_1551.png",
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
    wasteImage: "/images/rocket/rc_29.png",
    wasteSubTitle: "The Better Skip Hire Alternative",
    wasteSubText:
      "With labour included, same-day availability, and fixed pricing, you get everything collected in one visit without permits, overfilled skips, or blocked driveways.",
    propertyTitle: "Complete Property Rubbish Clearance",
    propertyText:
      "From lofts and basements to garages and full house clearances, we collect bulky waste, mixed rubbish, furniture, and general junk across London.",
    propertyImage: "/images/rocket/quote-photo.jpg",
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

const defaultBlogPosts = [
  {
    id: "blog-post-1",
    title: "How to Choose the Right Rubbish Removal Service in London",
    slug: "how-to-choose-the-right-rubbish-removal-service-in-london",
    category: "Rubbish Removal Tips",
    author: "Admin - Rocket Rubbish",
    date: "20 April 2026",
    status: "Published",
    heroImage: "/images/rocket/Rectangle231.png",
    featuredImage: "/images/rocket/Post_Image1.png",
    cardImage: "/images/rocket/Post_Image1.png",
    excerpt:
      "Choosing a reliable rubbish removal service can be confusing, especially with so many options available. This guide walks you through what to check before booking.",
    intro:
      "When it comes to clearing out unwanted rubbish, whether you're decluttering your home, renovating, or handling commercial waste, finding the right rubbish removal service in London is crucial. With so many companies offering their services, it can be overwhelming to choose the one that fits your needs. This guide will walk you through the key factors to consider when selecting a reliable rubbish removal service. From checking a company's credentials to understanding their pricing structure, we've got you covered.",
    sectionOneTitle: "1. Look For Proper Licensing And Insurance",
    sectionOneParagraphs: [
      "Before hiring a rubbish removal company, make sure they are fully licensed and insured. In London, waste carriers are legally required to hold a valid waste carrier licence issued by the Environment Agency. This ensures they follow the correct procedures for handling, transporting, and disposing of waste responsibly.",
      "Why Is This Important? If you hire an unlicensed company, you could be held liable for any illegal dumping or improper disposal of your waste. Always ask to see their licence before booking their services. Additionally, make sure they have insurance coverage to protect against any potential damage to your property or injury during the removal process."
    ],
    sectionTwoTitle: "2. Reputation Matters",
    sectionTwoParagraphs: [
      "A company's reputation says a lot about the quality of service they offer. Check online reviews on platforms like Google, Trustpilot, or even social media pages. If previous customers are satisfied, it's a good sign that you can trust the company with your rubbish removal."
    ],
    sectionTwoChecklistTitle: "Tips For Evaluating Reputation:",
    sectionTwoChecklist: [
      "Look for companies with consistently high ratings.",
      "Read through the reviews for insights into customer service and reliability.",
      "Ask for recommendations from friends or family who have used rubbish removal services in London."
    ],
    sectionTwoImage: "/images/rocket/Post_Image2.png",
    quoteText:
      "Driving the growth of Rocket Rubbish by providing professional rubbish removal services tailored to residential and commercial needs, with a strong emphasis on recycling and responsible waste disposal.",
    quoteAuthor: "CEO & Founder",
    sectionThreeTitle: "3. Transparent Pricing",
    sectionThreeParagraphs: [
      "When it comes to rubbish removal, pricing can vary significantly depending on the amount of waste, type of materials, and location. A reputable company should offer clear, transparent pricing with no hidden fees. Some companies charge based on the volume of waste removed, while others may offer a flat rate or price per item."
    ],
    sectionThreeChecklistTitle: "Things To Watch Out For:",
    sectionThreeChecklist: [
      "Upfront quotes: Avoid companies that give vague estimates. A reputable company will provide an accurate quote after seeing the amount and type of waste.",
      "Additional charges: Make sure you understand any extra charges for things like heavy items, hazardous materials, or travel costs.",
      "Payment options: Choose a company that offers a range of payment methods, from online payments to card payments on the day of the service."
    ],
    tags: ["Waste Collection", "Junk Removal", "Office Clearance", "Rubbish Removal"],
    createdAt: "2026-04-20T00:00:00.000Z",
    updatedAt: "2026-04-20T00:00:00.000Z"
  },
  {
    id: "blog-post-2",
    title: "Rubbish Clearance vs Skip Hire - Which One Should You Choose?",
    slug: "rubbish-clearance-vs-skip-hire-which-one-should-you-choose",
    category: "London Local Services",
    author: "Admin - Rocket Rubbish",
    date: "20 April 2026",
    status: "Published",
    heroImage: "/images/rocket/Rectangle231.png",
    featuredImage: "/images/rocket/Post_Image2.png",
    cardImage: "/images/rocket/Post_Image2.png",
    excerpt:
      "Learn practical ways to manage weekly waste collection more effectively while reducing unnecessary clutter and avoiding overpaying for disposal.",
    intro:
      "Skip hire and man-and-van rubbish clearance both solve waste problems, but they work very differently. Choosing the right option depends on your load size, access, time frame, and whether you want labour included.",
    sectionOneTitle: "1. What Makes Them Different?",
    sectionOneParagraphs: [
      "Skip hire gives you a container on site for a set period, while rubbish clearance includes labour, loading, transport, and disposal in one visit.",
      "For many homes and offices, the convenience of a team doing the heavy lifting makes rubbish clearance faster and less disruptive."
    ],
    sectionTwoTitle: "2. When Rubbish Clearance Wins",
    sectionTwoParagraphs: [
      "Rubbish clearance is usually the better fit when you need a same-day service, do not want a skip permit, or have bulky items that need carrying out from inside the property."
    ],
    sectionTwoChecklistTitle: "Best For:",
    sectionTwoChecklist: [
      "Fast turnarounds",
      "Labour included collections",
      "Bulky furniture and awkward waste"
    ],
    sectionTwoImage: "/images/rocket/Post_Image2.png",
    quoteText: "",
    quoteAuthor: "",
    sectionThreeTitle: "3. Compare The Full Cost",
    sectionThreeParagraphs: [
      "Always compare the full cost including permits, loading time, access restrictions, and disposal. What looks cheaper at first can become more expensive once everything is added up."
    ],
    sectionThreeChecklistTitle: "",
    sectionThreeChecklist: [],
    tags: ["Waste Collection", "Rubbish Removal"],
    createdAt: "2026-04-20T00:00:00.000Z",
    updatedAt: "2026-04-20T00:00:00.000Z"
  },
  {
    id: "blog-post-3",
    title: "Eco-Friendly Waste Disposal: How We Recycle in London",
    slug: "eco-friendly-waste-disposal-how-we-recycle-in-london",
    category: "Office & Commercial Waste",
    author: "Admin - Rocket Rubbish",
    date: "20 April 2026",
    status: "Published",
    heroImage: "/images/rocket/Rectangle231.png",
    featuredImage: "/images/rocket/Post_Image3.png",
    cardImage: "/images/rocket/Post_Image3.png",
    excerpt:
      "Learn practical ways to manage weekly waste collection more effectively while reducing unnecessary clutter at home with better recycling habits.",
    intro: "Responsible disposal is at the core of how we operate. We sort collected waste and push as much material as possible away from landfill into recycling and recovery streams.",
    sectionOneTitle: "1. Sorting Starts Early",
    sectionOneParagraphs: [
      "Our teams identify materials during collection so reusable and recyclable streams can be separated more efficiently once they arrive at licensed facilities."
    ],
    sectionTwoTitle: "2. Why Recycling Rates Matter",
    sectionTwoParagraphs: [
      "Higher recycling rates reduce landfill use, lower environmental harm, and help customers choose a cleaner way to clear waste."
    ],
    sectionTwoChecklistTitle: "",
    sectionTwoChecklist: [],
    sectionTwoImage: "",
    quoteText: "",
    quoteAuthor: "",
    sectionThreeTitle: "3. Use A Licensed Team",
    sectionThreeParagraphs: [
      "Using a licensed carrier ensures your waste goes through the right channels and is not fly-tipped or handled irresponsibly."
    ],
    sectionThreeChecklistTitle: "",
    sectionThreeChecklist: [],
    tags: ["Waste Collection", "Junk Removal"],
    createdAt: "2026-04-20T00:00:00.000Z",
    updatedAt: "2026-04-20T00:00:00.000Z"
  },
  {
    id: "blog-post-4",
    title: "A Simple Guide to Junk Removal for Homes & Offices",
    slug: "a-simple-guide-to-junk-removal-for-homes-offices",
    category: "Home Clearance",
    author: "Admin - Rocket Rubbish",
    date: "20 April 2026",
    status: "Published",
    heroImage: "/images/rocket/Rectangle231.png",
    featuredImage: "/images/rocket/Post_Image4.png",
    cardImage: "/images/rocket/Post_Image4.png",
    excerpt:
      "This guide shares simple strategies for clearing clutter safely and choosing the right collection option for bigger or more awkward loads.",
    intro: "Whether you are clearing an office, spare room, loft, or garage, the right approach makes the job quicker and far less stressful.",
    sectionOneTitle: "1. Start With Categories",
    sectionOneParagraphs: [
      "Split everything into what stays, what goes, and what might be donated or recycled. Clear decisions keep the process moving."
    ],
    sectionTwoTitle: "2. Think About Access",
    sectionTwoParagraphs: [
      "Access affects labour, timing, and cost. Stairs, narrow hallways, and parking restrictions should be considered before collection day."
    ],
    sectionTwoChecklistTitle: "",
    sectionTwoChecklist: [],
    sectionTwoImage: "",
    quoteText: "",
    quoteAuthor: "",
    sectionThreeTitle: "3. Book The Right Load Size",
    sectionThreeParagraphs: [
      "Choosing the correct load size keeps pricing transparent and avoids underestimating how much space your junk will take."
    ],
    sectionThreeChecklistTitle: "",
    sectionThreeChecklist: [],
    tags: ["Office Clearance", "Rubbish Removal"],
    createdAt: "2026-04-20T00:00:00.000Z",
    updatedAt: "2026-04-20T00:00:00.000Z"
  },
  {
    id: "blog-post-5",
    title: "Waste Collection Tips: Reduce, Reuse, Declutter Smartly",
    slug: "waste-collection-tips-reduce-reuse-declutter-smartly",
    category: "Garden Waste Removal",
    author: "Admin - Rocket Rubbish",
    date: "20 April 2026",
    status: "Published",
    heroImage: "/images/rocket/Rectangle231.png",
    featuredImage: "/images/rocket/Post_Image5.png",
    cardImage: "/images/rocket/Post_Image5.png",
    excerpt:
      "Small routines can make weekly waste management easier. Here are practical ways to stay organised and keep disposal costs under control.",
    intro: "Decluttering is easier when it becomes part of a routine rather than a one-off panic job. A few simple habits can make a big difference.",
    sectionOneTitle: "1. Create Sorting Zones",
    sectionOneParagraphs: [
      "Keep reusable, recyclable, and disposal items separate so you can move faster when it is time to book a collection."
    ],
    sectionTwoTitle: "2. Declutter Little And Often",
    sectionTwoParagraphs: [
      "Regular small clear-outs are easier to manage than large overwhelming jobs that build up over months."
    ],
    sectionTwoChecklistTitle: "",
    sectionTwoChecklist: [],
    sectionTwoImage: "",
    quoteText: "",
    quoteAuthor: "",
    sectionThreeTitle: "3. Use The Right Collection Service",
    sectionThreeParagraphs: [
      "If you have bulky or mixed waste, choose a service that includes labour and responsible disposal rather than trying to manage everything yourself."
    ],
    sectionThreeChecklistTitle: "",
    sectionThreeChecklist: [],
    tags: ["Waste Collection", "Office Clearance"],
    createdAt: "2026-04-20T00:00:00.000Z",
    updatedAt: "2026-04-20T00:00:00.000Z"
  },
  {
    id: "blog-post-6",
    title: "How Much Does Rubbish Removal Cost?",
    slug: "how-much-does-rubbish-removal-cost",
    category: "How-To Guides",
    author: "Admin - Rocket Rubbish",
    date: "20 April 2026",
    status: "Published",
    heroImage: "/images/rocket/Rectangle231.png",
    featuredImage: "/images/rocket/Post_Image6.png",
    cardImage: "/images/rocket/Post_Image6.png",
    excerpt:
      "Understand the cost of rubbish removal so you can plan your clean-up more efficiently and avoid surprise fees on collection day.",
    intro: "Rubbish removal pricing depends on more than just the number of items. Understanding what affects cost helps you book with confidence.",
    sectionOneTitle: "1. Volume Matters Most",
    sectionOneParagraphs: [
      "The amount of space your waste takes in the van is usually the biggest factor in the final quote."
    ],
    sectionTwoTitle: "2. Access And Labour Affect Price",
    sectionTwoParagraphs: [
      "Stairs, distance from the vehicle, and extra-heavy items can all influence the time and labour needed for a safe collection."
    ],
    sectionTwoChecklistTitle: "",
    sectionTwoChecklist: [],
    sectionTwoImage: "",
    quoteText: "",
    quoteAuthor: "",
    sectionThreeTitle: "3. Ask For Transparent Quotes",
    sectionThreeParagraphs: [
      "A reputable company explains what is included, confirms the load size, and avoids hidden extras."
    ],
    sectionThreeChecklistTitle: "",
    sectionThreeChecklist: [],
    tags: ["Rubbish Removal", "Waste Collection"],
    createdAt: "2026-04-20T00:00:00.000Z",
    updatedAt: "2026-04-20T00:00:00.000Z"
  }
];

const defaultContactInquiries = [];

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
  cityPages: defaultCityPages,
  blogPosts: defaultBlogPosts,
  contactInquiries: defaultContactInquiries
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
    cityPages: Array.isArray(content.cityPages) ? content.cityPages : defaultCityPages,
    blogPosts: Array.isArray(content.blogPosts) ? content.blogPosts : defaultBlogPosts,
    contactInquiries: Array.isArray(content.contactInquiries) ? content.contactInquiries : defaultContactInquiries
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



