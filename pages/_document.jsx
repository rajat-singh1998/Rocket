import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
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
