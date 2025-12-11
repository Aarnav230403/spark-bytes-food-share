import { useEffect, useState } from "react";
import { Card, Spin, Button, message } from "antd";
import Header from "../components/header";
import { supabase } from "../lib/supabaseClient";

export default function MyReservations() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    setLoading(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      setLoading(false);
      return;
    }

    const { data: reservations, error } = await supabase
      .from("my_reservation")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reservations:", error);
      setLoading(false);
      return;
    }

    setItems(reservations || []);
    const eventIds = [...new Set((reservations || []).map((r) => r.event_id))];

    if (eventIds.length > 0) {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);
      if (eventsError) {
        console.error("Error loading events:", eventsError);
      } else {
        setEvents(eventsData || []);
      }
    } else {
      setEvents([]);
    }
    setLoading(false);
  }

  async function cancelReservation(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: myRes, error: myResError } = await supabase
      .from("my_reservation")
      .select("event_id")
      .eq("id", id)
      .single();
    if (myResError || !myRes) {
      message.error("Failed to find reservation");
      return;
    }

    const { error } = await supabase.rpc("cancel_reservation", {
      reservation_id: id,
    });
    if (error) {
      console.error(error);
      message.error("Failed to cancel reservation");
      return;
    }

    await supabase
      .from("reservations")
      .delete()
      .eq("event_id", myRes.event_id)
      .eq("user_id", user.id);

    message.success("Reservation cancelled", 0.8);
    fetchReservations();
  }

  function getEvent(event_id: string | number) {
    return events.find((e) => e.id == event_id);
  }

  return (
    <>
      <Header />
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>My Reservations</h1>
        {loading ? (
          <Spin size="large" />
        ) : items.length === 0 ? (
          <p style={{ color: "#777" }}>You have no reservations yet.</p>
        ) : (
          items.map((r) => {
            const event = getEvent(r.event_id);
            return (
              <Card key={r.id} style={{ marginBottom: 16 }}>
                <h3>{event?.title || "Event Deleted"}</h3>
                <p>
                  <strong>Location: </strong>
                  {event?.location || "Unknown"}
                </p>
                <p>
                  <strong>Pickup Time: </strong>
                  {event?.start_time || "?"} – {event?.end_time || "?"}
                </p>
                <p>
                  <strong>Food Item: </strong>
                  {r.food_name}
                </p>
                <p>
                  <strong>Reserved Qty: </strong>
                  {r.qty}
                </p>
                <Button
                  danger
                  style={{ marginTop: 12 }}
                  onClick={() => cancelReservation(r.id)}
                >
                  Cancel Reservation
                </Button>
                <p style={{ fontSize: 12, color: "#999", marginTop: 12 }}>
                  Reserved at: {new Date(r.created_at).toLocaleString()}
                </p>
              </Card>
            );
          })
        )}
      </main>
    </>
  );
}