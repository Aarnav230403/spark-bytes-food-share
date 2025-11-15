export type ReservationStatus = "reserved" | "checked_in" | "cancelled";

export type Reservation = {
  id: string;
  eventId: string;
  studentName: string;
  studentEmail: string;
  createdAt: string; // ISO string or simple "2025-11-15 14:03"
  status: ReservationStatus;
};

export type ManagedEvent = {
  id: string;
  title: string;
  location: string;
  campus: string;
  pickupWindow: string; // "6:00 PM – 7:30 PM"
  date: string;         // "Thu, Nov 20"
  food: string;
  dietary: string;
  hostClub: string;
  spotsTotal: number;
  spotsTaken: number;
  description: string;
};

