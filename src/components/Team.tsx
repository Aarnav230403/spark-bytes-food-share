import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

const teamMembers = [
  { name: "Aarnav Prakash", role: "Product Lead", initials: "AP" },
  { name: "Angelie Darbouze", role: "Front End Engineer and UX/UI Designer", initials: "AD" },
  { name: "Gina Carpenter", role: "Front End Engineering and UX/UI Designer", initials: "GC" },
  { name: "Yicheng Wang", role: "Backend Engineer", initials: "YW" },
  { name: "Khaleel Nafiu", role: "Backend Engineer", initials: "KN" },
];

const Team = () => {
  return (
    <section id="team" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-6 py-3 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Built with BU Spark!</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet the Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A passionate group of BU students building technology for our community
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* First Row - 3 items */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {teamMembers.slice(0, 3).map((member, index) => (
              <Card 
                key={index}
                className="p-6 text-center hover:shadow-card-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {member.name}
                </h3>
                
                <p className="text-muted-foreground">
                  {member.role}
                </p>
              </Card>
            ))}
          </div>
          
          {/* Second Row - 2 items centered */}
          <div className="flex justify-center gap-8">
            {teamMembers.slice(3).map((member, index) => (
              <Card 
                key={index + 3}
                className="p-6 text-center hover:shadow-card-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border-0 w-full max-w-sm"
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {member.name}
                </h3>
                
                <p className="text-muted-foreground">
                  {member.role}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground italic">
            Spark Bytes is a student project developed through BU Spark!, Boston University's innovation program
          </p>
        </div>
      </div>
    </section>
  );
};

export default Team;
