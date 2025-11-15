import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ManagedEvent } from "@/types/events";
import { mockManagedEvents } from "@/data/mockManagedEvents";

export default function MyEventsDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ManagedEvent[]>(mockManagedEvents);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ManagedEvent | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string>("all");

  const campuses = ["all", "Central Campus", "West Campus", "East Campus", "South Campus"];

  // Helper function to determine if an event is past
  const isPastEvent = (event: ManagedEvent): boolean => {
    try {
      // Parse date like "Fri, Nov 21" - we'll extract the day and month
      // For simplicity, we'll check if the event date string contains a date that's before today
      // This is a simplified check - in production you'd want more robust date parsing
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // Try to parse the date - format is "Day, Mon DD" like "Fri, Nov 21"
      const dateMatch = event.date.match(/(\w+),?\s+(\w+)\s+(\d+)/);
      if (!dateMatch) return false;
      
      const monthName = dateMatch[2];
      const day = parseInt(dateMatch[3]);
      
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      const month = monthMap[monthName];
      if (month === undefined) return false;
      
      // Check if the event has passed by comparing the date and end time
      const eventDate = new Date(currentYear, month, day);
      
      // Also check the end time from pickupWindow (format: "10:00 PM – 11:30 PM")
      const timeMatch = event.pickupWindow.match(/(\d+):(\d+)\s*(AM|PM)\s*–\s*(\d+):(\d+)\s*(AM|PM)/);
      if (timeMatch) {
        let endHour = parseInt(timeMatch[4]);
        const endMin = parseInt(timeMatch[5]);
        const endPeriod = timeMatch[6];
        
        if (endPeriod === 'PM' && endHour !== 12) endHour += 12;
        if (endPeriod === 'AM' && endHour === 12) endHour = 0;
        
        eventDate.setHours(endHour, endMin, 0, 0);
      }
      
      return eventDate < today;
    } catch {
      // If parsing fails, assume it's current
      return false;
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by campus if needed
    if (selectedCampus !== "all") {
      filtered = events.filter((event) => event.campus === selectedCampus);
    }
    
    // Sort: current events first, then past events
    return [...filtered].sort((a, b) => {
      const aIsPast = isPastEvent(a);
      const bIsPast = isPastEvent(b);
      
      // If one is past and one is current, current comes first
      if (aIsPast && !bIsPast) return 1;
      if (!aIsPast && bIsPast) return -1;
      
      // If both are same status, maintain original order
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

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== eventId));
    }
  };

  const handleSubmit = (eventData: Omit<ManagedEvent, "id" | "spotsTaken">) => {
    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id
            ? { ...eventData, id: editingEvent.id, spotsTaken: editingEvent.spotsTaken }
            : e
        )
      );
    } else {
      // Create new event
      const newEvent: ManagedEvent = {
        ...eventData,
        id: `event-${Date.now()}`,
        spotsTaken: 0,
      };
      setEvents([...events, newEvent]);
    }
    setFormOpen(false);
    setEditingEvent(null);
  };

  const clearFilters = () => {
    setSelectedCampus("all");
  };

  const hasActiveFilters = selectedCampus !== "all";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {/* Header */}
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

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
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
              </div>
            )}
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <Card className="bg-white border border-slate-200">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-12">
                  {events.length === 0
                    ? "You haven't created any events yet. Click 'Create Event' to get started."
                    : "No events match your filters."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-muted-foreground">
                  Showing {filteredEvents.length} of {events.length} events
                </p>
              </div>

              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            {isPastEvent(event) ? (
                              <Badge variant="secondary" className="flex items-center gap-1 bg-slate-200 text-slate-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Past
                              </Badge>
                            ) : (
                              <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-700 border-green-300">
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
                                {event.spotsTaken} / {event.spotsTotal} spots
                              </span>
                            </div>
                            <span className="text-muted-foreground">Host: {event.hostClub}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            className="w-full"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Link to={`/my-events/${event.id}`}>
                            <Button variant="default" size="sm" className="w-full bg-red-600 text-white hover:bg-red-700">
                              View Reservations
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="w-full text-destructive hover:text-destructive"
                          >
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

      {/* Create/Edit Form Dialog */}
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

