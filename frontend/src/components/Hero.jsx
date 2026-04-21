import { useEffect, useState } from "react";

// Import your images from assets folder
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";

const slides = [
    {
        image: img3,
        eyebrow: "Chapter 01 — The Unseen",
        title: ["Behind every silence,", "a story waits."],
        subtitle:
            "Millions of children carry pain the world refuses to look at. Your eyes meeting theirs — even through a screen — is the first act of refusing to look away.",
        stat: { value: "385M", label: "children living in extreme poverty" },
    },
    {
        image: img5,
        eyebrow: "Chapter 02 — Childhood",
        title: ["A child does not", "choose illness."],
        subtitle:
            "No child should fight for breath, for medicine, for tomorrow. A single act of giving can hand back what illness tries to take — time, hope, and the right to grow up.",
        stat: { value: "1 in 5", label: "children lack basic healthcare" },
    },
    {
        image: img2,
        eyebrow: "Chapter 03 — Dignity",
        title: ["No one is born", "into nothing."],
        subtitle:
            "Poverty is not a verdict — it is a circumstance waiting to be interrupted. With shelter, with clothing, with food, dignity returns. And with dignity, everything becomes possible.",
        stat: { value: "700M", label: "people live on less than $2 a day" },
    },
    {
        image: img1,
        eyebrow: "Chapter 04 — The Wild",
        title: ["The voiceless", "still speak."],
        subtitle:
            "Every twenty minutes, another species fades into silence. The wild does not ask to be saved — it asks only to be seen, defended, and remembered before it is gone.",
        stat: { value: "1M", label: "species at risk of extinction" },
    },
    {
        image: img4,
        eyebrow: "Chapter 05 — The Earth",
        title: ["The land does", "not forget."],
        subtitle:
            "Every cracked field, every dying tree, every burned forest is a question the earth asks of us. The answer is not in words — it is in the small, daily choice to act.",
        stat: { value: "10M ha", label: "of forest lost each year" },
    },
];

export const Hero = () => {
    const [index, setIndex] = useState(0);
    const [animKey, setAnimKey] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
            setAnimKey((k) => k + 1);
        }, 7000);
        return () => clearInterval(id);
    }, []);

    const slide = slides[index];

    return (
        <section className="relative h-screen min-h-190 w-full overflow-hidden bg-zinc-950">
            {/* Slideshow images */}
            {slides.map((s, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1800 ease-out ${i === index ? "opacity-100" : "opacity-0"
                        }`}
                    aria-hidden={i !== index}
                >
                    <img
                        src={s.image}
                        alt=""
                        className="h-full w-full object-cover grayscale"
                        style={
                            i === index
                                ? {
                                    animation: "kenBurns 7s ease-out forwards",
                                }
                                : {}
                        }
                    />
                </div>
            ))}

            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-zinc-950/30 pointer-events-none" />

            {/* Vertical gold guide lines */}
            <div className="absolute inset-y-0 left-[8%] w-px bg-amber-400/15 hidden md:block" />
            <div className="absolute inset-y-0 right-[8%] w-px bg-amber-400/15 hidden md:block" />
            <div className="absolute inset-y-0 left-[50%] w-px bg-white/5 hidden lg:block" />

            {/* Corner markers */}
            <div className="absolute top-28 left-[8%] hidden md:block">
                <div className="h-2 w-2 bg-amber-400" />
            </div>
            <div className="absolute bottom-28 right-[8%] hidden md:block">
                <div className="h-2 w-2 bg-amber-400" />
            </div>

            {/* Vertical social rail */}
            <div className="absolute left-6 bottom-30 z-20  hidden lg:flex flex-col items-center gap-6">
                <div className="h-16 w-px bg-white/30" />
                <div className="flex flex-col gap-4 text-[10px] tracking-widest uppercase text-zinc-500">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="[writing-mode:vertical-rl] hover:text-amber-400 transition-colors"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="[writing-mode:vertical-rl] hover:text-amber-400 transition-colors"
                    >
                        Twitter
                    </a>
                </div>
                <div className="h-16 w-px bg-white/30" />

            </div>

            {/* Main content */}
            <div className="relative z-10 h-full mx-auto max-w-400 px-6 md:px-12 flex items-center">
                <div className="max-w-3xl pt-24 md:pt-0 md:pl-[5%]">
                    {/* Eyebrow */}
                    {/* <p
            key={`eyebrow-${animKey}`}
            className="text-[10px] tracking-[0.25em] uppercase text-amber-400 mb-6 opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards" }}
          >
            {slide.eyebrow}
          </p> */}

                    {/* Headline */}
                    <h1
                        key={`title-${animKey}`}
                        className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] leading-[0.95] font-light text-white opacity-0"
                        style={{ animation: "fadeUp 0.8s ease 0.1s forwards" }}
                    >
                        {slide.title[0]}
                        <br />
                        <span className="italic font-normal">{slide.title[1]}</span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        key={`sub-${animKey}`}
                        className="mt-8 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed opacity-0"
                        style={{ animation: "fadeUp 0.8s ease 0.2s forwards" }}
                    >
                        {slide.subtitle}
                    </p>

                    {/* CTA buttons */}
                    <div
                        key={`cta-${animKey}`}
                        className="mt-10 flex items-center gap-4 opacity-0"
                        style={{ animation: "fadeUp 0.8s ease 0.35s forwards" }}
                    >
                        {/* <a
              href="#donate"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 text-zinc-950 text-xs tracking-widest uppercase font-bold hover:bg-amber-300 hover:shadow-[0_0_32px_rgba(251,191,36,0.45)] transition-all duration-500 hover:scale-[1.03]"
            >
              Donate Now
              <span className="h-px w-6 bg-zinc-950" />
            </a>
            <a
              href="#causes"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-xs tracking-widest uppercase font-semibold hover:border-amber-400/50 hover:text-amber-400 transition-all duration-500"
            >
              Our Causes
            </a> */}
                    </div>
                </div>

                {/* Right-side stat panel */}
                <div className="hidden xl:flex absolute right-[10%] bottom-32 flex-col items-end max-w-xs">
                    <div
                        key={`stat-${animKey}`}
                        className="border-l-2 border-amber-400 pl-6 opacity-0"
                        style={{ animation: "fadeUp 0.8s ease 0.4s forwards" }}
                    >
                        <div className="font-serif text-6xl text-white font-light leading-none">
                            {slide.stat.value}
                        </div>
                        <div className="mt-3 text-xs tracking-widest uppercase text-zinc-400 max-w-50">
                            {slide.stat.label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom controls bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 backdrop-blur-sm bg-zinc-950/30">
                <div className="mx-auto max-w-400 px-6 md:px-12 py-5 flex items-center justify-between">
                    {/* Slide indicators */}
                    <div className="flex items-center gap-6">
                        <span className="font-serif text-2xl text-amber-400 leading-none">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setIndex(i);
                                        setAnimKey((k) => k + 1);
                                    }}
                                    aria-label={`Slide ${i + 1}`}
                                    className={`h-px transition-all duration-500 ${i === index
                                            ? "w-12 bg-amber-400"
                                            : "w-6 bg-white/30 hover:bg-white/60"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="font-serif text-sm text-zinc-500 leading-none">
                            / {String(slides.length).padStart(2, "0")}
                        </span>
                    </div>

                    {/* <div className="hidden md:flex items-center gap-4 text-[10px] tracking-widest uppercase text-zinc-500">
            <span className="h-px w-8 bg-white/30" />
            Scroll to discover
          </div> */}
                </div>
            </div>

            {/* Ken Burns + fadeUp keyframes */}
            <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};