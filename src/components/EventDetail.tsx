import { Modal, Card, Tag, Button, message } from "antd";
import { MapPin, Clock, Utensils, Info } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

interface EventDetailProps {
    event: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EventDetail({ event, open, onOpenChange }: EventDetailProps) {
    if (!event) return null;

    // ⭐ Reserve Food via SQL RPC
    async function reserveFood(eventId: number, foodIndex: number) {
        // 1. Ensure user is logged in
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
            message.error("Please log in first");
            return;
        }

        // 2. Call RPC function
        const { data, error } = await supabase.rpc("reserve_food", {
            event_id: eventId,
            food_index: foodIndex,
            user_id: user.id, // TEXT
        });

        // 3. Error display
        if (error) {
            console.error("RPC Error:", error);
            message.error(error.message || "Reservation failed");
            return;
        }

        // 4. SQL function returns:
        // "ok", "sold_out", "event_not_found", "invalid_index"
        if (data === "ok") {
            message.success("Reserved successfully!");

            // Small optimistic update (update UI only)
            event.food_items[foodIndex].qty -= 1;
        } else if (data === "sold_out") {
            message.warning("This item is already sold out.");
        } else {
            message.error(data);
        }
    }

    return (
        <Modal
            open={open}
            onCancel={() => onOpenChange(false)}
            footer={null}
            title={event.title}
            width={700}
        >
            <div style={{ padding: 12 }}>
                {/* Location */}
                <div style={{ marginBottom: 16 }}>
                    <strong><MapPin size={16} /> Location:</strong>
                    <p>{event.location}</p>
                </div>

                {/* Time */}
                <div style={{ marginBottom: 16 }}>
                    <strong><Clock size={16} /> Pickup Time:</strong>
                    <p>{event.start_time} - {event.end_time}</p>
                </div>

                {/* Campus */}
                {event.campus?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <strong>Campus:</strong>
                        <div style={{ marginTop: 6 }}>
                            {event.campus.map((c: string, i: number) => (
                                <Tag key={i} color="blue">{c}</Tag>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dietary */}
                {event.dietary?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <strong>Dietary:</strong>
                        <div style={{ marginTop: 6 }}>
                            {event.dietary.map((d: string, i: number) => (
                                <Tag key={i}>{d}</Tag>
                            ))}
                        </div>
                    </div>
                )}

                {/* Food Items */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Utensils size={16} />
                        <strong>Available Food</strong>
                    </div>

                    {event.food_items?.length > 0 ? (
                        <div style={{ marginTop: 12 }}>
                            {event.food_items.map((food: any, index: number) => (
                                <Card key={index} size="small" style={{ marginBottom: 12 }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            <strong>{food.name}</strong>
                                            <span style={{ marginLeft: 12 }}>Qty: {food.qty}</span>
                                        </div>

                                        <Button
                                            type="primary"
                                            disabled={food.qty === 0}
                                            onClick={() => reserveFood(event.id, index)}
                                        >
                                            {food.qty === 0 ? "Sold Out" : "Reserve"}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p>No food items</p>
                    )}
                </div>

                {/* Notes */}
                {event.notes && (
                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Info size={16} />
                            <strong>Additional Notes</strong>
                        </div>
                        <Card style={{ marginTop: 8 }}>
                            {event.notes}
                        </Card>
                    </div>
                )}
            </div>
        </Modal>
    );
}
