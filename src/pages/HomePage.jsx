import { useLayoutEffect, useRef } from "react";
import {
  Armchair,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  House,
  Leaf,
  Recycle,
  ShieldCheck,
  Sofa,
  Sparkles,
  Star,
  ThumbsUp,
  Trash2,
  TrendingDown,
  Truck,
  WashingMachine
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroQuoteCard from "../components/HeroQuoteCard";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  bookingLinks,
  faqs,
  heroStats,
  impactStats,
  processSteps,
  reviews,
  serviceItems,
  trustItems
} from "../data/siteContent";

const iconMap = {
  Armchair,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  House,
  Leaf,
  Recycle,
  ShieldCheck,
  Sofa,
  Sparkles,
  ThumbsUp,
  Trash2,
  TrendingDown,
  Truck,
  WashingMachine
};

const heroStripItems = [
  "100K+ Happy Customers",
  "150,000+ Tonnes Shifted",
  "15,000+ Verified Reviews",
  "Same-Day Collection Available",
  "Fully Insured & Registered",
  "Eco-Friendly Disposal"
];

const marqueeItems = [...heroStripItems, ...heroStripItems];

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out"
      });

      gsap.from(".hero-visual", {
        x: 42,
        opacity: 0,
        scale: 1.06,
        duration: 1.1,
        ease: "power3.out"
      });

      gsap.from(".hero-marquee", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.35,
        ease: "power2.out"
      });

      gsap.to(".hero-visual img", {
        y: -14,
        duration: 4.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.utils.toArray("[data-reveal='heading']").forEach((element) => {
        gsap.from(element, {
          y: 26,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            once: true
          }
        });
      });

      gsap.utils.toArray("[data-reveal='grid']").forEach((element) => {
        gsap.from(element.children, {
          y: 42,
          scale: 0.98,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            once: true
          }
        });
      });
    }, pageRef);

    const refreshScroll = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshScroll);
    requestAnimationFrame(refreshScroll);
    setTimeout(refreshScroll, 300);

    return () => {
      window.removeEventListener("load", refreshScroll);
      context.revert();
    };
  }, []);

  return (
    <>
      <SiteHeader />

      <main ref={pageRef} className="bg-white">
        <section className="overflow-hidden border-b border-[#edf1ea] bg-[#fdfdfb]">
          <div className="container-shell grid items-stretch gap-0 lg:grid-cols-[0.98fr_1.08fr]">
            <div className="flex items-center py-10 sm:py-14 lg:py-16">
              <div className="hero-copy max-w-[590px]">
                <h1 className="max-w-3xl text-[3rem] font-semibold tracking-[-0.05em] text-brand-dark sm:text-[4.4rem] lg:text-[4.9rem] lg:leading-[0.94]">
                  UK Wide Rubbish Removal
                </h1>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[1rem] font-medium text-slate-500">
                  {heroStats.map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-green" />
                      {item}
                    </span>
                  ))}
                </div>

                <p className="mt-4 max-w-2xl text-[1.08rem] leading-8 text-slate-500 sm:text-[1.15rem]">
                  Same-day waste removal from a business unit or home.
                </p>

                <div className="mt-8 max-w-[560px]">
                  <HeroQuoteCard />
                </div>
              </div>
            </div>

            <div className="hero-visual relative min-h-[360px] lg:min-h-[760px]">
              <div className="absolute inset-y-0 left-0 z-10 hidden w-24 bg-gradient-to-r from-[#fdfdfb] via-[#fdfdfb]/85 to-transparent lg:block" />
              <div className="absolute inset-0 overflow-hidden bg-[#d9edff] lg:rounded-bl-[26px]">
                <div className="noise-glow absolute inset-0" />
                <img
                  src="/hero-scene.svg"
                  alt="Rocket Rubbish van parked outside homes"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="hero-marquee bg-[#141b22] py-4 text-white">
          <div className="marquee-shell w-full">
            <div className="marquee-track">
              {[0, 1].map((group) => (
                <div key={group} className="marquee-group px-6 text-[0.98rem] font-semibold">
                  {marqueeItems.map((item, index) => (
                    <span key={`${group}-${item}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                      <span className="h-2 w-2 rounded-full bg-brand-green" />
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section-space">
          <div className="container-shell max-w-[1380px]">
            <div data-reveal="heading">
              <h2 className="section-title">Waste Clearance Services We Provide</h2>
              <p className="section-copy">Select your service and get an instant quote</p>
            </div>

            <div data-reveal="grid" className="mx-auto mt-14 grid max-w-[1320px] gap-6 md:grid-cols-2 xl:grid-cols-3">
              {serviceItems.map((item) => {
                const Icon = iconMap[item.icon];

                return (
                  <article
                    key={item.title}
                    className="overflow-hidden rounded-[18px] border border-[#dfe7da] bg-white shadow-[0_10px_28px_rgba(15,23,32,0.05)] transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div className={`service-placeholder relative h-[230px] overflow-hidden bg-gradient-to-br ${item.gradient}`}>
                      <div className="soft-grid absolute inset-0 opacity-30" />
                      <div className="absolute inset-x-7 bottom-6 rounded-[26px] border border-white/60 bg-white/80 px-5 py-4 backdrop-blur">
                        <div className="flex items-center gap-4">
                          <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-brand-green text-white shadow-[0_10px_20px_rgba(47,143,22,0.18)]">
                            <Icon className="h-7 w-7" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Service</p>
                            <p className="truncate text-xl font-semibold tracking-[-0.03em] text-brand-dark">{item.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
                      <div>
                        <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-brand-dark">{item.title}</h3>
                        <p className="mt-1 text-[0.98rem] text-slate-500">{item.price}</p>
                      </div>
                      <a
                        href={bookingLinks.bookNow}
                        className="inline-flex shrink-0 items-center rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#267810]"
                      >
                        Book Now
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-space bg-brand-soft">
          <div className="container-shell">
            <div data-reveal="heading" className="text-center">
              <span className="pill-label">Ready. Set. Clear.</span>
              <h2 className="mt-5 text-[2.2rem] font-semibold tracking-[-0.04em] text-brand-dark sm:text-[3rem]">
                How Rocket Rubbish Works in 3 Simple Steps
              </h2>
            </div>

            <div data-reveal="grid" className="mt-14 grid gap-10 lg:grid-cols-3">
              {processSteps.map((item, index) => {
                const Icon = iconMap[item.icon];

                return (
                  <article key={item.title} className="px-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#e6f2e2] text-brand-green">
                      <Icon className="h-8 w-8" />
                    </div>
                    <span className="mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-7 text-[2rem] font-semibold tracking-[-0.04em] text-brand-dark">{item.title}</h3>
                    <p className="mt-4 text-[1.02rem] leading-8 text-slate-500">{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container-shell">
            <div data-reveal="heading" className="text-center">
              <span className="pill-label">Our Impact</span>
              <h2 className="mt-5 text-[2.2rem] font-semibold tracking-[-0.04em] text-brand-dark sm:text-[3rem]">
                Committed to the Environment
              </h2>
              <p className="section-copy">
                Rocket Rubbish is dedicated to combating illegal fly-tipping and safeguarding our environment one
                collection at a time.
              </p>
            </div>

            <div data-reveal="grid" className="mx-auto mt-14 grid max-w-[1340px] gap-6 md:grid-cols-2 xl:grid-cols-4">
              {impactStats.map((item) => {
                const Icon = iconMap[item.icon];

                return (
                  <article
                    key={item.label}
                    className="rounded-[22px] border border-[#dfe7da] bg-white p-8 text-center shadow-[0_10px_25px_rgba(15,23,32,0.04)]"
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf8e8] text-brand-green">
                      <Icon className="h-8 w-8" />
                    </div>
                    <p className="mt-6 text-[3rem] font-semibold tracking-[-0.05em] text-brand-green">{item.value}</p>
                    <h3 className="mt-3 text-[1.45rem] font-semibold tracking-[-0.03em] text-brand-dark">{item.label}</h3>
                    <p className="mt-4 text-[0.98rem] leading-7 text-slate-500">{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-brand-green py-20 text-white">
          <div className="container-shell text-center">
            <div data-reveal="heading">
              <h2 className="text-[2.3rem] font-semibold tracking-[-0.04em] sm:text-[3rem]">UK Based Team, Fully Compliant</h2>
              <p className="mx-auto mt-6 max-w-4xl text-[1.08rem] leading-9 text-white/90 sm:text-[1.2rem]">
                With over 100,000 verified happy customers and 15,000+ Trustpilot reviews, you can book your clearance
                confidently with us. We are fully insured and registered with the Environment Agency.
              </p>
            </div>

            <div data-reveal="grid" className="mt-16 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
              {trustItems.map((item) => {
                const Icon = iconMap[item.icon];

                return (
                  <div key={item.title} className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/14 text-white">
                      <Icon className="h-9 w-9" />
                    </div>
                    <p className="mt-5 text-[1.3rem] font-semibold tracking-[-0.02em]">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="reviews" className="section-space">
          <div className="container-shell">
            <div data-reveal="heading">
              <h2 className="section-title">Check Our 15,000+ Verified Reviews</h2>
              <p className="section-copy">Rated 4.9 out of 5 by our customers</p>
            </div>

            <div data-reveal="grid" className="mx-auto mt-14 grid max-w-[1340px] gap-6 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.author} className="rounded-[18px] border border-[#dfe7da] bg-white p-7 shadow-[0_10px_22px_rgba(15,23,32,0.04)]">
                  <div className="flex gap-1 text-brand-green">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`${review.author}-${index}`} className="h-[18px] w-[18px] fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 text-[1rem] leading-8 text-brand-dark">"{review.quote}"</p>
                  <p className="mt-5 text-[1rem] font-semibold text-brand-dark">{review.author}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section-space bg-brand-soft">
          <div className="container-shell max-w-[860px]">
            <div data-reveal="heading">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-copy">Everything you need to know about our rubbish removal service</p>
            </div>

            <div data-reveal="grid" className="mt-12 space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[18px] border border-[#dfe7da] bg-white px-5 py-5 shadow-[0_8px_20px_rgba(15,23,32,0.04)] sm:px-6"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-[1.18rem] font-semibold tracking-[-0.02em] text-brand-dark">
                    {item.question}
                    <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-slate-500">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
