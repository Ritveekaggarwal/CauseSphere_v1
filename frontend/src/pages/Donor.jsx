import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const [dashboard, setDashboard] = useState(null);
const [user, setUser] = useState(null);
  

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("campaign");

    if (id) {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [location]);

  const SORTS = ["Most Funded", "Newest", "Ending Soon"];
useEffect(() => {
  setLoading(true);

  const params = new URLSearchParams({
    search: query,
    category,
    sort:
      sort === "Most Funded"
        ? "funded"
        : sort === "Newest"
        ? "newest"
        : "ending",
  });

  fetch(`http://localhost:5000/api/campaigns?${params}`)
    .then((res) => res.json())
    .then((data) => {
      setCampaigns(data);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load campaigns");
      setLoading(false);
    });

}, [query, category, sort]); // 🔥 IMPORTANT

  // const filteredCampaigns = campaigns.filter((c) => {
  //   const matchesQuery =
  //     c.name?.toLowerCase().includes(query.toLowerCase()) ||
  //     c.description?.toLowerCase().includes(query.toLowerCase());

  //   const matchesCategory =
  //     category === "All" || category === c.category;

  //   return matchesQuery && matchesCategory;
  // });

  // const campaigns = [...filteredCampaigns].sort((a, b) => {
  //   if (sort === "Newest") {
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   }

  //   if (sort === "Most Funded") {
  //     return (b.raisedAmount || 0) - (a.raisedAmount || 0);
  //   }

  //   return 0;
  // });


useEffect(() => {
  // get logged-in user
  fetch("http://localhost:5000/api/auth/me", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => setUser(data))
    .catch(() => {});

  // get donor dashboard
  fetch("http://localhost:5000/api/donations/dashboard", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => setDashboard(data))
    .catch(() => {});
}, []);


  return (
    <main
      className="min-h-screen transition-colors duration-400"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Navbar />

      {/* HEADER */}
      <section className="pt-36 md:pt-44 pb-20 border-b border-(--border)">
        <div className="mx-auto max-w-400 px-6 md:px-12">

          <p className="text-[10px] tracking-widest uppercase text-amber-400 mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-400" />
            For Donors
          </p>

          {/* 🔥 NEW GRID LAYOUT */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center mb-16">

            {/* LEFT SIDE */}
            <div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.9] font-light max-w-3xl">
                Find a cause
                <br />
                <span className="italic">worth your kindness.</span>
              </h1>

              <p className="text-sm text-(--text-secondary) max-w-md leading-relaxed mt-6" />
            </div>

            {/* RIGHT SIDE - IMPACT CARD */}
            <div className="rounded-3xl border border-white/10 bg-white/2 backdrop-blur p-6 md:p-8">

              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] tracking-widest uppercase text-amber-400 flex items-center gap-2">
                  <span className="h-px w-6 bg-amber-400" />
                  Your Impact
                </p>
                <span className="text-xs text-gray-500 tracking-widest">{user?.firstName}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-[10px] tracking-widest text-gray-500 mb-2">
                    TOTAL GIVEN
                  </p>
                  <p className="text-xl font-semibold">₹{dashboard?.totalDonated?.toLocaleString("en-IN") || 0}</p>
                </div>

                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-[10px] tracking-widest text-gray-500 mb-2">
                    CAMPAIGNS
                  </p>
                  <p className="text-xl font-semibold">{dashboard?.campaignsCount || 0}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-4">
                  <p className="text-gray-400">🏆 TOP DONORS</p>
                  <p className="text-gray-500">YOUR RANK • #{dashboard?.rank || "-"} / {dashboard?.leaderboard?.length || 0}</p>
                </div>

               {dashboard?.leaderboard?.length > 0 ? (
  dashboard.leaderboard.map((d, i) => (
    <div
      key={i}
      className="flex justify-between items-center border border-white/10 rounded-lg px-4 py-3 mb-2"
    >
      <div className="flex items-center gap-3">

        <div
          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs ${
            i === 0
              ? "bg-amber-400 text-black"
              : i === 1
              ? "bg-gray-300 text-black"
              : "bg-gray-700 text-white"
          }`}
        >
          {i + 1}
        </div>

        <span className="text-sm">
          {d.name || "Anonymous"}
        </span>
      </div>

      <span className="text-sm text-gray-400">
        ₹{Number(d.total || 0).toLocaleString("en-IN")}
      </span>


      
    </div>



  ))
) : null}
              </div>

            </div>
          </div>

          {/* SEARCH */}
          <div className="max-w-3xl flex flex-col md:flex-row gap-4">
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
              <span className="font-semibold">
                {campaigns.length}
              </span>{" "}
              campaigns found
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

          {!loading && !error && campaigns.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {campaigns.map((c) => (
                <div key={c._id} id={c._id}>
                  <Campaigncard
                    c={{
                      ...c,
                      title: c.name,
                      target: c.goal,
                      raised: c.raisedAmount || 0,
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
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

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