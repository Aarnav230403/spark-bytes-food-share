import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Spin, Empty, message, Statistic } from "antd";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Heart } from "lucide-react";

type Event = {
    id: string;
    title: string;
    location: string;
    campus: string;
    pickup_window: string;
    date: string;
    host_club: string;
    spots_total: number;
    spots_taken: number;
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

            // Fetch events created by this user
            const { data: eventsData, error: eventsError } = await supabase
                .from("events")
                .select("*")
                .eq("created_by", user.id)
                .order("date", { ascending: true });

            if (eventsError) {
                console.error("Events fetch error:", eventsError);
                message.error("Failed to load your events");
            } else {
                setEvents(eventsData || []);
            }

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
                            <Link to="/my-events">
                                <span className="text-primary hover:underline cursor-pointer text-sm">Manage Events →</span>
                            </Link>
                        </div>

                        {events.length === 0 ? (
                            <Empty
                                description="You haven't posted any events yet"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            >
                                <button
                                    onClick={() => {
                                        // Trigger create event modal in header
                                        const createBtn = document.querySelector('[data-testid="create-event-btn"]') as HTMLButtonElement;
                                        createBtn?.click();
                                    }}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                                >
                                    Create Your First Event
                                </button>
                            </Empty>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <Link key={event.id} to={`/my-events/${event.id}`}>
                                        <Card
                                            className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary"
                                            hoverable
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{event.location} • {event.campus}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{event.date} • {event.pickup_window}</span>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="font-medium">Host:</span> {event.host_club}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center items-end">
                                                    <div className="text-sm text-muted-foreground">
                                                        <span className="font-semibold text-foreground">{event.spots_taken}</span> / {event.spots_total} spots taken
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}
