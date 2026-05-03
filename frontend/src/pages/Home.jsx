import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Impact } from "../components/Impact";
import { Discover } from "../components/Discover";
// import { StartCampaign } from "../components/start_a_campaign";
import { Start_a_Campaign } from "../components/start_a_campaign";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation(); // ✅ ADD THIS

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-zinc-950 min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Impact />
        <Discover />
        <Start_a_Campaign />
      </main>
      <Footer />
    </div>
  );
}

export default Home;