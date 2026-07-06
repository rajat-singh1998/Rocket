import Head from "next/head";
import { useMemo } from "react";

const SITE_NAME = "Rocket Rubbish Removal";
const SITE_URL = "https://rocketrubbishremoval.com";
const DEFAULT_IMAGE = "/images/rocket/logo_h.svg";

function buildAbsoluteUrl(path = "/") {
  if (!path) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path)
    }))
  };
}

export function buildFaqSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildWebPageSchema({
  title,
  description,
  path,
  type = "WebPage"
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: buildAbsoluteUrl(path),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: buildAbsoluteUrl("/images/rocket/logo_h.svg")
    }
  };
}

export function buildServiceSchema({
  title,
  description,
  path,
  areaServed = "United Kingdom",
  image,
  keywords = []
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    areaServed,
    image: buildAbsoluteUrl(image || DEFAULT_IMAGE),
    serviceType: keywords,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL
    },
    url: buildAbsoluteUrl(path)
  };
}

export default function PageSeo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index,follow",
  schema = []
}) {
  const fullTitle = String(title || SITE_NAME).trim();
  const metaDescription = String(description || "").trim();
  const absoluteUrl = buildAbsoluteUrl(path);
  const absoluteImage = buildAbsoluteUrl(image);
  const schemaPayload = useMemo(() => {
    if (!schema.length) {
      return "";
    }

    return JSON.stringify(schema.length === 1 ? schema[0] : schema);
  }, [schema]);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta key="description" name="description" content={metaDescription} />
      <meta key="robots" name="robots" content={robots} />
      <link key="canonical" rel="canonical" href={absoluteUrl} />
      <meta key="og-site-name" property="og:site_name" content={SITE_NAME} />
      <meta key="og-type" property="og:type" content={type} />
      <meta key="og-title" property="og:title" content={fullTitle} />
      <meta key="og-description" property="og:description" content={metaDescription} />
      <meta key="og-url" property="og:url" content={absoluteUrl} />
      <meta key="og-image" property="og:image" content={absoluteImage} />
      <meta key="twitter-card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter-title" name="twitter:title" content={fullTitle} />
      <meta key="twitter-description" name="twitter:description" content={metaDescription} />
      <meta key="twitter-image" name="twitter:image" content={absoluteImage} />
      {schemaPayload ? (
        <script
          id="page-seo-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaPayload }}
        />
      ) : null}
    </Head>
  );
}
