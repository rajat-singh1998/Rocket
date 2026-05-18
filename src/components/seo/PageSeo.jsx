import { useEffect } from "react";

const SITE_NAME = "Rocket Rubbish Removal";
const SITE_URL = "https://www.rocketrubbishremoval.co.uk";
const DEFAULT_IMAGE = "/images/rocket/logo_h.svg";

function ensureMeta(attributeName, attributeValue) {
  let tag = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }
  return tag;
}

function ensureLink(rel) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  return tag;
}

function ensureJsonLd(id) {
  let tag = document.getElementById(id);
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = id;
    document.head.appendChild(tag);
  }
  return tag;
}

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
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const absoluteUrl = buildAbsoluteUrl(path);
    const absoluteImage = buildAbsoluteUrl(image);

    document.title = fullTitle;
    ensureMeta("name", "description").setAttribute("content", description);
    ensureMeta("name", "robots").setAttribute("content", robots);
    ensureMeta("property", "og:site_name").setAttribute("content", SITE_NAME);
    ensureMeta("property", "og:title").setAttribute("content", fullTitle);
    ensureMeta("property", "og:description").setAttribute("content", description);
    ensureMeta("property", "og:type").setAttribute("content", type);
    ensureMeta("property", "og:url").setAttribute("content", absoluteUrl);
    ensureMeta("property", "og:image").setAttribute("content", absoluteImage);
    ensureMeta("name", "twitter:card").setAttribute("content", "summary_large_image");
    ensureMeta("name", "twitter:title").setAttribute("content", fullTitle);
    ensureMeta("name", "twitter:description").setAttribute("content", description);
    ensureMeta("name", "twitter:image").setAttribute("content", absoluteImage);
    ensureLink("canonical").setAttribute("href", absoluteUrl);

    if (schema.length > 0) {
      ensureJsonLd("page-seo-schema").textContent = JSON.stringify(schema.length === 1 ? schema[0] : schema);
    }
  }, [description, image, path, robots, schema, title, type]);

  return null;
}
