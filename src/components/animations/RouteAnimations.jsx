import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const revealSelectors = [
  "main > section",
  ".admin-layout__page-head",
  ".admin-layout__body > *"
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
  ".city-page__compare-card",
  ".admin-dashboard__panel",
  ".admin-content__card",
  ".admin-profile__card",
  ".admin-contacts__card",
  ".admin-blogs__card",
  ".admin-placeholder__card"
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

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      return undefined;
    }

    let context;
    let refreshTimer;
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

        elements.forEach((element, index) => {
          const isAboveFold = element.getBoundingClientRect().top < window.innerHeight * 0.82;

          gsap.fromTo(
            element,
            {
              autoAlpha: 0,
              y: isAboveFold ? 18 : 28
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: isAboveFold ? 0.58 : 0.72,
              delay: isAboveFold ? Math.min(index * 0.05, 0.18) : 0,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: isAboveFold
                ? undefined
                : {
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

    animateRoute();

    return () => {
      cancelled = true;
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
