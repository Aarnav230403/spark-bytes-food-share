import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleBrowseNow = () => {
    if (isAuthenticated) navigate("/homepage");
    else navigate("/auth");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-foreground/5"></div>

      <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center text-center gap-10">
        {/* Text */}
        <div className="animate-fade-in max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight mt-10 mb-6">
            Reduce food waste while discovering free meals around campus.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            TerrierTable alerts students the moment events end with extra food. Grab a plate, meet new people, and help BU cut down on waste with every serving you claim.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleBrowseNow}
          className="bg-white/10 rounded-2xl px-10 py-8 text-white backdrop-blur flex flex-col items-center justify-center min-w-[220px] hover:bg-white/20 transition mb-8"
        >
          <div className="text-4xl font-bold">{eventsCount} Live Events</div>
          <div className="text-sm text-white/80 uppercase tracking-wide mt-2">Click Here to Join Us Now!</div>
        </button>

        {/* Hero Image */} <div className="relative animate-scale-in"> 
          <div className="relative rounded-3xl overflow-hidden shadow-card-lg"> 
            <img src="/Dining Hall.jpg" alt="Students sharing food on campus" className="w-full h-auto object-cover" /> 
            </div> {/* Floating Stats */} 
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
