import { ShieldCheck, Eye, Lock } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    label: "Verified",
    text: "Every campaign passes a structured approval process before going live.",
  },
  {
    icon: Eye,
    label: "Transparent",
    text: "Real-time tracking on every donation, every milestone, every outcome.",
  },
  {
    icon: Lock,
    label: "Secure",
    text: "End-to-end encrypted transactions, recorded and traceable forever.",
  },
];

export const About = () => {
  return (
    <section id="about" className="relative bg-zinc-950 py-32 md:py-48">
      <div className="absolute inset-y-0 left-[8%] w-px bg-amber-400/10 hidden md:block" />
      <div className="absolute inset-y-0 right-[8%] w-px bg-amber-400/10 hidden md:block" />

      <div className="mx-auto max-w-400 px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20">
          {/* Sticky heading */}
          <div className="md:col-span-4">
            <div className="sticky top-32">
              <p className="text-[20px] tracking-widest uppercase text-amber-400 mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-amber-400" />
                About
              </p>
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-light text-white">
                Trust,
                <br />
                <span className="italic">made visible.</span>
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-serif text-2xl md:text-3xl leading-snug text-white/90 font-light italic">
              CauseSphere is a transparent, non-profit fundraising platform built to connect
              people who want to help with those who genuinely need it.
            </p>
            <p className="mt-8 text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl">
              We empower individuals and organizations to raise funds for meaningful causes
              while ensuring trust through verification, real-time tracking, and secure
              transactions. Every campaign goes through a structured approval process, and
              every donation is recorded and traceable — so you can give with confidence,
              knowing your contribution is making a real impact.
            </p>

            <div className="mt-16 grid sm:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
              {pillars.map(({ icon: Icon, label, text }, i) => (
                <div
                  key={label}
                  className="bg-zinc-950 p-8 group hover:bg-zinc-900 transition-colors duration-500"
                >
                  <div className="flex items-center gap-3 mb-6">
                    {/* <span className="text-amber-400 text-xs font-serif">0{i + 1}</span> */}
                    <Icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-3">{label}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};