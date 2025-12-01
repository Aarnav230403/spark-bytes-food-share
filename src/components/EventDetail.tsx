import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";
import { Modal, InputNumber, message } from "antd";

type FoodItem = {
  name: string;
  qty: number;
};

type EventDetailProps = {
  event: {
    id: number;
    title: string;
    location: string;
    start_time: string;
    end_time: string;
    campus: string[];
    dietary: string[];
    food_items: FoodItem[];
    notes?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EventDetail({
  event,
  open,
  onOpenChange,
}: EventDetailProps) {
  const [eta, setEta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const locationMap: Record<string, string> = {
    "Central Campus": "Boston University Central Campus, Commonwealth Avenue, Boston, MA",
    "West Campus": "Boston University West Campus, 275 Babcock Street, Boston, MA",
    "East Campus": "Boston University East Campus, 233 Bay State Road, Boston, MA",
    "South Campus": "Boston University South Campus, 25 Buswell Street, Boston, MA",
    "Fenway Campus": "Boston University Fenway Campus, 200 Riverway, Boston, MA",
    "Medical Campus": "Boston University Medical Campus, 72 East Concord Street, Boston, MA",
  };

  // ✅ 获取 ETA（使用 Distance Matrix API）
  useEffect(() => {
    async function fetchETA() {
      if (!event) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("campus_preference")
          .eq("id", user.id)
          .single();

        const origin =
          locationMap[profile?.campus_preference] ||
          profile?.campus_preference;
        const eventCampus = event.campus?.[0] || "Central Campus";
        const destination =
          locationMap[eventCampus] || eventCampus;

        if (!origin || !destination) return;

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          origin
        )}&destinations=${encodeURIComponent(
          destination
        )}&mode=walking&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();
        const duration = data?.rows?.[0]?.elements?.[0]?.duration?.text;
        setEta(duration || "ETA unavailable");
      } catch (err) {
        console.error("Error fetching ETA:", err);
        setEta("ETA unavailable");
      }
    }
    fetchETA();
  }, [event]);

  // ✅ 修复 Reserve 事件逻辑
  async function reserveFood(eventId: number, foodIndex: number) {
    console.log("Clicked Reserve:", eventId, foodIndex);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      message.error("Please log in first");
      return;
    }

    const food = event.food_items[foodIndex];
    let qty = 1;

    // ✅ 确保弹窗正常弹出
    Modal.confirm({
      title: `Reserve ${food.name}`,
      content: (
        <div>
          <p>Enter quantity you want to reserve:</p>
          <InputNumber
            min={1}
            max={food.qty}
            defaultValue={1}
            onChange={(v) => (qty = Number(v) || 1)}
          />
        </div>
      ),
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        try {
          setLoading(true);
          console.log("Calling Supabase RPC: reserve_food");

          const { data, error } = await supabase.rpc("reserve_food", {
            event_id: eventId,
            food_index: foodIndex,
            user_id: user.id,
            qty,
          });

          setLoading(false);

          if (error) {
            console.error("Supabase RPC error:", error);
            message.error(error.message || "Reservation failed");
            return;
          }

          if (data === "ok") {
            message.success(`Reserved ${qty} ${food.name}(s) successfully`);
            event.food_items[foodIndex].qty -= qty;
          } else if (data === "Food unavailable") {
            message.warning("This item is sold out");
          } else {
            message.error(data || "Reservation failed");
          }
        } catch (err) {
          setLoading(false);
          console.error("Error during reservation:", err);
          message.error("Reservation failed");
        }
      },
    });
  }

  if (!event) return <></>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-sm text-muted-foreground mb-2">
          {event.location} · {event.start_time} – {event.end_time}
        </p>

        {eta && (
          <p className="text-sm text-muted-foreground mb-2">
            From your campus: {eta}
          </p>
        )}

        {!!event.campus?.length && (
          <p className="text-sm text-muted-foreground mb-2">
            Campus: {event.campus.join(", ")}
          </p>
        )}

        {!!event.dietary?.length && (
          <p className="text-sm text-muted-foreground mb-4">
            Dietary: {event.dietary.join(", ")}
          </p>
        )}

        {event.notes && (
          <p className="text-sm text-muted-foreground mb-4">{event.notes}</p>
        )}

        <div className="space-y-3 mt-4">
          {event.food_items?.map((food, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border rounded-lg px-3 py-2"
            >
              <div>
                <div className="font-medium">{food.name}</div>
                <div className="text-xs text-muted-foreground">
                  Remaining: {food.qty}
                </div>
              </div>

              <Button
                size="sm"
                type="button"
                disabled={loading || food.qty <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  reserveFood(event.id, idx);
                }}
              >
                {food.qty > 0 ? "Reserve" : "Sold out"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
