import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Utensils, Info } from "lucide-react";

interface EventDetailProps {
    event: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EventDetail({
    event,
    open,
    onOpenChange,
}: EventDetailProps) {
    if (!event) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Location & Time */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-semibold">Location</p>
                                <p className="text-muted-foreground">{event.location}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-semibold">Pickup Time</p>
                                <p className="text-muted-foreground">
                                    {event.start_time} - {event.end_time}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Campus & Dietary Info */}
                    <div className="space-y-3">
                        {event.campus && event.campus.length > 0 && (
                            <div>
                                <p className="font-semibold mb-2">Campus Location</p>
                                <div className="flex flex-wrap gap-2">
                                    {event.campus.map((campus: string, index: number) => (
                                        <Badge key={index} variant="secondary">
                                            {campus}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.dietary && event.dietary.length > 0 && (
                            <div>
                                <p className="font-semibold mb-2">Dietary Information</p>
                                <div className="flex flex-wrap gap-2">
                                    {event.dietary.map((diet: string, index: number) => (
                                        <Badge key={index} variant="outline">
                                            {diet}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Food Items */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Utensils className="h-5 w-5 text-primary" />
                            <p className="font-semibold text-lg">Available Food</p>
                        </div>

                        {event.food_items && event.food_items.length > 0 ? (
                            <div className="grid gap-3">
                                {event.food_items.map((food: any, index: number) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-lg">{food.name}</p>
                                                {food.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {food.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge className="ml-2">{food.qty}</Badge>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-4">
                                <p className="text-muted-foreground text-center">
                                    No food items listed
                                </p>
                            </Card>
                        )}
                    </div>

                    {/* Additional Notes */}
                    {event.notes && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="h-5 w-5 text-primary" />
                                <p className="font-semibold">Additional Notes</p>
                            </div>
                            <Card className="p-4">
                                <p className="text-muted-foreground">{event.notes}</p>
                            </Card>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
