import { ArrowUpRight } from "lucide-react";
import Donor from '../pages/Donor.jsx';
import { Link } from 'react-router-dom'

// Swap these imports for your actual campaign images when ready
import camp1 from "../assets/campaign-1.jpg";
import camp2 from "../assets/campaign-2.jpg";
import camp3 from "../assets/campaign-3.jpg";

// Placeholder gradient backgrounds until you add campaign images
const placeholderColors = [
  "from-zinc-700 to-zinc-800",
  "from-zinc-600 to-zinc-700",
  "from-zinc-700 to-zinc-900",
];

const campaigns = [
  {
    // image: camp1,
    tag: "Education",
    title: "Books for the Banyan School",
    description:
      "Stocking a rural library so 240 children can read past sundown — and dream past tomorrow.",
    raised: 318000,
    target: 500000,
    days: 21,
  },
  {
    // image: camp2,
    tag: "Clean Water",
    title: "A well for Khadgaon Village",
    description:
      "One borewell will end a six-kilometre walk for water, and give back hours stolen from childhood.",
    raised: 420000,
    target: 600000,
    days: 12,
  },
  {
    // image: camp3,
    tag: "Climate",
    title: "Reforesting the Aravalli ridge",
    description:
      "Ten thousand saplings, planted by hand, to bring back a forest the city forgot it ever had.",
    raised: 175000,
    target: 800000,
    days: 45,
  },
];

const formatINR = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}k`;

export const Discover = () => {
  return (
    <section id="discover" className="relative bg-zinc-950 py-32 md:py-48">
      <div className="mx-auto max-w-400 px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <p className="text-[20px] tracking-widest uppercase text-amber-400 mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-amber-400" />
              Discover
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-light text-white max-w-3xl">
              Causes waiting
              <br />
              <span className="italic">to be answered.</span>
            </h2>
          </div>
          <Link to="/donor"
            className="group hidden md:inline-flex items-center gap-3 px-6 py-3 bg-amber-400 text-zinc-950 text-xs tracking-widest uppercase font-bold hover:bg-amber-400 hover:text-zinc-950 hover:shadow-[0_0_24px_rgba(251,191,36,0.4)] transition-all duration-500 hover:scale-[1.03]"
          >
            View all campaigns
            <span className="h-px w-10 bg-white group-hover:w-16 group-hover:bg-amber-400 transition-all duration-500" />
          </Link  >
        </div>

        {/*
          CARDS GRID
          — Later: wrap this div in overflow-x-auto, change to flex gap-6,
            set each card to min-w-[340px] flex-shrink-0, add infinite scroll logic.
        */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((c, i) => {
            const pct = Math.min(100, Math.round((c.raised / c.target) * 100));
            return (
              <article
                key={i}
                className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/40 transition-all duration-500 flex flex-col"
              >
                {/* Image area — swap the gradient div for <img> once you have campaign images */}
                <div className="relative aspect-4/3 overflow-hidden">
                  {/* Replace this div with <img src={c.image} ... /> when images are ready */}
                  <img src={c.image}  />
                  <div
                    className={`h-full w-full bg-linear-to-br ${placeholderColors[i]} group-hover:scale-105 transition-transform duration-1000`}
                  />

                  Uncomment when you have real images:
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />

                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-zinc-950/85 backdrop-blur-sm">
                    <span className="text-[10px] tracking-widest uppercase text-amber-400">
                      {c.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-zinc-950/85 backdrop-blur-sm">
                    <span className="text-[10px] tracking-widest uppercase text-zinc-400">
                      {c.days} days left
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-3">
                    {c.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-1">
                    {c.description}
                  </p>

                  {/* Progress */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-2xl text-white">
                        {formatINR(c.raised)}
                      </span>
                      <span className="text-[10px] tracking-widest uppercase text-zinc-400">
                        of {formatINR(c.target)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-px w-full bg-zinc-800 relative">
                      <div
                        className="absolute top-0 left-0 h-0.5 bg-amber-400 -translate-y-px transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-amber-400">
                      {pct}% funded
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="#"
                    className="group/btn inline-flex items-center justify-between gap-3 pt-4 border-t border-zinc-800 text-xs tracking-widest uppercase text-white hover:text-amber-400 transition-colors"
                  >
                    View Campaign
                    <ArrowUpRight className="h-4 w-4 group-hover/btn:rotate-45 transition-transform duration-500" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};