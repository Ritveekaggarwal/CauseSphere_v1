import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = ["About", "Impact", "Discover", "Start a Campaign"];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/60 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto max-w-400 px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="h-2 w-2 bg-amber-400 group-hover:scale-150 transition-transform duration-300" />
          <span className="font-serif text-2xl font-medium tracking-tight text-white">
            CAUSESPHERE<span className="text-amber-400">.</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-sm tracking-widest uppercase text-zinc-400 hover:text-white transition-colors duration-300 group"
            >
              {/* <span className="text-amber-400 mr-2 text-[10px] opacity-60">
                0{i + 1}
              </span> */}
              {item}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-amber-400 transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="#donate"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-zinc-950 text-xs tracking-widest uppercase font-bold hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.4)] transition-all duration-500 hover:scale-[1.03]"
          >
            GET STARTED
            <span className="h-px w-6 bg-zinc-950" />
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-800 animate-[fadeIn_0.2s_ease]">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {navItems.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="text-sm tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
              >
                <span className="text-amber-400 mr-2 text-[10px]">0{i + 1}</span>
                {item}
              </a>
            ))}
            <a
              href="#donate"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-6 py-3 bg-amber-400 text-zinc-950 text-xs tracking-widest uppercase font-bold"
            >
              Donate
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};