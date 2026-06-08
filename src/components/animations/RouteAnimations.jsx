import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const revealSelectors = [
  "main > section"
];

const cardSelectors = [
  ".clearance-services__card",
  ".home-service-card",
  ".home-feature-card",
  ".home-pricing-card",
  ".home-coverage__card",
  ".home-step-card",
  ".home-faq__item",
  ".home-upload-banner",
  ".services-page__step-card",
  ".contact-page__card",
  ".blog-page__card",
  ".blog-post-page__panel",
  ".faq-page__item",
  ".how-page__step-card",
  ".city-page__highlight-item",
  ".city-page__bullet-item",
  ".city-page__compare-card"
];

function getRevealElements(gsap) {
  const elements = revealSelectors.flatMap((selector) => gsap.utils.toArray(selector));
  return elements.filter((element, index) => elements.indexOf(element) === index);
}

function getCardElements(gsap) {
  const elements = cardSelectors.flatMap((selector) => gsap.utils.toArray(selector));
  return elements.filter((element, index) => elements.indexOf(element) === index);
}

export default function RouteAnimations() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (reduceMotion || isMobile || pathname.startsWith("/admin")) {
      return undefined;
    }

    let context;
    let refreshTimer;
    let startTimer;
    let idleHandle;
    let cancelled = false;
    const hoverCleanup = [];

    async function animateRoute() {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);
      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;

      if (cancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const cards = getCardElements(gsap);
        const elements = getRevealElements(gsap).filter((element) => {
          return !cards.some((card) => element !== card && element.contains(card));
        });

        elements
          .filter((element) => element.getBoundingClientRect().top >= window.innerHeight * 0.75)
          .forEach((element, index) => {

          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              y: 28
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              delay: Math.min(index * 0.04, 0.16),
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                once: true
              }
            }
          );
        });

        gsap.set(cards, {
          autoAlpha: 0,
          y: 28,
          scale: 0.985
        });

        ScrollTrigger.batch(cards, {
          start: "top 86%",
          once: true,
          interval: 0.08,
          batchMax: 6,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.68,
              ease: "power3.out",
              stagger: 0.1,
              clearProps: "transform,opacity,visibility"
            });
          }
        });

        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          cards.forEach((card) => {
            const liftCard = () => {
              gsap.to(card, {
                y: -7,
                scale: 1.012,
                duration: 0.28,
                ease: "power2.out",
                overwrite: "auto"
              });
            };
            const settleCard = () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.32,
                ease: "power2.out",
                clearProps: "transform",
                overwrite: "auto"
              });
            };

            card.addEventListener("mouseenter", liftCard);
            card.addEventListener("mouseleave", settleCard);
            card.addEventListener("focusin", liftCard);
            card.addEventListener("focusout", settleCard);

            hoverCleanup.push(() => {
              card.removeEventListener("mouseenter", liftCard);
              card.removeEventListener("mouseleave", settleCard);
              card.removeEventListener("focusin", liftCard);
              card.removeEventListener("focusout", settleCard);
            });
          });
        }

      });

      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 450);
    }

    if ("requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(animateRoute, { timeout: 1400 });
    } else {
      startTimer = window.setTimeout(animateRoute, 900);
    }

    return () => {
      cancelled = true;
      if (idleHandle) {
        window.cancelIdleCallback(idleHandle);
      }
      if (startTimer) {
        window.clearTimeout(startTimer);
      }
      if (refreshTimer) {
        window.clearTimeout(refreshTimer);
      }
      hoverCleanup.forEach((cleanup) => cleanup());
      if (context) {
        context.revert();
      }
    };
  }, [pathname]);

  return null;
}
