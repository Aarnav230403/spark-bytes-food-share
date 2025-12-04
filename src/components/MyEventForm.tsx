import { useState, useEffect } from "react";
import { ManagedEvent } from "@/types/events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MyEventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<ManagedEvent, "id" | "spotsTaken">) => void;
  event?: ManagedEvent | null; // If provided, form is in edit mode
}

export default function MyEventForm({ open, onClose, onSubmit, event }: MyEventFormProps) {
  const [title, setTitle] = useState("");
  const [hostClub, setHostClub] = useState("");
  const [date, setDate] = useState("");
  const [pickupWindow, setPickupWindow] = useState("");
  const [location, setLocation] = useState("");
  const [campus, setCampus] = useState("");
  const [spotsTotal, setSpotsTotal] = useState<number>(50);
  const [food, setFood] = useState("");
  const [dietary, setDietary] = useState("");
  const [description, setDescription] = useState("");

  const campuses = ["Central Campus", "West Campus", "East Campus", "South Campus", "Fenway", "Medical Campus"];

  useEffect(() => {
    if (event) {
      // Edit mode: pre-fill form
      setTitle(event.title);
      setHostClub(event.hostClub);
      setDate(event.date);
      setPickupWindow(event.pickupWindow);
      setLocation(event.location);
      setCampus(event.campus);
      setSpotsTotal(event.spotsTotal);
      setFood(event.food);
      setDietary(event.dietary);
      setDescription(event.description);
    } else {
      // Create mode: reset form
      setTitle("");
      setHostClub("");
      setDate("");
      setPickupWindow("");
      setLocation("");
      setCampus("");
      setSpotsTotal(50);
      setFood("");
      setDietary("");
      setDescription("");
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !hostClub || !date || !pickupWindow || !location || !campus) {
      return;
    }

    onSubmit({
      title,
      hostClub,
      date,
      pickupWindow,
      location,
      campus,
      spotsTotal,
      food,
      dietary,
      description,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Update the event details below." : "Fill in the details to create a new event."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Munchies @ CDS"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostClub">Host Club</Label>
              <Input
                id="hostClub"
                value={hostClub}
                onChange={(e) => setHostClub(e.target.value)}
                placeholder="e.g. BU Dining"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Fri, Nov 21"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupWindow">Pickup Window</Label>
              <Input
                id="pickupWindow"
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                placeholder="e.g. 6:00 PM – 7:30 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. CDS"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campus">Campus *</Label>
              <Select value={campus} onValueChange={setCampus} required>
                <SelectTrigger id="campus">
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spotsTotal">Total Spots</Label>
            <Input
              id="spotsTotal"
              type="number"
              min="1"
              value={spotsTotal}
              onChange={(e) => setSpotsTotal(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="food">Food Description</Label>
            <Input
              id="food"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="e.g. Pasta bar, salad bowls, cookies"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Info</Label>
            <Input
              id="dietary"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Gluten Free, Vegetarian options"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the event..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {event ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

