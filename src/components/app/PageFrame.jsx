import { useEffect, useLayoutEffect } from "react";
import RouteAnimations from "../animations/RouteAnimations";
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

export default function PageFrame({ children }) {
  return (
    <>
      <ScrollManager />
      <RouteAnimations />
      {children}
    </>
  );
}
