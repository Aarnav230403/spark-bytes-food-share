import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
declare const Deno: any;

Deno.serve(async (req: Request) => {
  try {
    const { event_id, food_name, user_id } = await req.json();

    if (!event_id || !food_name || !user_id) {
      return new Response("Missing fields", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRole);

    // 1) Load event
    const { data: event, error: loadErr } = await supabase
      .from("events")
      .select("food_items")
      .eq("id", event_id)
      .single();

    if (loadErr || !event) {
      return new Response("Event not found", { status: 404 });
    }

    const items = event.food_items;
    const updatedItems = [...items];

    // 2) Update qty
    const idx = updatedItems.findIndex((i) => i.name === food_name);
    if (idx === -1) return new Response("Food not found", { status: 404 });

    if (updatedItems[idx].qty <= 0)
      return new Response("No more food available", { status: 400 });

    updatedItems[idx].qty -= 1;

    // 3) Update DB
    const { error: updateErr } = await supabase
      .from("events")
      .update({ food_items: updatedItems })
      .eq("id", event_id);

    if (updateErr) {
      return new Response(updateErr.message, { status: 500 });
    }

    // 4) Insert reservation
    await supabase.from("reservations").insert({
      event_id,
      user_id,
      food_name,
      reserved_at: new Date().toISOString(),
    });

    return new Response("Reserved successfully", { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(message, { status: 500 });
  }
});
