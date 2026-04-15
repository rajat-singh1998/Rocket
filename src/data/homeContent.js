export const bookingLinks = {
  bookNow: "https://client-platform.example.com/book",
  quote: "https://client-platform.example.com/quote",
  phone: "tel:08001234567",
  creditAccount: "/credit-account",
  whatsapp: "https://wa.me/4408001234567"
};

export const headerLinks = [
  { label: "Our Services", href: "#services" },
  { label: "Cities", href: "#coverage" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" }
];

export const heroStats = [
  { value: "1,100+", label: "UK Locations" },
  { value: "99%", label: "Recycling Rate" },
  { value: "4.9", label: "Trustpilot", star: true },
  { value: "50K+", label: "Happy Customers" }
];

export const tickerItems = [
  { label: "Environment Agency Licensed", icon: "leaf" },
  { label: "98% Recycling Rate", icon: "recycle" },
  { label: "1,100+ UK Locations", icon: "map" },
  { label: "Same-Day Available", icon: "calendar" },
  { label: "Fixed Upfront Prices", icon: "price" }
];

export const clearingOptions = [
  {
    title: "Pile Of Junk",
    description: "Bulk waste or mixed items",
    image: "/images/rocket/service_1.png",
    alt: "Pile of junk"
  },
  {
    title: "Single Items",
    description: "Furniture, appliances, or single items",
    image: "/images/rocket/form2.png",
    alt: "Single item sofa"
  }
];

export const loadOptions = [
  { title: "Small Load", size: "small", image: "/images/rocket/small_truck.png" },
  { title: "Medium Load", size: "medium", image: "/images/rocket/medium_truck.png" },
  { title: "Large Load", size: "large", image: "/images/rocket/Big_truck.png" }
];

export const serviceCards = [
  {
    title: "Rubbish Clearance",
    description: "Clear All Types Of Household, Garden, Or General Waste Quickly And Without Hassle.",
    image: "/images/rocket/service_1.png",
    alt: "Rubbish clearance"
  },
  {
    title: "Appliance Removal",
    description: "Dispose Of Old Appliances Safely With Responsible Recycling Included.",
    image: "/images/rocket/service_2.png",
    alt: "Appliance removal",
    featured: true
  },
  {
    title: "Office Clearance",
    description: "Efficient Clearance Of Office Waste And Furniture With Minimal Disruption.",
    image: "/images/rocket/service_3.png",
    alt: "Office clearance"
  },
  {
    title: "Sofa Removal",
    description: "Quick Removal Of Sofas And Bulky Items With No Heavy Lifting Required.",
    image: "/images/rocket/service_4.png",
    alt: "Sofa removal"
  }
];

export const featureCards = [
  {
    title: "Fastest Turnaround Nationwide",
    description:
      "Book before noon and we can be with you the same day anywhere in the UK. No weeks of waiting like council collections.",
    icon: "truck"
  },
  {
    title: "Fixed Prices - No Surprises",
    description:
      "The price you're quoted is what you pay. We never add extras on arrival. Collection, loading, and disposal are all included. T&C apply.",
    icon: "pound"
  },
  {
    title: "Licensed, Vetted & Fully Insured",
    description:
      "Every team is Environment Agency licensed, DBS checked, and fully insured. Your property and your peace of mind are safe.",
    icon: "shield"
  },
  {
    title: "Live Van Tracking On The Day",
    description:
      "Know exactly where your team is. No all-day waiting. Get on with your day and we'll ping you when we're 30 minutes away.",
    icon: "signal"
  },
  {
    title: "We Do Every Bit Of Heavy Lifting",
    description:
      "Loft, basement, and inside collections can be handled too. Internal collections are available, but additional charges may apply.",
    icon: "home"
  }
];

// Use iconImage with a file from /public/images/rocket when you want custom SVGs for these cards.
export const processSteps = [
  {
    number: "01",
    iconImage: "/images/rocket/hugeicons_note-edit.svg",
    title: "Tell Us What You've Got",
    description:
      "Choose From Same-Day Or Advance Slots, 7 Days A Week. Our Man & Van Team Will Be There In Your Chosen Window And You'll Get Real-Time Tracking So You're Never Waiting Around."
  },
  {
    number: "02",
    iconImage: "/images/rocket/solar_calendar-broken.svg",
    title: "Pick Your Time Slot",
    description:
      "Choose Same-Day Or Book Ahead - We're Available 7 Days A Week Across The Whole Of The UK. Real-Time Tracking Keeps You Informed, Not Waiting."
  },
  {
    number: "03",
    iconImage: "/images/rocket/cil_truck.svg",
    title: "We Collect, You Relax",
    description:
      "Our Two-Person Man & Van Team Arrives, Does All The Heavy Lifting, And Loads The Van. You Get A Waste Transfer Note And Photos Straight To Your Inbox."
  },
  {
    number: "04",
    iconImage: "/images/rocket/tabler_recycle.svg",
    title: "We Recycle Responsibly",
    description:
      "Every Load Is Sorted At Licensed Facilities. We Recycle 98% Of Everything Collected - Zero Fly-Tipping, Zero Landfill Guilt. Just A Cleaner Home."
  }
];

export const coverageStats = [
  {
    value: "6",
    label: "Days A Week",
    description: "Operating six days a week to fit your schedule."
  },
  {
    value: "98%",
    label: "Recycled",
    description: "Diverted from landfill to protect the planet."
  },
  {
    value: "4hr",
    label: "Avg. Arrival Time",
    description: "Rapid response across our entire national network."
  }
];

export const popularLocations = [
  "London",
  "Birmingham",
  "Manchester",
  "Leeds",
  "Glasgow",
  "Liverpool",
  "Edinburgh",
  "Bristol",
  "Cardiff",
  "Sheffield"
];

export const pricingPlans = [
  {
    title: "Mini Load",
    price: "\u00A379.99",
    note: "Up to 1/4 van load",
    description:
      "Perfect for a few items, a mattress, or a handful of black bags. Quick, easy, and affordable.",
    features: ["2-person team", "Collection from any floor", "Same-day available", "Waste Transfer Note"]
  },
  {
    title: "Medium Load",
    price: "\u00A3149.99",
    note: "Up to 1/2 van load",
    description:
      "A room's worth of furniture, a garage clear-out, or a larger mixed load of household rubbish.",
    features: ["2-person team", "Collection from any room", "Same-day available", "Waste Transfer Note", "Before & after photos"],
    featured: true
  },
  {
    title: "Full Load",
    price: "\u00A3249.99",
    note: "Full van load",
    description:
      "Whole house or flat clearance, larger renovation waste, or a complete office strip-out.",
    features: ["2-person team", "Full property clearance", "Multi-van available", "Waste Transfer Note", "Before & after photos"]
  }
];

export const testimonials = [
  {
    quote:
      "Booked at 9am, they were at my door by 2pm the same day. Incredible turnaround. Two lovely chaps cleared my entire garden of waste in 45 minutes flat. Will definitely use again.",
    author: "James T.",
    time: "2 Days Ago"
  },
  {
    quote:
      "The fixed price meant no surprises, and I didn't have to lift a finger. They took everything from the back garden. Highly recommend Rocket Rubbish.",
    author: "Sarah M.",
    time: "1 Week Ago"
  },
  {
    quote:
      "Used them for an office clearance. Very professional, provided all the digital waste transfer notes immediately. Will definitely use again.",
    author: "David L.",
    time: "2 Weeks Ago"
  }
];

export const faqs = [
  {
    question: "How Does Your Pricing Work?",
    answer:
      "Our pricing is fixed and transparent. We charge based on the volume and weight of the rubbish we collect. The quote we provide upfront is the final price you pay. There are no hidden fees, parking charges, or surprise add-ons on the day."
  },
  {
    question: "What Types Of Waste Do You NOT Take?",
    answer:
      "Hazardous waste, certain chemicals, asbestos, gas bottles, and other restricted items require specialist handling and are not included in standard collections."
  },
  {
    question: "What Areas Do You Cover?",
    answer:
      "We cover towns and cities across England, Scotland, and Wales through our national collection network."
  },
  {
    question: "How Do I Get An Accurate Quote?",
    answer:
      "Use the quote form, upload clear photos, or message the team on WhatsApp so the load can be priced as accurately as possible."
  },
  {
    question: "Do I Need To Leave My Rubbish Outside?",
    answer:
      "No. Our teams can collect from inside the property as long as access is safe and agreed in advance."
  },
  {
    question: "Do I Need To Be At Home For The Collection?",
    answer:
      "Not always. If access is arranged and the waste is clearly identified, some bookings can be completed without you being present."
  },
  {
    question: "Are You Fully Licensed And Insured?",
    answer:
      "Yes. Every team is Environment Agency licensed and fully insured for collection, loading, transport, and disposal."
  },
  {
    question: "Do You Handle Commercial And Office Clearances?",
    answer:
      "Yes. We handle office, retail, and commercial clearances as well as household rubbish and bulky waste collections."
  },
  {
    question: "How Quickly Can You Collect My Rubbish?",
    answer:
      "Same-day and next-day slots are often available, depending on your location and the team schedule."
  },
  {
    question: "What Happens To My Rubbish After You Take It?",
    answer:
      "Collected waste is sorted for reuse, recycling, and responsible disposal at licensed facilities whenever possible."
  }
];

export const footerLinks = {
  services: [
    "Household Clearance",
    "Office & Commercial",
    "Garden Waste",
    "Bulky Items",
    "Full House Clearance"
  ],
  company: ["About Us", "How It Works", "Reviews", "FAQ"],
  contact: ["0800 123 4567", "hello@rocketrubbish.co.uk", "London, UK"]
};

export const adminMenu = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Content", to: "/admin/content" },
  { label: "Blogs", to: "/admin/blogs" },
  { label: "Contacts", to: "/admin/contacts" },
  { label: "Users", to: "/admin/users" },
  { label: "Orders", to: "/admin/orders" }
];

export const dashboardStats = [
  { label: "Total Orders", value: "1,248", change: "+12%" },
  { label: "Total Users", value: "8,430", change: "+5%" },
  { label: "Revenue", value: "�45,200", change: "+18%" },
  { label: "Pending Requests", value: "24", change: "-2%", down: true }
];

export const revenueBars = [28, 36, 34, 49, 44, 58, 61, 63, 76, 72, 86, 95];

export const recentOrders = [
  { id: "ORD-1028", customer: "Sarah Jenkins", service: "House Clearance", amount: "�150", status: "Completed" },
  { id: "ORD-1027", customer: "Mike Peters", service: "Rubbish Clearance", amount: "�85", status: "Pending" },
  { id: "ORD-1026", customer: "Emma Wilson", service: "Sofa Removal", amount: "�50", status: "In Progress" },
  { id: "ORD-1025", customer: "Liam Brown", service: "Office Clearance", amount: "�240", status: "Completed" }
];

export const adminOrders = [
  { id: "ORD-1024", customer: "Sarah Jenkins", service: "House Clearance", price: "�150", date: "11 Apr 2026", status: "Completed" },
  { id: "ORD-1025", customer: "Mike Peters", service: "Rubbish Clearance", price: "�85", date: "11 Apr 2026", status: "Pending" },
  { id: "ORD-1026", customer: "Emma Wilson", service: "Sofa Removal", price: "�50", date: "10 Apr 2026", status: "In Progress" },
  { id: "ORD-1027", customer: "Liam Brown", service: "Office Clearance", price: "�240", date: "10 Apr 2026", status: "Completed" },
  { id: "ORD-1028", customer: "Olivia Green", service: "Appliance Removal", price: "�90", date: "09 Apr 2026", status: "Pending" },
  { id: "ORD-1029", customer: "Noah Clarke", service: "Furniture Removal", price: "�135", date: "09 Apr 2026", status: "In Progress" }
];

export const adminUsers = [
  { name: "Admin User", email: "admin@rocket.com", role: "Admin", status: "Active" },
  { name: "John Smith", email: "john@rocket.com", role: "Staff", status: "Active" },
  { name: "Emma Davis", email: "emma@rocket.com", role: "Staff", status: "Inactive" },
  { name: "Michael Brown", email: "michael@rocket.com", role: "Driver", status: "Active" },
  { name: "Sophie Turner", email: "sophie@rocket.com", role: "Coordinator", status: "Active" }
];















