import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Users, Filter, X, Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import Header from "@/components/header";
import MyEventForm from "@/components/MyEventForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { ManagedEvent } from "@/types/events";

export default function MyEventsDashboard() {
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ManagedEvent | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const campuses = ["all", "Central Campus", "West Campus", "East Campus", "South Campus"];

  useEffect(() => {
    async function fetchMyEvents() {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User not logged in:", userError);
        setEvents([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("created_by", user.id)
        .order("date", { ascending: true });

      if (error) console.error("Error fetching events:", error);
      else setEvents(data as ManagedEvent[]);

      setLoading(false);
    }

    fetchMyEvents();
  }, []);

  const handleSubmit = async (eventData: Omit<ManagedEvent, "id" | "spotsTaken">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update({
          ...eventData,
        })
        .eq("id", editingEvent.id)
        .eq("created_by", user.id);

      if (error) console.error("Update failed:", error);
      else {
        setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...eventData } : e)));
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert([{ ...eventData, created_by: user.id, spotsTaken: 0 }])
        .select();

      if (error) console.error("Insert failed:", error);
      else if (data) setEvents([...events, data[0]]);
    }

    setFormOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const { error } = await supabase.from("events").delete().eq("id", eventId);
      if (error) console.error("Delete failed:", error);
      else setEvents(events.filter((e) => e.id !== eventId));
    }
  };

  const isPastEvent = (event: ManagedEvent): boolean => {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const dateMatch = event.date.match(/(\w+),?\s+(\w+)\s+(\d+)/);
      if (!dateMatch) return false;
      const monthName = dateMatch[2];
      const day = parseInt(dateMatch[3]);
      const monthMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      const month = monthMap[monthName];
      const eventDate = new Date(currentYear, month, day);
      return eventDate < today;
    } catch {
      return false;
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedCampus !== "all") {
      filtered = events.filter((event) => event.campus === selectedCampus);
    }
    return [...filtered].sort((a, b) => {
      const aIsPast = isPastEvent(a);
      const bIsPast = isPastEvent(b);
      if (aIsPast && !bIsPast) return 1;
      if (!aIsPast && bIsPast) return -1;
      return 0;
    });
  }, [events, selectedCampus]);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const handleEditEvent = (event: ManagedEvent) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const clearFilters = () => setSelectedCampus("all");
  const hasActiveFilters = selectedCampus !== "all";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Events</h1>
              <p className="text-muted-foreground">
                Manage events you host on Spark Bytes. Create, update, and track reservations in one place.
              </p>
            </div>
            <Button onClick={handleCreateEvent} className="bg-red-600 text-white hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </div>
              <div className="flex-1">
                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All campuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus} value={campus}>
                        {campus === "all" ? "All campuses" : campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-12">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <Card className="bg-white border border-slate-200">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-12">
                  You haven't created any events yet. Click 'Create Event' to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">
                Showing {filteredEvents.length} of {events.length} events
              </p>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            {isPastEvent(event) ? (
                              <Badge variant="secondary" className="bg-slate-200 text-slate-700 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Past
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Current
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mb-3">{event.description}</CardDescription>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{event.pickupWindow}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <Badge variant="outline">{event.campus}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {event.spotsTaken || 0} / {event.spotsTotal} spots
                              </span>
                            </div>
                            <span className="text-muted-foreground">Host: {event.hostClub}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Link to={`/my-events/${event.id}`}>
                            <Button variant="default" size="sm" className="bg-red-600 text-white hover:bg-red-700">
                              View Reservations
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <MyEventForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSubmit}
        event={editingEvent}
      />
    </>
  );
}
