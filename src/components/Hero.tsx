import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BellRing, Users } from "lucide-react";
import { Link } from "react-router-dom";
// Image served from project root; Vite serves it at "/Dining Hall.jpg"

const heroStats = [
  { value: "12 live", label: "events on campus" },
  { value: "500+", label: "meals shared" },
  { value: "10+", label: "clubs joined" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-foreground/5"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/10 text-white rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <BellRing className="h-4 w-4" />
              Real-time leftovers from BU clubs & dining halls
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Reduce food waste while discovering free meals around campus.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              TerrierTable alerts students the moment events end with extra food. Grab a plate, meet new people, and help BU cut down on waste with every serving you claim.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/homepage">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-card-lg text-lg px-8 py-6 h-auto"
                >
                  Browse live events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6 h-auto"
                >
                  <Play className="mr-2 h-5 w-5" />
                  See how it works
                </Button>
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {heroStats.map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-2xl px-6 py-4 text-white backdrop-blur">
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-white/80 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
              <div className="bg-white/10 rounded-2xl px-6 py-4 text-white backdrop-blur flex items-center gap-3">
                <Users className="h-8 w-8" />
                <div>
                  <p className="text-lg font-semibold">Powered by BU clubs</p>
                  <p className="text-white/80 text-sm">Student-led & community first</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-card-lg">
              <img 
                src="/Dining Hall.jpg" 
                alt="Students sharing food on campus" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card-lg p-6 animate-fade-in-up">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Meals Shared</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-secondary rounded-2xl shadow-card-lg p-6 animate-fade-in-up">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-white/90">Clubs Joined</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
