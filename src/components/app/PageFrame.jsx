import { useEffect, useLayoutEffect, useState } from "react";
import RouteAnimations from "../animations/RouteAnimations";
import PageSeo from "../seo/PageSeo";
import { buildApiUrl } from "../../lib/api";
import { useLocation } from "../../lib/router";

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

function RouteSeo() {
  const location = useLocation();
  const [seo, setSeo] = useState({
    title: "Rocket Rubbish Removal",
    description: "Rocket Rubbish Removal provides rubbish clearance, waste collection, junk removal, waste disposal, and skip hire support across the UK.",
    path: "/",
    image: "/images/rocket/logo_h.svg",
    type: "website",
    robots: "index,follow"
  });

  useEffect(() => {
    let ignore = false;

    async function loadSeo() {
      try {
        const response = await fetch(buildApiUrl(`/api/public/seo?path=${encodeURIComponent(location.pathname)}`), {
          cache: "no-store"
        });
        const data = await response.json();

        if (!ignore && response.ok && data.ok && data.seo) {
          setSeo(data.seo);
        }
      } catch {
        if (!ignore) {
          setSeo((current) => ({ ...current, path: location.pathname }));
        }
      }
    }

    loadSeo();

    return () => {
      ignore = true;
    };
  }, [location.pathname]);

  return <PageSeo {...seo} />;
}

export default function PageFrame({ children }) {
  return (
    <>
      <RouteSeo />
      <ScrollManager />
      <RouteAnimations />
      {children}
    </>
  );
}
