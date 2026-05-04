import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import StartCampaign from "../pages/StartCampaign.jsx";


const steps = [
  {
    n: "01",
    title: "Register",
    text: "Create your account in under two minutes — no fees, no hidden gates.",
  },
  {
    n: "02",
    title: "Tell your story",
    text: "Add campaign details, photos, and the impact you intend to create.",
  },
  {
    n: "03",
    title: "Submit verification",
    text: "Upload supporting documents so donors can give with full confidence.",
  },
  {
    n: "04",
    title: "Go live",
    text: "Once approved, your campaign launches to a network of 94,000+ donors.",
  },
];

export const Start_a_Campaign = () => {


const navigate = useNavigate();
const [user, setUser] = useState(null);

useEffect(() => {
  fetch("http://localhost:5000/api/auth/me", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) setUser(data.user);
    })
    .catch(() => setUser(null));
}, []);


const handleStartCampaign = async () => {
  try {
    // not logged in
    if (!user) {
      navigate("/login", { state: { from: "/start-campaign" } });
      return;
    }

    // check if campaign exists
    const res = await fetch("http://localhost:5000/api/campaigns/my", {
      credentials: "include",
    });

    const data = await res.json();

    if (data) {
      navigate("/dashboard"); // already has campaign
    } else {
      navigate("/start-campaign"); // create new
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <section
      // id="start"
      id="start_a_campaign"
      className="relative bg-zinc-900 py-32 md:py-48 border-y border-zinc-800 overflow-hidden"
    >
      {/* Editorial guide lines */}
      <div className="absolute inset-y-0 left-[8%] w-px bg-amber-400/10 hidden md:block" />
      <div className="absolute inset-y-0 right-[8%] w-px bg-amber-400/10 hidden md:block" />

      <div className="mx-auto max-w-400 px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-[20px] tracking-widest uppercase text-amber-400 mb-6 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-amber-400" />
            Begin
            <span className="h-px w-8 bg-amber-400" />
          </p>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-light text-white">
            Have a cause?
            <br />
            <span className="italic">Lend it your voice.</span>
          </h2>
          <p className="mt-8 text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
            Anyone can start a fundraiser on CauseSphere. Four quiet steps stand between
            your idea and the moment it reaches the world.
          </p>
        </div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="absolute top-8 left-0 right-0 h-px bg-zinc-800 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                {/* Node */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-4 w-4 bg-amber-400 relative z-10 shadow-[0_0_16px_rgba(251,191,36,0.5)]" />
                  <span className="font-serif text-3xl text-amber-400/60">{s.n}</span>
                </div>
                <h3 className="font-serif text-2xl text-white mb-3 leading-tight">
                  {s.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed pr-4">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 flex flex-col items-center text-center">
          {/* <Link
            to="/start-campaign"
            onClick={() => {
              if (!user) {
                navigate("/login", { state: { from: "/start-campaign" } });
              } else {
                navigate("/start-campaign");
              }
            }}
            className="group inline-flex items-center gap-4 px-10 py-5 bg-amber-400 text-zinc-950 text-xs tracking-widest uppercase font-bold hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(251,191,36,0.45)] transition-all duration-500 hover:scale-[1.03]"
          >
            Start your campaign
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-500" />
          </Link> */}

<button
  onClick={handleStartCampaign}
  className="group inline-flex items-center gap-4 px-10 py-5 bg-amber-400 text-zinc-950 text-xs tracking-widest uppercase font-bold hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(251,191,36,0.45)] transition-all duration-500 hover:scale-[1.03]"
>
  Start your campaign
  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-500" />
</button>


          <p className="mt-6 text-[10px] tracking-widest uppercase text-zinc-500">
            Free to start · No platform fee · Verified within 48 hours
          </p>
        </div>
      </div>
    </section>
  );
};