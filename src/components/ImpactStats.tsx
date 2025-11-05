import { TrendingUp } from "lucide-react";

const stats = [
  { value: "500+", label: "Meals Shared" },
  { value: "10+", label: "Clubs Onboarded" },
  { value: "1000+", label: "Active Students" },
  { value: "50%", label: "Food Waste Reduced" },
];

const ImpactStats = () => {
  return (
    <section className="py-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-3 mb-6 backdrop-blur-sm">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Real Impact at BU</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Turning leftovers into meaningful moments
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join BU students reducing waste and building a more connected, inclusive campus
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-white/90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
