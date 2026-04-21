import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CampaignCard } from "../components/CampaignCard";
import { useCampaigns } from "../hooks/useCampaigns";

const CATEGORIES = ["All", "Education", "Clean Water", "Climate", "Health", "Disaster Relief", "Animal Welfare"];
const URGENCIES  = ["All", "Low", "Medium", "High"];
const SORTS      = ["Most Funded", "Newest", "Most Urgent", "Ending Soon"];

const Donor = () => {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const [urgency,  setUrgency]  = useState("All");
  const [sort,     setSort]     = useState("Most Funded");
  const [page,     setPage]     = useState(1);

  // All filtering/sorting/pagination handled by the backend
  const { campaigns, total, totalPages, loading, error, refetch } = useCampaigns({
    page,
    category,
    urgency,
    sort,
    query,
  });

  // Reset to page 1 whenever a filter changes
  const handleCategory = (c) => { setCategory(c); setPage(1); };
  const handleUrgency  = (u) => { setUrgency(u);  setPage(1); };
  const handleSort     = (s) => { setSort(s);     setPage(1); };
  const handleQuery    = (e) => { setQuery(e.target.value); setPage(1); };

  return (
    <main
      className="min-h-screen transition-colors duration-400"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Navbar />

      {/* ── PAGE HEADER ───────────────────────────────────────────────── */}
      <section className="pt-36 md:pt-44 pb-12 border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <p className="text-[10px] tracking-widest uppercase text-amber-400 mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-400" />
            For Donors
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-light text-[var(--text-primary)] max-w-3xl">
              Find a cause
              <br />
              <span className="italic">worth your kindness.</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              Browse verified campaigns from across the country. Search, filter, and sort
              to find the story that moves you — then move it forward.
            </p>
          </div>

          {/* ── SEARCH + SORT ─────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <input
                value={query}
                onChange={handleQuery}
                placeholder="Search by name, cause, or keyword…"
                className="w-full h-14 pl-14 pr-5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-amber-400/60 transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)] pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="h-14 pl-12 pr-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] appearance-none cursor-pointer focus:outline-none focus:border-amber-400/60 transition-colors min-w-[200px]"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>Sort: {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── FILTER CHIPS ──────────────────────────────────────────── */}
          <div className="mt-8 space-y-4">
            {/* Category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] mr-2">
                Category
              </span>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategory(c)}
                  className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase border transition-all ${
                    category === c
                      ? "bg-amber-400 text-zinc-950 border-amber-400"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Urgency */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-widests uppercase text-[var(--text-muted)] mr-2 tracking-widest">
                Urgency
              </span>
              {URGENCIES.map((u) => (
                <button
                  key={u}
                  onClick={() => handleUrgency(u)}
                  className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase border transition-all ${
                    urgency === u
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/40"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CAMPAIGN GRID ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">

          {/* Result count */}
          {!loading && !error && (
            <div className="flex items-baseline justify-between mb-10">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--text-primary)] font-semibold">{total}</span> campaigns found
              </p>
              <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)]">
                Page {page} of {totalPages}
              </p>
            </div>
          )}

          {/* ── LOADING STATE ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
              <p className="text-sm text-[var(--text-secondary)] tracking-widest uppercase">
                Loading campaigns…
              </p>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <div>
                <p className="font-serif text-2xl text-[var(--text-primary)] mb-2">
                  Something went wrong.
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
                <button
                  onClick={refetch}
                  className="px-6 py-3 bg-amber-400 text-zinc-950 text-xs tracking-widest uppercase font-bold hover:bg-amber-300 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && !error && campaigns.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-serif text-3xl text-[var(--text-primary)] mb-3">
                No campaigns match your search.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Try adjusting your filters or keywords.
              </p>
            </div>
          )}

          {/* ── CARDS ── */}
          {!loading && !error && campaigns.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {campaigns.map((c) => (
                <CampaignCard key={c._id} c={c} />
              ))}
            </div>
          )}

          {/* ── PAGINATION ── */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-11 w-11 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-amber-400 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                // Show max 7 pages with ellipsis logic
                const show =
                  n === 1 ||
                  n === totalPages ||
                  (n >= page - 2 && n <= page + 2);
                if (!show) {
                  // Show a single ellipsis between gaps
                  if (n === page - 3 || n === page + 3) {
                    return (
                      <span key={n} className="text-[var(--text-muted)] px-1 text-sm">
                        …
                      </span>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-11 min-w-[44px] px-3 rounded-full text-xs tracking-wider transition-all ${
                      page === n
                        ? "bg-amber-400 text-zinc-950 font-bold"
                        : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/40"
                    }`}
                  >
                    {String(n).padStart(2, "0")}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-11 w-11 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-amber-400 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Donor;