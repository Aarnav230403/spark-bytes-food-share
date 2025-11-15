import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Utensils, Clock } from "lucide-react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClubById } from "@/data/mockClubs";

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const club = id ? getClubById(id) : undefined;

  // Helper function to get initials from club name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!club) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Club not found
            </p>
            <Link to="/clubs">
              <Button variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all clubs
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  const totalEvents = club.pastEvents.length + club.upcomingEvents.length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Back Link */}
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all clubs</span>
          </Link>

          {/* Header Section */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Logo or Initials */}
              <div className="shrink-0">
                {club.logoUrl ? (
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl border-2 border-slate-200">
                    {club.shortName ? getInitials(club.shortName) : getInitials(club.name)}
                  </div>
                )}
              </div>

              {/* Club Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                    {club.name}
                  </h1>
                  <Badge variant="outline" className="shrink-0">
                    {club.category}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {club.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Campus focus: {club.campusFocus}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {club.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Follow Button */}
              <div className="shrink-0 w-full md:w-auto">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full md:w-auto bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    // Non-functional for now
                    console.log("Follow club:", club.id);
                  }}
                >
                  Follow club
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white border border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{club.followers?.toLocaleString() || 0}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{totalEvents}</div>
                    <div className="text-sm text-muted-foreground">Events hosted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{club.upcomingEvents.length}</div>
                    <div className="text-sm text-muted-foreground">Upcoming events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Events Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Upcoming Spark Bytes Events</h2>
            {club.upcomingEvents.length === 0 ? (
              <Card className="bg-white border border-slate-200">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    This club doesn't have any upcoming events yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {club.upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-white border border-slate-200 hover:shadow-md transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Utensils className="h-4 w-4" />
                          <span>{event.food}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Non-functional for now, could link to event detail page later
                          console.log("View event:", event.id);
                        }}
                      >
                        View event
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Past Events Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Past events</h2>
            {club.pastEvents.length === 0 ? (
              <Card className="bg-white border border-slate-200">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    This club doesn't have any past events yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {club.pastEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Utensils className="h-3 w-3" />
                              <span>{event.food}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Non-functional for now
                            console.log("View past event:", event.id);
                          }}
                        >
                          View details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

