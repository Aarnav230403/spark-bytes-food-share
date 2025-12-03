import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BellRing, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Image served from project root; Vite serves it at "/Dining Hall.jpg"

const heroStats = [
  { value: "12", label: "live events on campus" },
  { value: "500+", label: "meals shared" },
  { value: "10+", label: "clubs joined" },
];

const Hero = () => {
    const navigate = useNavigate();
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadCount = async () => {
      const res = await supabase.from("events").select("*", { count: "exact", head: true });
      if (!mounted) return;
      setEventsCount(res.count ?? 0);
    };
    loadCount();
    const interval = setInterval(loadCount, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    init();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleBrowseNow = () => {
    if (isAuthenticated) {
      navigate("/homepage");
    } else {
      navigate("/auth");
    }
  };
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
            
           <div className="mt-10 flex items-center justify-center gap-6">
              <div className="bg-white/10 rounded-2xl px-10 py-8 text-white backdrop-blur flex flex-col items-center justify-center min-w-[220px] h-full">
                <div className="text-4xl font-bold">{eventsCount}</div>
                <div className="text-sm text-white/80 uppercase tracking-wide mt-2">live events on campus</div>
              </div>
              </div>
                <Button
                onClick={handleBrowseNow}
              className="bg-white/10 rounded-2xl px-10 py-8 text-white backdrop-blur flex flex-col items-center justify-center min-w-[220px] h-full"               
               > Join Us Now!
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
    </section>
  );
};

export default Hero;
