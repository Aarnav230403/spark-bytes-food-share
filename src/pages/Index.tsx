import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import ImpactStats from "@/components/ImpactStats";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {

  useEffect(() => { //sets tab header on browser to terriertable
    document.title = "TerrierTable";
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <ImpactStats />
      <Team />
      <Footer />
    </main>
  );
};

export default Index;
