import { useState } from "react";
import { MapPin, Sofa, Trash2, Truck } from "lucide-react";
import { bookingLinks } from "../data/siteContent";

const needs = [
  {
    title: "Pile of Junk",
    copy: "I have a pile of junk",
    icon: Trash2
  },
  {
    title: "Single Items",
    copy: "I have specific items",
    icon: Sofa
  }
];

const timings = ["ASAP", "Next Few Days", "1 Week +", "Not Sure Yet"];

export default function HeroQuoteCard() {
  const [selectedNeed, setSelectedNeed] = useState(needs[0].title);
  const [selectedTiming, setSelectedTiming] = useState(timings[0]);
  const [postcode, setPostcode] = useState("");

  return (
    <div className="rounded-[26px] border border-[#dfe7da] bg-white p-5 shadow-[0_18px_32px_rgba(15,23,32,0.08)] sm:p-7">
      <p className="text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-brand-dark">
        What do you need help with?
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {needs.map((item) => {
          const Icon = item.icon;
          const isSelected = item.title === selectedNeed;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => setSelectedNeed(item.title)}
              className={`rounded-[22px] border p-5 text-left transition ${
                isSelected
                  ? "border-brand-green bg-[#f1f8ed] shadow-[inset_0_0_0_1px_rgba(47,143,22,0.15)]"
                  : "border-[#dfe7da] bg-white hover:border-[#bad3b2]"
              }`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${isSelected ? "bg-[#dff0d8]" : "bg-[#f3f5f6]"} text-brand-green`}>
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-6 text-[1.55rem] font-semibold tracking-[-0.03em] text-brand-dark">{item.title}</p>
              <p className="mt-2 text-[0.94rem] leading-6 text-slate-500">{item.copy}</p>
            </button>
          );
        })}
      </div>

      <label className="mt-6 block">
        <span className="text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-brand-dark">Collection postcode?</span>
        <span className="mt-3 flex items-center gap-3 rounded-[18px] border border-[#dfe7da] bg-white px-4 py-4 text-slate-500">
          <MapPin className="h-5 w-5 text-brand-green" />
          <input
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
            placeholder="Enter the postcode"
            className="w-full border-none bg-transparent text-[0.98rem] outline-none placeholder:text-slate-400"
          />
        </span>
      </label>

      <div className="mt-6">
        <p className="text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-brand-dark">When do you need this?</p>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {timings.map((item) => {
            const isSelected = item === selectedTiming;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedTiming(item)}
                className={`rounded-[16px] border px-4 py-3 text-sm font-semibold transition ${
                  isSelected
                    ? "border-brand-green bg-[#edf8e8] text-brand-green"
                    : "border-[#dfe7da] bg-white text-slate-600 hover:border-[#bad3b2]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <a
        href={bookingLinks.getQuote}
        className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-[16px] bg-brand-green px-6 py-4 text-[1.05rem] font-semibold text-white shadow-[0_12px_26px_rgba(47,143,22,0.2)] transition hover:bg-[#267810]"
      >
        <Truck className="h-5 w-5" />
        Get a Quote
      </a>
    </div>
  );
}
