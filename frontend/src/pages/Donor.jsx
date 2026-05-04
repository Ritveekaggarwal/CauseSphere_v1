import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Campaigncard from "../components/Campaigncard.jsx";
import CampaignDetailModal from "../components/CampaignDetailModal.jsx";

const CATEGORIES = [
  "All",
  "medical",
  "education",
  "animals",
  "environment",
  "ngo",
  "other",
];

const SORTS = ["Most Funded", "Newest"];

// const categoryMap = {
//   Education: "education",
//   Health: "medical",
//   "Animal Welfare": "animals",
//   Climate: "environment",
//   "Disaster Relief": "other",
//   // "Clean Water": "other",
// };

const Donor = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Most Funded");
  const [page, setPage] = useState(1);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [open, setOpen] = useState(false);

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* 🔥 FETCH CAMPAIGNS */
  useEffect(() => {
    fetch("http://localhost:5000/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load campaigns");
        setLoading(false);
      });
  }, []);

  /* 🔍 FILTER */
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesQuery =
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.description?.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      category === "All" || category === c.category

    return matchesQuery && matchesCategory;
  });

  /* 🔄 SORT */
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sort === "Newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sort === "Most Funded") {
      return (b.raisedAmount || 0) - (a.raisedAmount || 0);
    }

    return 0;
  });

  return (
    <main
      className="min-h-screen transition-colors duration-400"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Navbar />

      {/* HEADER */}
      <section className="pt-36 md:pt-44 pb-12 border-b border-(--border)">
        <div className="mx-auto max-w-400 px-6 md:px-12">

          <p className="text-[10px] tracking-widest uppercase text-amber-400 mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-400" />
            For Donors
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-light max-w-3xl">
              Find a cause
              <br />
              <span className="italic">worth your kindness.</span>
            </h1>
            <p className="text-sm text-(--text-secondary) max-w-md leading-relaxed">
              {/* Browse verified campaigns from across the country. */}
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="w-full h-14 pl-14 pr-5 rounded-full bg-(--bg-secondary) border border-(--border)"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-14 px-4 rounded-full bg-(--bg-secondary) border border-(--border)"
            >
              {SORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}
        <div className="mt-8 flex flex-wrap gap-2">
  {CATEGORIES.map((c) => (
    <button
      key={c}
      onClick={() => {
        setCategory(c);
        setPage(1);
      }}
      className={`px-4 py-2 rounded-full text-xs ${
        category === c
          ? "bg-amber-400 text-black"
          : "border border-(--border)"
      }`}
    >
      {c === "All"
        ? "All"
        : c.charAt(0).toUpperCase() + c.slice(1)}
    </button>
  ))}
</div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16">
        <div className="mx-auto max-w-400 px-6 md:px-12">

          {!loading && !error && (
            <p className="mb-8 text-sm">
              <span className="font-semibold">{sortedCampaigns.length}</span> campaigns found
            </p>
          )}

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-amber-400" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <AlertCircle className="mx-auto mb-4" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && sortedCampaigns.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedCampaigns.map((c) => (
                <Campaigncard
                  key={c._id}
                  c={{
                    ...c,
                    title: c.name,
                    target: c.goal,
                    raised: c.raisedAmount || 0,
                    urgency: "Medium",
                    rating: 4.5,
                    daysLeft: Math.max(
                      0,
                      Math.ceil(
                        (new Date(c.endDate) - new Date()) /
                        (1000 * 60 * 60 * 24)
                      )
                    ),
                    onOpen: (data) => {
                      setSelectedCampaign(data);
                      setOpen(true);
                    },
                  }}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* MODAL */}
      <CampaignDetailModal
        campaign={selectedCampaign}
        open={open}
        onClose={() => setOpen(false)}
      />

      <Footer />
    </main>
  );
};

export default Donor;