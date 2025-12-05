import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle, Clock, Mail, User, QrCode } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { Spin, message } from "antd";

type Reservation = {
  id: string;
  user_id: string;
  quantity: number;
  created_at: string;
  full_name?: string;
  email?: string;
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [checkInCode, setCheckInCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (eventError || !eventData) {
        message.error("Failed to load event details");
        setLoading(false);
        return;
      }

      const { data: reservationData, error: reservationError } = await supabase
        .from("reservations")
        .select("id, quantity, created_at, user_id")
        .eq("event_id", id);

      if (reservationError) {
        message.error("Failed to load reservations");
        setLoading(false);
        return;
      }

      const userIds = reservationData.map((r) => r.user_id);
      let profilesMap: Record<string, { full_name: string; email: string }> = {};

      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);

        if (!profilesError && profilesData) {
          profilesMap = profilesData.reduce((acc, p) => {
            acc[p.id] = { full_name: p.full_name, email: p.email };
            return acc;
          }, {} as Record<string, { full_name: string; email: string }>);
        }
      }

      const merged = reservationData.map((r) => ({
        ...r,
        full_name: profilesMap[r.user_id]?.full_name || "Anonymous",
        email: profilesMap[r.user_id]?.email || "No email",
      }));

      setEvent(eventData);
      setReservations(merged);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleCheckIn = (reservationId: string) => {
    setReservations(
      reservations.map((r) =>
        r.id === reservationId ? { ...r, status: "checked_in" } : r
      )
    );
  };

  const handleCheckInByCode = () => {
    if (!checkInCode.trim()) return;
    const reservation = reservations.find((r) => r.id === checkInCode.trim());
    if (reservation) {
      handleCheckIn(reservation.id);
      setCheckInCode("");
    } else {
      alert("Reservation not found");
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      </>
    );

  if (!event) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-6">Event not found</p>
            <Link to="/my-activity">
              <Button variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Activity
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Link
            to="/my-activity"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Activity</span>
          </Link>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{event.title}</h1>
            <p className="text-muted-foreground mb-4 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{event.pickupWindow}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{event.campus}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {event.spotsTaken} / {event.spotsTotal} spots
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Host: {event.hostClub}</span>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-white border border-slate-200 shadow-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Check-in
                  </CardTitle>
                  <CardDescription>Scan QR code or enter reservation code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInCode">Scan or enter reservation code</Label>
                    <Input
                      id="checkInCode"
                      value={checkInCode}
                      onChange={(e) => setCheckInCode(e.target.value)}
                      placeholder="Enter reservation ID"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleCheckInByCode();
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Real QR code scanning can be added later.</p>
                  </div>
                  <Button
                    onClick={handleCheckInByCode}
                    className="w-full bg-red-600 text-white hover:bg-red-700"
                  >
                    Mark as checked in
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Reservations</CardTitle>
                    <Badge className="bg-slate-100 text-slate-700">
                      {reservations.length} Total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {reservations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No reservations for this event yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {reservations.map((r) => (
                        <Card key={r.id} className="border border-slate-200 hover:border-slate-300 transition-all duration-300">
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{r.full_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{r.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Reserved at: {new Date(r.created_at).toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Qty: {r.quantity}</div>
                              </div>
                              <div className="shrink-0">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleCheckIn(r.id)}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Check in
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
