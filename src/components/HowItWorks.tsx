import { Upload, Bell, Utensils } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Upload,
    title: "Post Leftovers",
    description: "Dining halls, clubs, and orgs instantly post extra food after events",
    color: "bg-primary",
  },
  {
    icon: Bell,
    title: "Get Alerts",
    description: "Nearby students receive real-time notifications to swing by",
    color: "bg-secondary",
  },
  {
    icon: Utensils,
    title: "Enjoy Free Food",
    description: "Grab a bite, meet new people, and reduce waste together",
    color: "bg-primary-light",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Post leftovers → get alerts → enjoy free food
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="p-8 text-center hover:shadow-card-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border-0 bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <step.icon className="h-10 w-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-lg">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
