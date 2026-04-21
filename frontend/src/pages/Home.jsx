import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Impact } from "../components/Impact";
import { Discover } from "../components/Discover";
import { StartCampaign } from "../components/start_a_campaign";
import { Footer } from "../components/Footer";

function Home() {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Impact />
        <Discover />
        <StartCampaign />
      </main>
      <Footer />
    </div>
  );
}

export default Home; 