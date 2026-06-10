import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import RouteAnimations from "./components/animations/RouteAnimations";
import PageSeo, {
  buildServiceSchema,
  buildWebPageSchema
} from "./components/seo/PageSeo";
import { buildApiUrl } from "./lib/api";
import { hasAdminPermission, isAdminAuthenticated } from "./utils/adminAuth";

const CreditAccountPage = lazy(() => import("./pages/public/CreditAccountPage"));
const ContactPage = lazy(() => import("./pages/public/ContactPage"));
const FaqPage = lazy(() => import("./pages/public/FaqPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/public/PrivacyPolicyPage"));
const TermsConditionsPage = lazy(() => import("./pages/public/TermsConditionsPage"));
const HomePage = lazy(() => import("./pages/public/HomePage"));
const ServicesPage = lazy(() => import("./pages/public/ServicesPage"));
const BlogPage = lazy(() => import("./pages/public/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/public/BlogPostPage"));
const HowItWorksPage = lazy(() => import("./pages/public/HowItWorksPage"));
const AboutPage = lazy(() => import("./pages/public/AboutPage"));
const CityPage = lazy(() => import("./pages/public/CityPage"));
const LocationsPage = lazy(() => import("./pages/public/LocationsPage"));
const CustomPage = lazy(() => import("./pages/public/CustomPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminBlogsPage = lazy(() => import("./pages/admin/AdminBlogsPage"));
const AdminBlogEditorPage = lazy(() => import("./pages/admin/AdminBlogEditorPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminProfilePage = lazy(() => import("./pages/admin/AdminProfilePage"));
const AdminCityPagesPage = lazy(() => import("./pages/admin/AdminCityPagesPage"));
const AdminContactsPage = lazy(() => import("./pages/admin/AdminContactsPage"));
const AdminSeoSettingsPage = lazy(() => import("./pages/admin/AdminSeoSettingsPage"));

function ProtectedAdminRoute({ children, permission }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (permission && !hasAdminPermission(permission)) {
    return <Navigate to="/admin/profile" replace />;
  }

  return children;
}

function forceScrollToTop() {
  const root = document.documentElement;
  const body = document.body;
  const scrollingElement = document.scrollingElement || root;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  scrollingElement.scrollTop = 0;
  root.scrollTop = 0;
  body.scrollTop = 0;
  root.style.scrollBehavior = previousScrollBehavior;
}

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const frames = [];
    forceScrollToTop();
    frames.push(window.requestAnimationFrame(() => {
      forceScrollToTop();
      frames.push(window.requestAnimationFrame(forceScrollToTop));
    }));
    const timers = [
      window.setTimeout(forceScrollToTop, 40),
      window.setTimeout(forceScrollToTop, 160),
      window.setTimeout(forceScrollToTop, 420),
      window.setTimeout(forceScrollToTop, 800)
    ];

    return () => {
      frames.forEach((frame) => window.cancelAnimationFrame(frame));
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [location.key, location.pathname, location.search]);

  return null;
}

function SeoManager() {
  const { pathname } = useLocation();
  const [managedSeoPages, setManagedSeoPages] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadManagedSeoPages() {
      try {
        const response = await fetch(buildApiUrl("/api/public/seo-pages"));
        const data = await response.json();

        if (!ignore && response.ok && data.ok) {
          setManagedSeoPages(data.pages || {});
        }
      } catch {
      }
    }

    loadManagedSeoPages();

    return () => {
      ignore = true;
    };
  }, []);

  if (pathname.startsWith("/cities/") || pathname.startsWith("/blog/") || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") {
      return <PageSeo title="Admin Login" description="Secure admin login for Rocket Rubbish Removal." path="/admin/login" robots="noindex,nofollow" />;
    }

    return null;
  }

  const seoMap = {
    "/": {
      title: "UK-Wide Rubbish Removal, Rubbish Clearance & Waste Collection",
      description: "Rocket Rubbish Removal provides UK-wide rubbish removal, rubbish clearance, waste collection, waste disposal, and junk removal with fast booking and same-day availability.",
      image: "/images/rocket/Hero_Section.jpg",
      schema: [
        buildWebPageSchema({
          title: "Rocket Rubbish Removal UK-Wide Waste Collection",
          description: "Rocket Rubbish Removal provides UK-wide rubbish removal, rubbish clearance, waste collection, waste disposal, and junk removal with fast booking and same-day availability.",
          path: "/"
        }),
        buildServiceSchema({
          title: "UK-Wide Rubbish Removal & Waste Disposal Services",
          description: "Book UK-wide rubbish removal, rubbish clearance, waste collection, waste disposal, and junk removal services from Rocket Rubbish Removal.",
          path: "/",
          areaServed: "United Kingdom",
          image: "/images/rocket/Hero_Section.jpg",
          keywords: [
            "Rubbish Removal",
            "Rubbish Clearance",
            "Waste Collection",
            "Waste Disposal",
            "Junk Removal",
            "Skip Hire Alternative"
          ]
        })
      ]
    },
    "/services": {
      title: "Rubbish Clearance Services Across The UK",
      description: "Compare rubbish removal load sizes and book UK-wide rubbish clearance, waste collection, junk removal, and responsible waste disposal services.",
      image: "/images/rocket/gb_1.png",
      schema: [
        buildWebPageSchema({
          title: "Rubbish Clearance Services Across The UK",
          description: "Compare rubbish removal load sizes and book UK-wide rubbish clearance, waste collection, junk removal, and responsible waste disposal services.",
          path: "/services"
        }),
        buildServiceSchema({
          title: "UK Rubbish Removal, Waste Collection & Junk Removal Services",
          description: "Choose the right rubbish removal load size and book licensed rubbish clearance, waste collection, junk removal, and waste disposal across the UK.",
          path: "/services",
          areaServed: "United Kingdom",
          image: "/images/rocket/gb_1.png",
          keywords: [
            "Rubbish Removal",
            "Rubbish Clearance",
            "Waste Collection",
            "Waste Disposal",
            "Junk Removal",
            "Skip Hire Alternative"
          ]
        })
      ]
    },
    "/blog": {
      title: "Blog | Rubbish Removal Tips, Advice & Guides",
      description: "Explore Rocket Rubbish blog posts covering rubbish removal, rubbish clearance, waste collection, junk removal, waste disposal tips, and skip hire alternatives.",
      image: "/images/rocket/quote-photo.jpg",
      type: "article",
      schema: [
        buildWebPageSchema({
          title: "Rocket Rubbish Blog",
          description: "Explore Rocket Rubbish blog posts covering rubbish removal, rubbish clearance, waste collection, junk removal, waste disposal tips, and skip hire alternatives.",
          path: "/blog",
          type: "CollectionPage"
        })
      ]
    },
    "/locations": {
      title: "Rubbish Removal Locations Across The UK",
      description: "Browse Rocket Rubbish Removal locations alphabetically and open your local rubbish clearance, waste collection, junk removal, and waste disposal city page.",
      image: "/images/rocket/generic-uk-residential-banner.jpg",
      schema: [
        buildWebPageSchema({
          title: "Rocket Rubbish Removal Locations",
          description: "Browse Rocket Rubbish Removal locations alphabetically and open your local rubbish clearance, waste collection, junk removal, and waste disposal city page.",
          path: "/locations",
          type: "CollectionPage"
        })
      ]
    },
    "/how-it-works": {
      title: "How Our Rubbish Removal & Waste Collection Process Works",
      description: "See how Rocket Rubbish handles rubbish removal, rubbish clearance, waste collection, junk removal, and responsible waste disposal in four simple steps across the UK.",
      image: "/images/rocket/how_work.png",
      schema: [
        buildWebPageSchema({
          title: "How Rocket Rubbish Works",
          description: "See how Rocket Rubbish handles rubbish removal, rubbish clearance, waste collection, junk removal, and responsible waste disposal in four simple steps across the UK.",
          path: "/how-it-works"
        }),
        buildServiceSchema({
          title: "How Our UK Rubbish Removal Process Works",
          description: "Learn how our rubbish removal, waste collection, junk removal, and waste disposal service works from quote to collection and recycling.",
          path: "/how-it-works",
          areaServed: "United Kingdom",
          image: "/images/rocket/how_work.png",
          keywords: [
            "Rubbish Removal",
            "Rubbish Clearance",
            "Waste Collection",
            "Waste Disposal",
            "Junk Removal",
            "Skip Hire Alternative"
          ]
        })
      ]
    },
    "/about-us": {
      title: "About Rocket Rubbish Removal",
      description: "Learn more about Rocket Rubbish, our UK-wide rubbish removal team, our sustainability standards, and why customers choose our rubbish clearance and waste collection services.",
      image: "/images/rocket/Article_Image.jpg",
      schema: [
        buildWebPageSchema({
          title: "About Rocket Rubbish Removal",
          description: "Learn more about Rocket Rubbish, our UK-wide rubbish removal team, our sustainability standards, and why customers choose our rubbish clearance and waste collection services.",
          path: "/about-us"
        }),
        buildServiceSchema({
          title: "About Rocket Rubbish UK Waste Services",
          description: "Rocket Rubbish delivers rubbish removal, rubbish clearance, waste collection, waste disposal, and junk removal services across the UK with a strong recycling focus.",
          path: "/about-us",
          areaServed: "United Kingdom",
          image: "/images/rocket/Article_Image.jpg",
          keywords: [
            "Rubbish Removal",
            "Rubbish Clearance",
            "Waste Collection",
            "Waste Disposal",
            "Junk Removal",
            "Skip Hire Alternative"
          ]
        })
      ]
    },
    "/credit-account": {
      title: "Credit Account Application | Rocket Rubbish Removal",
      description: "Apply for a Rocket Rubbish credit account for ongoing rubbish removal, rubbish clearance, waste collection, waste disposal, and skip hire support.",
      schema: [
        buildWebPageSchema({
          title: "Credit Account Application",
          description: "Apply for a Rocket Rubbish credit account for ongoing rubbish removal, rubbish clearance, waste collection, waste disposal, and skip hire support.",
          path: "/credit-account"
        })
      ]
    },
    "/contact-us": {
      title: "Contact Rocket Rubbish Removal",
      description: "Contact Rocket Rubbish for fast rubbish removal, rubbish clearance, waste collection, junk removal, and responsible waste disposal bookings anywhere in the UK.",
      image: "/images/rocket/contact_page.jpg",
      schema: [
        buildWebPageSchema({
          title: "Contact Rocket Rubbish Removal",
          description: "Contact Rocket Rubbish for fast rubbish removal, rubbish clearance, waste collection, junk removal, and responsible waste disposal bookings anywhere in the UK.",
          path: "/contact-us"
        }),
        buildServiceSchema({
          title: "Contact Our UK Rubbish Removal Team",
          description: "Speak to Rocket Rubbish about rubbish removal, rubbish clearance, waste collection, junk removal, and waste disposal services across the UK.",
          path: "/contact-us",
          areaServed: "United Kingdom",
          image: "/images/rocket/contact_page.jpg",
          keywords: [
            "Rubbish Removal",
            "Rubbish Clearance",
            "Waste Collection",
            "Waste Disposal",
            "Junk Removal",
            "Skip Hire"
          ]
        })
      ]
    },
    "/faq": {
      title: "Frequently Asked Questions | Rocket Rubbish Removal",
      description: "Read our UK rubbish removal FAQs covering rubbish clearance, waste collection, junk removal, skip hire alternatives, pricing, coverage, and waste disposal.",
      schema: [
        buildWebPageSchema({
          title: "Frequently Asked Questions",
          description: "Read our UK rubbish removal FAQs covering rubbish clearance, waste collection, junk removal, skip hire alternatives, pricing, coverage, and waste disposal.",
          path: "/faq"
        })
      ]
    },
    "/privacy-policy": {
      title: "Privacy Policy | Rocket Rubbish Removal",
      description: "Read the Rocket Rubbish privacy policy to understand how we collect, use, protect, and process personal data for rubbish removal, waste collection, and booking services.",
      schema: [
        buildWebPageSchema({
          title: "Privacy Policy",
          description: "Read the Rocket Rubbish privacy policy to understand how we collect, use, protect, and process personal data for rubbish removal, waste collection, and booking services.",
          path: "/privacy-policy"
        })
      ]
    },
    "/terms-and-conditions": {
      title: "Terms & Conditions | Rocket Rubbish Removal",
      description: "Read the Rocket Rubbish terms and conditions covering bookings, rubbish removal services, pricing, waste collection, cancellations, liabilities, and environmental commitments.",
      schema: [
        buildWebPageSchema({
          title: "Terms & Conditions",
          description: "Read the Rocket Rubbish terms and conditions covering bookings, rubbish removal services, pricing, waste collection, cancellations, liabilities, and environmental commitments.",
          path: "/terms-and-conditions"
        })
      ]
    }
  };

  const config = seoMap[pathname];
  const managedConfig = Object.values(managedSeoPages || {}).find((item) => item.path === pathname);

  if (!config) {
    return null;
  }

  return (
    <PageSeo
      title={managedConfig?.metaTitle || config.title}
      description={managedConfig?.metaDescription || config.description}
      path={pathname}
      image={config.image}
      type={config.type}
      schema={config.schema}
    />
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <SeoManager />
      <RouteAnimations />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/cities/:slug" element={<CityPage />} />
          <Route path="/credit-account" element={<CreditAccountPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute permission="dashboard"><AdminDashboardPage /></ProtectedAdminRoute>} />
          <Route path="/admin/users" element={<ProtectedAdminRoute permission="users"><AdminUsersPage /></ProtectedAdminRoute>} />
          <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfilePage /></ProtectedAdminRoute>} />
          <Route path="/admin/seo" element={<ProtectedAdminRoute permission="seo"><AdminSeoSettingsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/city-pages" element={<ProtectedAdminRoute permission="city-pages"><AdminCityPagesPage /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs" element={<ProtectedAdminRoute permission="blogs"><AdminBlogsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs/new" element={<ProtectedAdminRoute permission="blogs"><AdminBlogEditorPage /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs/:id" element={<ProtectedAdminRoute permission="blogs"><AdminBlogEditorPage /></ProtectedAdminRoute>} />
          <Route path="/admin/contacts" element={<ProtectedAdminRoute permission="contacts"><AdminContactsPage /></ProtectedAdminRoute>} />
          <Route path="/:slug" element={<CustomPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
