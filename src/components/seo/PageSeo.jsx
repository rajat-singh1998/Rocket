import Head from "next/head";

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

export default function PageSeo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index,follow"
}) {
  const fullTitle = String(title || SITE_NAME).trim();
  const metaDescription = String(description || "").trim();
  const absoluteUrl = buildAbsoluteUrl(path);
  const absoluteImage = buildAbsoluteUrl(image);

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
    </Head>
  );
}
