import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN").format(n);

export default function Dashboard() {
  const [campaign, setCampaign] = useState(null);
  const [ended, setEnded] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  // ✅ EDIT STATE
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    endDate: "",
    email: "",
    phone: "",
    upiId: "",
  });

  /* 🔗 FETCH */
  useEffect(() => {
    fetch("http://localhost:5000/api/campaigns/my", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setCampaign(data);
        } else {
          setCampaign(null);
        }
      });
  }, []);

  // ✅ AUTO FILL FORM AFTER LOAD
  useEffect(() => {
    if (campaign) {
      setForm({
        name: campaign.name || "",
        description: campaign.description || "",
        goal: campaign.goal || "",
        endDate: campaign.endDate || "",
        email: campaign.email || "",
        phone: campaign.phone || "",
        upiId: campaign.upiId || "",
      });
    }
  }, [campaign]);

  /* ⏳ REDIRECT */
  useEffect(() => {
    if (!ended) return;

    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          navigate("/start-campaign");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ended, navigate]);

  /* ⏳ AUTO END */
  useEffect(() => {
    if (!campaign) return;

    const now = new Date();
    const end = new Date(campaign.endDate);

    if (now >= end) setEnded(true);
  }, [campaign]);

  /* 📊 STATS (unchanged) */
  const stats = useMemo(() => {
    if (!campaign) return {};

    const donations = campaign.donations || [];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const today = donations
      .filter((d) => new Date(d.at) >= todayStart)
      .reduce((s, d) => s + d.amount, 0);

    const week = donations
      .filter((d) => new Date(d.at).getTime() >= weekAgo)
      .reduce((s, d) => s + d.amount, 0);

    const pct = Math.min(
      100,
      Math.round(((campaign.raisedAmount || 0) / campaign.goal) * 100)
    );

    return {
      today,
      week,
      pct,
      donors: donations.length,
    };
  }, [campaign]);

  /* ✅ UPDATE FUNCTION */
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/campaigns/${campaign._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setCampaign(updated); // 🔥 no reload needed
        setEditOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ❌ NO CAMPAIGN */
  if (!campaign) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-white">
          No campaign found. Start one.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0b0b0c] text-white pt-24 pb-20 px-6 lg:px-12">

        <div className="fixed -bottom-37.5 -left-37.5 w-150 h-150 bg-[#e0b24a]/20 blur-[180px]" />

        {/* HEADER */}
        <div className="max-w-6xl mx-auto mb-12">
          <p className="text-[11px] tracking-[0.3em] text-yellow-500 uppercase mb-3">
            — {campaign.category}
          </p>

          <h1 className="font-serif text-5xl leading-tight">
            {campaign.name}
          </h1>

          <p className="text-gray-400 mt-4 max-w-xl">
            {campaign.description}
          </p>
        </div>

        {/* STATS */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 border border-white/10 mb-12">

          <Stat title="Total raised" value={`₹${formatINR(campaign.raisedAmount || 0)}`} sub={`of ₹${formatINR(campaign.goal)}`} />
          <Stat title="This week" value={`₹${formatINR(stats.week || 0)}`} sub="Last 7 days" />
          <Stat title="Today" value={`₹${formatINR(stats.today || 0)}`} sub="Since midnight" />
          <Stat title="Donors" value={stats.donors || 0} sub="Contributions" />

        </div>

        {/* MAIN GRID */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 border border-white/10">

          {/* DONATIONS */}
          <div className="lg:col-span-2 p-8 border-r border-white/10">
            <h2 className="font-serif text-2xl mb-6">Last 10 donations</h2>

            {campaign.donations?.length > 0 ? (
              campaign.donations.slice(-10).reverse().map((d, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-white/10">
                  <div>
                    <p>{d.donor}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(d.at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-yellow-500">₹{formatINR(d.amount)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No donations yet</p>
            )}
          </div>

          {/* DETAILS */}
          <div className="p-8">
            <h2 className="font-serif text-2xl mb-6">Campaign details</h2>

            {/* ✅ EDIT BUTTON */}


            <div className="space-y-4 text-sm">
              <p>Goal: ₹{formatINR(campaign.goal)}</p>
              <p>Category: {campaign.category}</p>
              <p>Payout: {campaign.upiId}</p>
              <p>End date: {campaign.endDate}</p>
            </div>

            {!ended && (
  <>
    <button
      onClick={async () => {
        await fetch(
          `http://localhost:5000/api/campaigns/${campaign._id}/close`,
          {
            method: "PUT",
            credentials: "include",
          }
        );
        setEnded(true);
      }}
      className="mt-8 w-full bg-yellow-500 text-black py-3 text-xs uppercase"
    >
      Close Campaign
    </button>

    {/* ✅ EDIT BUTTON (SAME STYLE FAMILY) */}
    <button
      onClick={() => setEditOpen(true)}
      className="mt-8 w-full bg-yellow-500 text-black py-3 text-xs uppercase"

      // className="mt-3 w-full border border-white/10 text-white py-3 text-xs uppercase hover:border-white/40"
    >
      Edit Campaign
    </button>
  </>
)}
          </div>
        </div>

        {/* ✅ EDIT MODAL */}
        {editOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-125 space-y-4">

              <h2 className="text-lg font-semibold">Edit Campaign</h2>

              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 rounded bg-black border border-white/10" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 resize-none rounded bg-black border border-white/10" />
              <input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="w-full p-3 rounded bg-black border border-white/10" />
              <input value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} className="w-full p-3 rounded bg-black border border-white/10" />

              <div className="flex gap-3 pt-4">
                <button onClick={handleUpdate} className="flex-1 bg-amber-400 text-black py-2 rounded-full text-xs font-semibold">
                  Save
                </button>
                <button onClick={() => setEditOpen(false)} className="flex-1 border border-white/10 py-2 rounded-full text-xs">
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

{ended && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-zinc-900 border border-yellow-500 rounded-2xl px-10 py-10 text-center w-105">

      <h2 className="font-serif text-2xl mb-3">
        Campaign Closed
      </h2>

      <p className="text-gray-400 mb-4">
        Your campaign has been successfully closed.
      </p>

      <p className="text-yellow-500 text-xl font-semibold">
        ₹{formatINR(campaign.raisedAmount || 0)}
      </p>

      <p className="text-xs text-gray-500 mt-5">
        Redirecting in {countdown}s...
      </p>

    </div>
  </div>
)}

        <Footer />
      </div>
    </>
  );
}

function Stat({ title, value, sub }) {
  return (
    <div className="p-6 border-r border-b border-white/10">
      <p className="text-xs text-yellow-500 uppercase">{title}</p>
      <p className="text-2xl font-serif mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}