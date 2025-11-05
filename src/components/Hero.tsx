import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
// Image served from project root; Vite serves it at "/Dining Hall.jpg"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-foreground/5"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Reduce food waste. Build community. Enjoy free food.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              Built by BU students, Spark Bytes connects dining halls, clubs, and orgs with nearby students when there are leftover meals after events. Get real-time alerts, swing by, and turn extra food into meaningful moments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-card-lg text-lg px-8 py-6 h-auto"
                >
                  Join the Beta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6 h-auto"
              >
                <Play className="mr-2 h-5 w-5" />
                How It Works
              </Button>
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
