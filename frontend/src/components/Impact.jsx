import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const stats = [ 
  { value: "₹2.4 Cr+", label: "Funds raised collectively" },
  { value: "1,280", label: "Campaigns successfully funded" },
  { value: "94k", label: "Donors and contributors" },
  { value: "37", label: "Countries reached" },
];

const stories = [
  {
    quote:
      "I never imagined a small post could feed an entire village for a month. CauseSphere made it feel less like asking, and more like being heard.",
    author: "Anaya R.",
    role: "Campaign organizer, Jaipur",
  },
  {
    quote:
      "Every rupee I donated showed up — the receipts, the photos, the school. For the first time, giving felt like a conversation, not a transaction.",
    author: "Marcus L.",
    role: "Monthly donor, Berlin",
  },
  {
    quote:
      "My mother's surgery was funded by 312 strangers. I learned that day that the world is softer than the news suggests.",
    author: "Devansh K.",
    role: "Beneficiary, Pune",
  },
];

// ✅ Animated number (slower)
const AnimatedNumber = ({ value, start }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) return;

    const duration = 2.5; // slower
    const steps = duration * 60;
    const increment = numeric / steps;

    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      current += increment;

      if (frame >= steps) {
        clearInterval(counter);
        current = numeric;
      }

      setDisplay(current);
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [value, start]);

  const suffix = value.replace(/[0-9.]/g, "");

  return (
    <span>
      {display.toFixed(value.includes(".") ? 1 : 0)}
      {suffix}
    </span>
  );
};

export const Impact = () => {
  // ✅ detect scroll into view
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="impact"
      ref={ref} // ✅ attach here
      className="relative bg-zinc-900 py-32 md:py-48 border-y border-zinc-800"
    >
      <div className="mx-auto max-w-400 px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <p className="text-[20px] tracking-widest uppercase text-amber-400 mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-amber-400" />
              Impact
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-light text-white max-w-3xl">
              Numbers that became
              <br />
              <span className="italic">lives changed.</span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
            Behind every number on this page is a name, a face, a Tuesday afternoon when
            something quietly shifted. This is what collective action looks like.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 mb-24">
          {stats.map((s, i) => (
            <div key={s.label} className="bg-zinc-900 p-8 md:p-10">
              <div className="text-[10px] tracking-widest uppercase text-amber-400 mb-4">
                0{i + 1}
              </div>
              <div className="font-serif text-5xl md:text-6xl text-white font-light leading-none mb-4">
                {/* ✅ animate only when visible */}
                <AnimatedNumber value={s.value} start={isInView} />
              </div>
              <div className="text-xs tracking-widest uppercase text-zinc-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
          {stories.map((s, i) => (
            <figure key={i} className="bg-zinc-900 p-10 flex flex-col">
              <div className="text-amber-400 font-serif text-6xl leading-none mb-6">"</div>
              <blockquote className="font-serif text-xl md:text-2xl italic font-light text-white/90 leading-snug flex-1">
                {s.quote}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-zinc-800">
                <div className="text-sm text-white">{s.author}</div>
                <div className="text-[10px] tracking-widest uppercase text-zinc-400 mt-1">
                  {s.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};