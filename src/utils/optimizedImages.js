const optimizedImages = {
  "/images/rocket/home-page-banner.jpg": {
    desktop: "/images/rocket/home-page-banner-fast.jpg",
    mobile: "/images/rocket/home-page-banner-mobile.jpg"
  },
  "/images/rocket/generic-uk-residential-banner.jpg": {
    desktop: "/images/rocket/generic-uk-residential-banner-fast.jpg",
    mobile: "/images/rocket/generic-uk-residential-banner-mobile.jpg"
  },
  "/images/rocket/About_page_banner.jpg": {
    desktop: "/images/rocket/About_page_banner-fast.jpg",
    mobile: "/images/rocket/About_page_banner-fast.jpg"
  },
  "/images/rocket/contact_page.jpg": {
    desktop: "/images/rocket/contact_page-fast.jpg",
    mobile: "/images/rocket/contact_page-fast.jpg"
  },
  "/images/rocket/Rectangle231.jpg": {
    desktop: "/images/rocket/Rectangle231-fast.jpg",
    mobile: "/images/rocket/Rectangle231-fast.jpg"
  }
};

export function getOptimizedImageUrl(src, variant = "desktop") {
  const image = optimizedImages[src];

  if (!image) {
    return src;
  }

  return image[variant] || image.desktop || src;
}
