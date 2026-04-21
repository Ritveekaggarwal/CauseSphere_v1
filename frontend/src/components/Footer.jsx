export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="mx-auto max-w-400 px-6 md:px-12 py-20 grid md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-2 w-2 bg-amber-400" />
            <span className="font-serif text-2xl text-white">
              CauseSphere<span className="text-amber-400">.</span>
            </span>
          </div>
          <p className="font-serif italic text-xl md:text-2xl text-white/80 max-w-md leading-snug font-light">
            A mission-driven platform turning compassion into measurable, traceable,
            human action.
          </p>
          <p className="mt-6 text-sm text-zinc-400 max-w-md leading-relaxed">
            We connect verified causes with the people ready to answer them — with
            transparency at the centre of every story.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <div className="text-[10px] tracking-widest uppercase text-amber-400 mb-6">
            Navigate
          </div>
          <ul className="space-y-3 text-sm text-zinc-400">
            {[
              { label: "About", href: "#about" },
              { label: "Impact", href: "#impact" },
              { label: "Discover", href: "#discover" },
              { label: "Start a Campaign", href: "#start" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="hover:text-white hover:pl-2 transition-all duration-300 inline-block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <div className="text-[10px] tracking-widests uppercase text-amber-400 mb-6 tracking-widest">
            Connect
          </div>
          <ul className="space-y-3 text-sm text-zinc-400">
            {["Instagram", "Twitter"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-white hover:pl-2 transition-all duration-300 inline-block"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="mx-auto max-w-400 px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-widest uppercase text-zinc-500">
          <span>© {new Date().getFullYear()} CauseSphere Foundation</span>
          <span className="text-amber-400">Compassion, made traceable.</span>
        </div>
      </div>
    </footer>
  );
};