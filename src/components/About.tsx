import { Leaf, Users, Heart } from "lucide-react";

const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            TerrierTable is a BU student-built platform that reduces food waste and builds community by connecting students with leftover meals on campus. 
            Dining halls, clubs, and student organizations can instantly post when they have extra food after events — and nearby students get real-time alerts to swing by, grab a free bite, and make new connections.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Sustainability</h3>
              <p className="text-muted-foreground">Fight food waste on campus, one meal at a time</p>
            </div>
            
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">Bring students together through spontaneous shared meals</p>
            </div>
            
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Impact</h3>
              <p className="text-muted-foreground">Create a more connected and inclusive BU experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
