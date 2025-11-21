// page to test code adding direct pulls from preferences on profile page
// campus works but having issues with dietary restrictions being an array,
// need to change the way they are held in supabase?
// 

import { useEffect, useMemo, useState } from "react";
import { Clock, MapPin, Users, Calendar, Filter, X } from "lucide-react";
import Header from "../components/header";
import EventDetail from "../components/EventDetail";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { supabase } from "../lib/supabaseClient";

type DbEvent = {
  id: number;
  title: string;
  location: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  campus: string | string[] | null;
  dietary: string | string[] | null;
  food_items: { name: string; qty: number }[] | null;
  created_by: string | null;
};

type DetailEvent = {
  id: number;
  title: string;
  location: string;
  start_time: string;
  end_time: string;
  campus: string[];
  dietary: string[];
  food_items: { name: string; qty: number }[];
  notes?: string;
};

export default function HomePage() {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<DetailEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [selectedDietary, setSelectedDietary] = useState<string>("all");

  const [profileCampusPreference, setProfileCampusPreference] =
    useState<string>("all");

  const campuses = [
    "all",
    "Central Campus",
    "West Campus",
    "East Campus",
    "South Campus",
    "Fenway Campus",
    "Medical Campus",
  ];

  const dietaryOptions = [
    "all",
    "Vegan",
    "Gluten Free",
    "Vegetarian",
    "Halal",
    "Kosher",
    "Nut Free",
    "Shellfish",
  ];

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error loading events:", error);
      } else {
        setEvents((data || []) as DbEvent[]);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    async function loadProfilePreferences() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn("No user found for preferences:", userError);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("campus_preference")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.warn("Could not load profile preferences:", profileError);
        return;
      }

      const campusPref =
        (profile?.campus_preference as string | null) || "all";
      setProfileCampusPreference(campusPref);
      setSelectedCampus(campusPref);
    }

    loadProfilePreferences();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const title = event.title?.toLowerCase() || "";
      const location = event.location?.toLowerCase() || "";

      const campusStr = Array.isArray(event.campus)
        ? event.campus.join(", ")
        : event.campus || "";

      const dietaryStr = Array.isArray(event.dietary)
        ? event.dietary.join(", ")
        : event.dietary || "";

      const matchesSearch =
        title.includes(searchQuery.toLowerCase()) ||
        location.includes(searchQuery.toLowerCase());

      const matchesCampus =
        selectedCampus === "all" ||
        campusStr.toLowerCase().includes(selectedCampus.toLowerCase());

      const matchesDietary =
        selectedDietary === "all" ||
        dietaryStr.toLowerCase().includes(selectedDietary.toLowerCase());

      return matchesSearch && matchesCampus && matchesDietary;
    });
  }, [events, searchQuery, selectedCampus, selectedDietary]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCampus(profileCampusPreference || "all");
    setSelectedDietary("all");
  };

  const hasActiveFilters =
    !!searchQuery || selectedCampus !== "all" || selectedDietary !== "all";

  function convertEventForDetail(event: DbEvent): DetailEvent {
    const campusArray = Array.isArray(event.campus)
      ? event.campus
      : typeof event.campus === "string"
      ? event.campus
          .replace(/[{}"]/g, "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const dietaryArray = Array.isArray(event.dietary)
      ? event.dietary
      : typeof event.dietary === "string"
      ? event.dietary
          .replace(/[{}"]/g, "")
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      : [];

    return {
      id: event.id,
      title: event.title,
      location: event.location,
      start_time: event.start_time || "",
      end_time: event.end_time || "",
      campus: campusArray,
      dietary: dietaryArray,
      food_items: event.food_items || [],
      notes: "",
    };
  }

  const handleEventClick = (event: DbEvent) => {
    try {
      const detailEvent = convertEventForDetail(event);
      setSelectedEvent(detailEvent);
      setDetailOpen(true);
    } catch (err) {
      console.error("Error opening event:", err);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative bg-gradient-hero text-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-foreground/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                All Events
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Discover available events and connect with free food across
                campus. Browse, filter, and reserve your spot today.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {loading
                      ? "Loading events..."
                      : `${filteredEvents.length} Events Available`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 筛选区 */}
        <section className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Select
                  value={selectedCampus}
                  onValueChange={setSelectedCampus}
                >
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

                <Select
                  value={selectedDietary}
                  onValueChange={setSelectedDietary}
                >
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
          </div>
        </section>

        {/* Event Cards */}
        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                No events match your filters.
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {filteredEvents.length} of {events.length} events
              </p>
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
                          {event.date || "TBA"}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {Array.isArray(event.campus)
                          ? event.campus.join(", ")
                          : event.campus}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>
                          {event.start_time} – {event.end_time}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {event.campus && (
                          <Badge variant="secondary" className="text-xs">
                            {Array.isArray(event.campus)
                              ? event.campus[0]
                              : typeof event.campus === "string"
                              ? event.campus
                                  .replace(/[{}"]/g, "")
                                  .split(",")[0]
                              : ""}
                          </Badge>
                        )}
                        {event.dietary && (
                          <Badge variant="outline" className="text-xs">
                            {Array.isArray(event.dietary)
                              ? event.dietary[0]
                              : typeof event.dietary === "string"
                              ? event.dietary
                                  .replace(/[{}"]/g, "")
                                  .split(",")[0]
                              : ""}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-3">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Tap to view details & reserve</span>
                          <Users className="h-4 w-4" />
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
