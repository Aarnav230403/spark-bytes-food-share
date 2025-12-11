import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Spin, Empty, message, Statistic } from "antd";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/header";
import MyEventForm from "@/components/MyEventForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart, Edit, Trash2, Eye } from "lucide-react";
import { ManagedEvent } from "@/types/events";
import CreateEventModal from "@/pages/CreateEvent";

type Event = {
    id: string;
    title: string;
    location: string;
    campus: string;
    pickupWindow: string;
    date: string;
    hostClub: string;
    spotsTotal: number;
    spotsTaken: number;
    description?: string;
    foodType?: string;
    dietaryInfo?: string[];
};

type Club = {
    id: string;
    name: string;
    logoUrl?: string;
    category: string;
    followers?: number;
};

export default function MyActivity() {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [followedClubs, setFollowedClubs] = useState<Club[]>([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [formOpen, setFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ManagedEvent | null>(null);
    const [createEventOpen, setCreateEventOpen] = useState(false);

    const fetchEvents = async (userId: string) => {
        const { data: eventsData, error: eventsError } = await supabase
            .from("events")
            .select("*")
            .eq("created_by", userId)
            .order("date", { ascending: true });

        if (eventsError) {
            console.error("Events fetch error:", eventsError);
            message.error("Failed to load your events");
        } else {
            setEvents(eventsData || []);
        }
    };

    useEffect(() => {
        const fetchActivityData = async () => {
            setLoading(true);

            // Get current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                message.error("Unable to load user information");
                setLoading(false);
                return;
            }

            const user = userData.user;
            setUserId(user.id);

            await fetchEvents(user.id);

            // TODO: Fetch followed clubs when club_followers table exists!!!
            // For now using mock data,Talk to team about this
            setFollowedClubs([]);

            // TODO: Fetch follower/following counts when followers table exists!!!
            //Talk to team about this
            setFollowerCount(0);
            setFollowingCount(0);

            setLoading(false);
        };

        fetchActivityData();
    }, []);

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event as ManagedEvent);
        setFormOpen(true);
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            const { error } = await supabase.from("events").delete().eq("id", eventId);
            if (error) {
                console.error("Delete failed:", error);
                message.error("Failed to delete event");
            } else {
                setEvents(events.filter((e) => e.id !== eventId));
                message.success("Event deleted successfully", 0.8);
            }
        }
    };

    const handleSubmit = async (eventData: Omit<ManagedEvent, "id" | "spotsTaken">) => {
        if (!userId) return;

        if (editingEvent) {
            const { error } = await supabase
                .from("events")
                .update({ ...eventData })
                .eq("id", editingEvent.id)
                .eq("created_by", userId);

            if (error) {
                console.error("Update failed:", error);
                message.error("Failed to update event");
            } else {
                setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...eventData } : e)));
                message.success("Event updated successfully", 0.8);
            }
        }

        setFormOpen(false);
        setEditingEvent(null);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex justify-center items-center bg-background">
                    <Spin size="large" />
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background py-8 px-4">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Page Title */}
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">My Activity</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="shadow-md">
                            <Statistic
                                title="Events Posted"
                                value={events.length}
                                prefix={<Calendar className="w-5 h-5 text-primary" />}
                            />
                        </Card>
                        <Card className="shadow-md">
                            <Statistic
                                title="Clubs Following"
                                value={followedClubs.length}
                                prefix={<Heart className="w-5 h-5 text-primary" />}
                            />
                        </Card>
                        <Card className="shadow-md">
                            <Statistic
                                title="Followers"
                                value={followerCount}
                                prefix={<Users className="w-5 h-5 text-primary" />}
                            />
                        </Card>
                    </div>

                    {/* Followed Clubs Section */}
                    <Card className="shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-foreground">Clubs I Follow</h2>
                            <Link to="/clubs">
                                <span className="text-primary hover:underline cursor-pointer text-sm">Browse Clubs →</span>
                            </Link>
                        </div>

                        {followedClubs.length === 0 ? (
                            <Empty
                                description="You're not following any clubs yet"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <Link to="/clubs">
                                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
                                        Discover Clubs
                                    </button>
                                </Link>
                            </Empty>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {followedClubs.map((club) => (
                                    <Link key={club.id} to={`/clubs/${club.id}`}>
                                        <Card
                                            className="hover:shadow-md transition-shadow cursor-pointer"
                                            hoverable
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-12 h-12">
                                                    <AvatarImage src={club.logoUrl} alt={club.name} />
                                                    <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground">{club.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{club.category}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* My Posted Events Section */}
                    <Card className="shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-foreground">My Posted Events</h2>
                        </div>

                        {events.length === 0 ? (
                            <Empty
                                description="You haven't posted any events yet"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <button
                                    // onClick={() => {
                                    //     // Trigger create event modal in header
                                    //     const createBtn = document.querySelector('[data-testid="create-event-btn"]') as HTMLButtonElement;
                                    //     createBtn?.click();
                                    // }}
                                    onClickCapture={() => setCreateEventOpen(true)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                                >
                                    Create Your First Event
                                </button>
                            </Empty>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <Card
                                        key={event.id}
                                        className="hover:shadow-md transition-shadow border-l-4 border-l-primary"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{event.location} {event.campus}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{event.date} {event.pickupWindow}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-medium">Host:</span> {event.hostClub}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditEvent(event)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Link to={`/my-events/${event.id}`}>
                                                        <Button variant="outline" size="sm" >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Reservations
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <MyEventForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingEvent(null);
                }}
                onSubmit={handleSubmit}
                event={editingEvent}
            />
            <CreateEventModal
                open={createEventOpen}
                onClose={() => setCreateEventOpen(false)}
                onCreated={() => { userId && fetchEvents(userId); }}
            />
        </>
    );
}