import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN").format(n);

export default function Dashboard() {
  const [campaign, setCampaign] = useState(null);
  const [ended, setEnded] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  /* 🔗 FETCH FROM BACKEND */
  useEffect(() => {
    fetch("http://localhost:5000/api/campaigns", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCampaign(data[0]); // for now first campaign
        }
      })
      .catch((err) => console.error(err));
  }, []);

  /* ⏳ AUTO REDIRECT AFTER CLOSE */
  useEffect(() => {
    if (!ended) return;

    setCountdown(10);

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

  /* ⏳ AUTO END BASED ON DATE */
  useEffect(() => {
    if (!campaign) return;

    const now = new Date();
    const end = new Date(campaign.endDate);

    if (now >= end) setEnded(true);
  }, [campaign]);

  /* 📊 STATS */
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

        {/* GOLD GLOW */}
        <div className="fixed bottom-[-150px] left-[-150px] w-[600px] h-[600px] bg-[#e0b24a]/20 blur-[180px] pointer-events-none" />

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

          <Stat
            title="Total raised"
            value={`₹${formatINR(campaign.raisedAmount || 0)}`}
            sub={`of ₹${formatINR(campaign.goal)}`}
          />

          <Stat
            title="This week"
            value={`₹${formatINR(stats.week || 0)}`}
            sub="Last 7 days"
          />

          <Stat
            title="Today"
            value={`₹${formatINR(stats.today || 0)}`}
            sub="Since midnight"
          />

          <Stat
            title="Donors"
            value={stats.donors || 0}
            sub="Contributions"
          />

        </div>

        {/* PROGRESS */}
        <div className="max-w-6xl mx-auto border border-white/10 p-8 mb-12 bg-black/30">

          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-yellow-500">{stats.pct || 0}%</span>
          </div>

          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-yellow-500 transition-all duration-700"
              style={{ width: `${stats.pct || 0}%` }}
            />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 border border-white/10">

          {/* DONATIONS */}
          <div className="lg:col-span-2 p-8 border-r border-white/10">
            <h2 className="font-serif text-2xl mb-6">Last 10 donations</h2>

            {campaign.donations?.length > 0 ? (
              campaign.donations.map((d, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-white/10">
                  <div>
                    <p>{d.donor}</p>
                    <p className="text-xs text-gray-500">recent</p>
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

            <div className="space-y-4 text-sm">
              <p>Goal: ₹{formatINR(campaign.goal)}</p>
              <p>Category: {campaign.category}</p>
              <p>Payout: {campaign.upiId}</p>
              <p>End date: {campaign.endDate}</p>
            </div>

            {/* CLOSE BUTTON */}
            {!ended && (
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
            )}
          </div>
        </div>

        {/* FINAL SUMMARY */}
        {ended && (
          <div className="max-w-4xl mx-auto mt-16 p-10 border border-yellow-500 bg-black/40 text-center">

            <h2 className="font-serif text-3xl mb-4">
              Campaign Closed
            </h2>

            <p className="text-gray-400 mb-4">
              All details are finalized and recorded.
            </p>

            <div className="text-xl text-yellow-500">
              ₹{formatINR(campaign.raisedAmount || 0)} raised
            </div>

            <div className="text-sm text-gray-400 mt-2">
              from {stats.donors || 0} donors
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Redirecting to form in {countdown}s...
            </p>

          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

/* STAT COMPONENT */
function Stat({ title, value, sub }) {
  return (
    <div className="p-6 border-r border-b border-white/10">
      <p className="text-xs text-yellow-500 uppercase">{title}</p>
      <p className="text-2xl font-serif mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}