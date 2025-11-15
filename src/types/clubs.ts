export type ClubEventSummary = {
  id: string;
  title: string;
  date: string;        // e.g. "Thu, Nov 20"
  location: string;    // e.g. "GSU Backcourt"
  food: string;        // e.g. "Pizza, salad, soda"
};

export type Club = {
  id: string;          // slug, e.g. "bu-dining"
  name: string;
  shortName?: string;
  logoUrl?: string;
  description: string;
  category: string;    // e.g. "Student Club", "Department"
  campusFocus: string; // e.g. "All campuses", "West Campus"
  followers?: number;
  tags: string[];      // e.g. ["Food", "Community", "Events"]
  pastEvents: ClubEventSummary[];
  upcomingEvents: ClubEventSummary[];
};

