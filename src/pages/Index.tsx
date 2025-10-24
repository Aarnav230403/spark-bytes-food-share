import Hero from "@/components/Hero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import ImpactStats from "@/components/ImpactStats";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
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
