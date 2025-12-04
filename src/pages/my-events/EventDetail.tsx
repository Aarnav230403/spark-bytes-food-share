import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle, XCircle, Clock, Mail, User, QrCode } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ManagedEvent } from "@/types/events";
import { Reservation, ReservationStatus } from "@/types/events";
import { mockManagedEvents } from "@/data/mockManagedEvents";
import { mockReservations } from "@/data/mockManagedEvents";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const event = id ? mockManagedEvents.find((e) => e.id === id) : undefined;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [checkInCode, setCheckInCode] = useState("");

  useEffect(() => {
    if (id) {
      setReservations(mockReservations.filter((r) => r.eventId === id));
    }
  }, [id]);

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

  const handleCheckIn = (reservationId: string) => {
    setReservations(
      reservations.map((r) =>
        r.id === reservationId ? { ...r, status: "checked_in" as ReservationStatus } : r
      )
    );
  };

  const handleCheckInByCode = () => {
    if (!checkInCode.trim()) return;

    const reservation = reservations.find((r) => r.id === checkInCode.trim());
    if (reservation && reservation.status === "reserved") {
      handleCheckIn(reservation.id);
      setCheckInCode("");
    } else {
      alert("Reservation not found or already checked in");
    }
  };

  const reservedCount = reservations.filter((r) => r.status === "reserved").length;
  const checkedInCount = reservations.filter((r) => r.status === "checked_in").length;
  const cancelledCount = reservations.filter((r) => r.status === "cancelled").length;

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "reserved":
        return <Badge className="bg-slate-100 text-slate-700">Reserved</Badge>;
      case "checked_in":
        return <Badge className="bg-green-100 text-green-700">Checked in</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {/* Back Link */}
          <Link
            to="/my-activity"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Activity</span>
          </Link>

          {/* Event Header */}
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
            {/* Check-in Section */}
            <div className="lg:col-span-1">
              <Card className="bg-white border border-slate-200 shadow-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Check-in
                  </CardTitle>
                  <CardDescription>
                    Scan QR code or enter reservation code
                  </CardDescription>
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
                        if (e.key === "Enter") {
                          handleCheckInByCode();
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Real QR code scanning can be added later.
                    </p>
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

            {/* Reservations List */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Reservations</CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Reserved:</span>
                        <Badge className="bg-slate-100 text-slate-700">{reservedCount}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Checked in:</span>
                        <Badge className="bg-green-100 text-green-700">{checkedInCount}</Badge>
                      </div>
                      {cancelledCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Cancelled:</span>
                          <Badge className="bg-red-100 text-red-700">{cancelledCount}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {reservations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No reservations for this event yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {reservations.map((reservation) => (
                        <Card
                          key={reservation.id}
                          className="border border-slate-200 hover:border-slate-300 transition-all duration-300"
                        >
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{reservation.studentName}</span>
                                  {getStatusBadge(reservation.status)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{reservation.studentEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Reserved at: {reservation.createdAt}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ID: {reservation.id}
                                </div>
                              </div>
                              <div className="shrink-0">
                                {reservation.status === "reserved" && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleCheckIn(reservation.id)}
                                    className="bg-green-600 text-white hover:bg-green-700"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Check in
                                  </Button>
                                )}
                                {reservation.status === "checked_in" && (
                                  <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">Checked in</span>
                                  </div>
                                )}
                                {reservation.status === "cancelled" && (
                                  <div className="flex items-center gap-2 text-red-700">
                                    <XCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">Cancelled</span>
                                  </div>
                                )}
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

