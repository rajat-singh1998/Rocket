import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <title>Rocket Rubbish Removal</title>
        <meta
          name="description"
          content="Rocket Rubbish Removal provides rubbish clearance, waste collection, junk removal, waste disposal, and skip hire support across the UK."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://rocketrubbishremoval.com/" />
        <meta property="og:site_name" content="Rocket Rubbish Removal" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rocket Rubbish Removal" />
        <meta
          property="og:description"
          content="Rocket Rubbish Removal provides rubbish clearance, waste collection, junk removal, waste disposal, and skip hire support across the UK."
        />
        <meta property="og:url" content="https://rocketrubbishremoval.com/" />
        <meta property="og:image" content="https://rocketrubbishremoval.com/images/rocket/logo_h.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
