import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabaseClient";
import { message } from "antd";

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
  if (!event) return <></>;

  async function reserveFood(eventId: number, foodIndex: number) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      message.error("Please log in first");
      return;
    }

    const { data, error } = await supabase.rpc("reserve_food", {
      event_id: eventId,
      food_index: foodIndex,
      user_id: user.id,
    });

    if (error) {
      console.error("RPC Error:", error);
      message.error(error.message || "Reservation failed");
      return;
    }

    if (data === "ok") {
      message.success("Reserved successfully!");
      event.food_items[foodIndex].qty -= 1;
    } else if (data === "Food unavailable") {
      message.warning("This item is sold out.");
    } else {
      message.error(data);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-sm text-muted-foreground mb-2">
          {event.location} · {event.start_time} – {event.end_time}
        </p>

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
                disabled={food.qty <= 0}
                onClick={() => reserveFood(event.id, idx)}
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
