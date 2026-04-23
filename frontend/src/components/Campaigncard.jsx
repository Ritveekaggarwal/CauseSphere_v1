import { ArrowUpRight, Bookmark, Star } from "lucide-react";
import { useState } from "react";

const formatINR = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}k`;

const urgencyTone = {
  Low: "text-zinc-400",
  Medium: "text-amber-400",
  High: "text-red-400",
};

const urgencyDot = {
  Low: "bg-zinc-400",
  Medium: "bg-amber-400",
  High: "bg-red-400",
};

export default CampaignCard = ({ c }) => {
  const [saved, setSaved] = useState(false);
  const pct = Math.min(100, Math.round((c.raised / c.target) * 100));

  return (
    <article className="group relative bg-(--bg-secondary) rounded-3xl overflow-hidden border border-[var(--border)] hover:border-amber-400/40 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.35)] transition-all duration-500 flex flex-col">
      {/* Cover image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/40 to-transparent" />

        {/* Category tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-sm text-[10px] tracking-widest uppercase text-amber-400">
            {c.category}
          </span>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => setSaved((s) => !s)}
          aria-label="Save campaign"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-center hover:bg-amber-400 hover:text-zinc-950 transition-colors"
        >
          <Bookmark
            className={`h-4 w-4 transition-colors ${
              saved ? "fill-amber-400 text-amber-400" : "text-[var(--text-secondary)]"
            }`}
          />
        </button>

        {/* Floating info panel */}
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-(--bg-secondary)/95 backdrop-blur-md border border-[var(--border)] p-5 space-y-4">
          {/* Title + target */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl leading-tight text-[var(--text-primary)] line-clamp-2">
              {c.title}
            </h3>
            <span className="shrink-0 px-3 py-1 rounded-full bg-[var(--bg-primary)]/80 text-xs font-semibold text-amber-400">
              {formatINR(c.target)}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {c.description}
          </p>

          {/* Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-primary)]/70 text-[10px] text-[var(--text-primary)]">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {c.rating?.toFixed(1) ?? "—"}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)]/70 text-[10px] uppercase tracking-wider ${
                urgencyTone[c.urgency]
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${urgencyDot[c.urgency]}`} />
              {c.urgency} urgency
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--bg-primary)]/70 text-[10px] text-[var(--text-secondary)]">
              {c.daysLeft}d left
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between text-[10px] tracking-wider uppercase">
              <span className="text-[var(--text-primary)] font-semibold">
                {formatINR(c.raised)} raised
              </span>
              <span className="text-amber-400">{pct}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-[var(--bg-primary)]/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* CTA */}
          <a
            href={`/campaign/${c._id || c.id}`}
            className="group/btn flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold tracking-wider uppercase hover:bg-amber-400 hover:text-zinc-950 transition-colors"
          >
            View More
            <ArrowUpRight className="h-4 w-4 group-hover/btn:rotate-45 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </article>
  );
};