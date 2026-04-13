import { ArrowRight, Search, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import SiteFooter from "../../components/layout/SiteFooter";
import SiteHeader from "../../components/layout/SiteHeader";
import { coverageStats, popularLocations } from "../../data/homeContent";

const loadSizes = [
  "Mini Load",
  "Small Load",
  "Medium Load",
  "Large Load",
  "Large Plus",
  "X Large Load",
  "X Large Plus",
  "XX Large Load",
  "Luton Van Load"
];

function LoadSizeCard({ label, index }) {
  const scale = 0.7 + index * 0.08;

  return (
    <article className="rounded-[26px] border border-[#dde4d8] bg-white p-6 shadow-[0_14px_34px_rgba(15,23,32,0.04)]">
      <div className="flex h-[120px] items-end justify-center overflow-hidden rounded-[20px] bg-[#f3f8ef]">
        <Truck className="mb-5 text-brand-green" style={{ width: `${52 * scale}px`, height: `${52 * scale}px` }} strokeWidth={2.2} />
      </div>
      <h3 className="mt-5 text-[1.3rem] font-semibold tracking-[-0.03em] text-[#171717]">{label}</h3>
      <p className="mt-3 text-[0.98rem] leading-7 text-[#61675f]">Flexible fixed pricing based on the amount of vehicle space your clearance needs.</p>
      <a href="https://client-platform.example.com/quote" className="mt-6 inline-flex items-center gap-3 rounded-[14px] border border-[#d4ddd0] px-5 py-3 font-semibold text-[#171717]">
        Get Quote
        <ArrowRight className="h-4 w-4" />
      </a>
    </article>
  );
}

export default function LoadSizesPage() {
  const [search, setSearch] = useState("");

  const filteredLocations = useMemo(() => {
    return popularLocations.filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()));
  }, [search]);

  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section className="hero-surface py-12 lg:py-16">
          <div className="page-shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="section-eyebrow">Load Size Pricing</p>
              <h1 className="max-w-[760px] text-[3rem] font-semibold leading-[1.05] tracking-[-0.055em] text-[#111] sm:text-[4.35rem]">
                Choose the right load size for your clearance.
              </h1>
              <p className="mt-5 max-w-[680px] text-[1.1rem] leading-8 text-[#545b52] sm:text-[1.22rem]">
                Our prices are based on the amount of van space used, keeping quotes simple, clear, and easy to understand.
              </p>
            </div>
            <div className="overflow-hidden rounded-[34px] bg-[#f2f7ee] p-6 shadow-[0_24px_40px_rgba(15,23,32,0.08)]">
              <img src="/images/rocket/service-truck.png" alt="Rocket Rubbish vehicle" className="mx-auto w-full max-w-[600px] object-contain" />
            </div>
          </div>
        </section>

        <section id="coverage" className="bg-[#111b2c] py-20 text-white lg:py-24">
          <div className="page-shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="section-eyebrow text-[#88c151]">Our Coverage</p>
              <h2 className="mt-5 text-[3rem] font-semibold leading-[1.08] tracking-[-0.05em] sm:text-[4.55rem]">
                1,100+ Towns & Cities
                <br />
                Across The UK
              </h2>
              <p className="mt-6 max-w-[560px] text-[1.14rem] leading-9 text-white/84">
                From Aberdeen to Penzance, Newcastle to Norwich. If you're in the UK, we are almost certainly covering your area.
              </p>

              <div className="mt-10 flex max-w-[640px] items-center gap-3 rounded-[20px] border border-[#7bb14d] bg-[#182235] p-3">
                <div className="flex flex-1 items-center gap-3 px-3 py-2 text-white/72">
                  <Search className="h-5 w-5 text-[#8ec956]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search Your City"
                    className="coverage-input"
                  />
                </div>
                <button type="button" className="rounded-[14px] bg-[#7ab245] px-7 py-4 text-[1rem] font-semibold text-white">
                  Go
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {(filteredLocations.length > 0 ? filteredLocations : popularLocations).map((item) => (
                  <span key={item} className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/90">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {coverageStats.map((item, index) => (
                <article key={item.label} className={`coverage-card ${index === 2 ? "lg:col-span-2" : ""}`}>
                  <p className="text-[3.25rem] font-semibold tracking-[-0.05em] text-[#8ec956]">{item.value}</p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-white">{item.label}</h3>
                  <p className="mt-3 max-w-[300px] text-[1rem] leading-7 text-white/70">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#fbfcf8] py-20 lg:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-[900px] text-center">
              <p className="section-eyebrow justify-center">Load Sizes</p>
              <h2 className="section-title">Vehicle space options for every job size.</h2>
              <p className="mt-4 text-[1.06rem] leading-8 text-[#5e645c]">
                Match your waste to the right load size and we will keep the quote fixed and straightforward.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {loadSizes.map((item, index) => (
                <LoadSizeCard key={item} label={item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

