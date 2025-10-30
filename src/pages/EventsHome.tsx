import { useEffect, useState } from "react";
import { Card, Row, Col, Spin } from "antd";
import { supabase } from "../lib/supabaseClient";
import Header from "../components/header";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel("realtime:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching events:", error);
    else setEvents(data || []);
    setLoading(false);
  }

  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#fafafa",
          padding: "40px 24px",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: 32, marginBottom: 8 }}>
          Welcome to TerrierTable
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: 32 }}>
          Available Events
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin size="large" />
          </div>
        ) : events.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No events yet. Please check back later!
          </p>
        ) : (
          <Row gutter={[16, 16]} justify="center">
            {events.map((event) => (
              <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={event.title}
                  bordered
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Pickup Time:</strong> {event.start_time} – {event.end_time}
                  </p>
                  <p>
                    <strong>Campus:</strong>{" "}
                    {event.campus?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Dietary:</strong>{" "}
                    {event.dietary?.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Food:</strong>{" "}
                    {event.food_items
                      ?.map((f: any) => `${f.name} (${f.qty})`)
                      .join(", ") || "N/A"}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </main>
    </>
  );
}