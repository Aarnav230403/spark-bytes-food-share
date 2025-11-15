import { useState, useMemo } from "react";
import { Clock, MapPin, Users, Calendar, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import EventDetail from "../components/EventDetail";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Event = {
  id: number;
  title: string;
  location: string;
  pickupWindow: string;
  campus: string;
  dietary: string;
  food: string;
  date: string;
  spotsLeft: number;
  host: string;
  description: string;
};

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Midnight Munchies @ CDS",
    location: "CDS",
    pickupWindow: "10:00 PM – 11:30 PM",
    campus: "Central Campus",
    dietary: "Gluten Free, Vegetarian options",
    food: "Pasta bar, salad bowls, cookies",
    date: "Fri, Nov 21",
    spotsLeft: 18,
    host: "BU Dining",
    description: "Late night study fuel — grab a warm meal before your grind at Mugar.",
  },
  {
    id: 2,
    title: "CS Study Night Snacks",
    location: "HTC",
    pickupWindow: "6:00 PM – 7:30 PM",
    campus: "West Campus",
    dietary: "None specified",
    food: "Pizza (120), chips, sodas",
    date: "Thu, Nov 20",
    spotsLeft: 42,
    host: "CS Ambassadors",
    description: "Drop in, grab a slice, and work on your psets with other CS students.",
  },
  {
    id: 3,
    title: "Book Club Coffee & Pastries",
    location: "GSU Backcourt",
    pickupWindow: "9:00 AM – 10:30 AM",
    campus: "Central Campus",
    dietary: "Vegan options",
    food: "Croissants, muffins, drip coffee, tea",
    date: "Sat, Nov 22",
    spotsLeft: 9,
    host: "BU Book Club",
    description: "Casual morning meetup with light breakfast and conversation.",
  },
  {
    id: 4,
    title: "Club Sports Post-Game Bites",
    location: "Nickerson Field Gate C",
    pickupWindow: "4:30 PM – 5:15 PM",
    campus: "West Campus",
    dietary: "Gluten Free, Dairy Free options",
    food: "Wraps, fruit cups, Gatorade",
    date: "Sun, Nov 23",
    spotsLeft: 25,
    host: "Club Sports Council",
    description: "Refuel after your game with quick grab-and-go snacks.",
  },
];

// Helper function to convert mock event format to EventDetail expected format
function convertEventForDetail(event: Event) {
  const [startTime, endTime] = event.pickupWindow.split(" – ");

  // Parse food items - expects format like "Pizza (120), chips, sodas"
  const foodItems = event.food.split(", ").map((item) => {
    const match = item.match(/^(.+?)\s*\((\d+)\)$/);
    if (match) {
      return { name: match[1].trim(), qty: parseInt(match[2]) };
    }
    // Default quantity of 10 if not specified
    return { name: item.trim(), qty: 10 };
  });

  // Parse dietary restrictions
  const dietaryArray = event.dietary === "None specified"
    ? []
    : event.dietary.split(", ").map(d => d.trim());

  return {
    id: event.id,
    title: event.title,
    location: event.location,
    start_time: startTime || "",
    end_time: endTime || "",
    campus: [event.campus],
    dietary: dietaryArray,
    food_items: foodItems,
    notes: event.description,
  };
}

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [selectedDietary, setSelectedDietary] = useState<string>("all");

  const campuses = ["all", "Central Campus", "West Campus", "East Campus", "South Campus"];
  const dietaryOptions = [
    "all",
    "Gluten Free",
    "Vegetarian",
    "Vegan",
    "Dairy Free",
  ];

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCampus = selectedCampus === "all" || event.campus === selectedCampus;

      const matchesDietary =
        selectedDietary === "all" ||
        event.dietary.toLowerCase().includes(selectedDietary.toLowerCase());

      return matchesSearch && matchesCampus && matchesDietary;
    });
  }, [searchQuery, selectedCampus, selectedDietary]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(convertEventForDetail(event));
    setDetailOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCampus("all");
    setSelectedDietary("all");
  };

  const hasActiveFilters = searchQuery || selectedCampus !== "all" || selectedDietary !== "all";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-foreground/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                All Events
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Discover available events and connect with free food across campus.
                Browse, filter, and reserve your spot today.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{mockEvents.length} Events Available</span>
                </div>
                <Link to="/clubs" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Users className="h-5 w-5" />
                  <span>Join the Community</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Campus Filter */}
                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Campuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus} value={campus}>
                        {campus === "all" ? "All Campuses" : campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Dietary Filter */}
                <Select value={selectedDietary} onValueChange={setSelectedDietary}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Dietary" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietaryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === "all" ? "All Dietary" : option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCampus !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Campus: {selectedCampus}
                    <button
                      onClick={() => setSelectedCampus("all")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedDietary !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Dietary: {selectedDietary}
                    <button
                      onClick={() => setSelectedDietary("all")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Events Grid */}
        <section className="container mx-auto px-4 py-12">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                No events match your filters.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredEvents.length} of {mockEvents.length} events
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                    onClick={() => handleEventClick(event)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                          {event.title}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0">
                          {event.spotsLeft} spots
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{event.pickupWindow}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{event.date}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <Badge variant="secondary" className="text-xs">
                          {event.campus}
                        </Badge>
                        {event.dietary !== "None specified" && (
                          <Badge variant="outline" className="text-xs">
                            {event.dietary.split(",")[0].trim()}
                            {event.dietary.includes(",") && "..."}
                          </Badge>
                        )}
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          <span className="font-medium">Food:</span> {event.food}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-3">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Hosted by {event.host}</span>
                        </div>
                        <Button className="w-full" variant="default">
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <EventDetail
        event={selectedEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
