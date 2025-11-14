import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const auth = req.headers.get("Authorization");

    if (!auth) {
      return new Response("Missing auth header", { status: 401 });
    }

    const token = auth.replace("Bearer ", "");

    const { eventId, foodIndex } = await req.json();

    if (eventId === undefined || foodIndex === undefined) {
      return new Response("Missing eventId or foodIndex", { status: 400 });
    }

    // 1. Get current event data
    const { data: event, error: fetchErr } = await fetch(
      `${url.origin}/rest/v1/events?id=eq.${eventId}`,
      {
        headers: {
          apikey: token,
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((r) => r.json());

    if (!event || event.length === 0) {
      return new Response("Event not found", { status: 404 });
    }

    const e = event[0];
    const foodItems = e.food_items;

    if (!foodItems[foodIndex] || foodItems[foodIndex].qty <= 0) {
      return new Response("Food item unavailable", { status: 400 });
    }

    // 2. Decrease quantity
    foodItems[foodIndex].qty -= 1;

    // 3. Update event record
    await fetch(`${url.origin}/rest/v1/events?id=eq.${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: token,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ food_items: foodItems }),
    });

    // 4. Insert reservation record
    await fetch(`${url.origin}/rest/v1/my_reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: token,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: e.user_id || null,
        event_id: eventId,
        food_name: foodItems[foodIndex].name,
        food_index: foodIndex,
        qty: 1,
      }),
    });

    return new Response("Reserved successfully", { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});
