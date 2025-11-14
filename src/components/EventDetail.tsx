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

    // ⭐ Reserve Food Function
    async function reserveFood(eventId: number, foodIndex: number) {
        const { data: eventData, error: fetchError } = await supabase
            .from("events")
            .select("food_items")
            .eq("id", eventId)
            .single();

        if (fetchError) {
            console.error(fetchError);
            message.error("Failed to fetch event data");
            return;
        }

        const foodItems = eventData.food_items;

        if (foodItems[foodIndex].qty <= 0) {
            message.warning("This item is already sold out");
            return;
        }

        foodItems[foodIndex].qty -= 1;
        const { error: updateError } = await supabase
            .from("events")
            .update({ food_items: foodItems })
            .eq("id", eventId);

        if (updateError) {
            console.error(updateError);
            message.error("Failed to reserve item");
            return;
        }

        message.success("Reserved successfully!");
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
