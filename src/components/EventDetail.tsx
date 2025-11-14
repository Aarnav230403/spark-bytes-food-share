import { Modal, Card, Tag } from "antd";
import { MapPin, Clock, Utensils, Info } from "lucide-react";

interface EventDetailProps {
    event: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EventDetail({ event, open, onOpenChange }: EventDetailProps) {
    if (!event) return null;

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
                                <Card key={index} size="small" style={{ marginBottom: 8 }}>
                                    <strong>{food.name}</strong>
                                    <span style={{ marginLeft: 12 }}>Qty: {food.qty}</span>
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
