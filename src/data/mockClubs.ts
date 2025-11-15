import { Club } from "@/types/clubs";

export const mockClubs: Club[] = [
  {
    id: "bu-dining",
    name: "BU Dining Services",
    shortName: "BU Dining",
    description: "Boston University's official dining services provides meals to thousands of students daily. Through Spark Bytes, we share leftover meals from dining halls and special events to reduce waste and feed the BU community. Join us in our mission to minimize food waste while supporting students in need of a meal.",
    category: "Department",
    campusFocus: "All campuses",
    followers: 1247,
    tags: ["Food", "Community", "Sustainability"],
    pastEvents: [
      {
        id: "1",
        title: "Midnight Munchies @ CDS",
        date: "Fri, Nov 21",
        location: "CDS",
        food: "Pasta bar, salad bowls, cookies"
      },
      {
        id: "2",
        title: "Weekend Brunch Leftovers",
        date: "Sun, Nov 23",
        location: "Marciano Commons",
        food: "Pancakes, scrambled eggs, fresh fruit, pastries"
      },
      {
        id: "3",
        title: "Late Night Study Snacks",
        date: "Wed, Nov 19",
        location: "Warren Towers",
        food: "Sandwiches, chips, yogurt, granola bars"
      }
    ],
    upcomingEvents: [
      {
        id: "4",
        title: "Holiday Feast Leftovers",
        date: "Thu, Nov 28",
        location: "West Campus Dining",
        food: "Roast turkey, mashed potatoes, green beans, pie"
      }
    ]
  },
  {
    id: "cs-ambassadors",
    name: "CS Ambassadors",
    shortName: "CS Ambassadors",
    description: "The Computer Science Ambassadors at BU organize study nights, networking events, and community gatherings for CS students. We regularly host sessions with pizza, snacks, and beverages to create a welcoming environment for collaboration and learning. Connect with fellow CS students while enjoying free food!",
    category: "Student Club",
    campusFocus: "West Campus",
    followers: 892,
    tags: ["Technology", "Community", "Academic"],
    pastEvents: [
      {
        id: "5",
        title: "CS Study Night Snacks",
        date: "Thu, Nov 20",
        location: "HTC",
        food: "Pizza (120), chips, sodas"
      },
      {
        id: "6",
        title: "Algorithm Workshop & Dinner",
        date: "Mon, Nov 17",
        location: "CAS 211",
        food: "Chicken wraps, fruit cups, cookies, coffee"
      },
      {
        id: "7",
        title: "Career Fair Prep Session",
        date: "Sat, Nov 15",
        location: "CDS Study Lounge",
        food: "Sandwiches, salad, energy drinks"
      }
    ],
    upcomingEvents: [
      {
        id: "8",
        title: "Final Exam Study Jam",
        date: "Mon, Dec 8",
        location: "HTC Auditorium",
        food: "Pizza, Red Bull, snacks"
      }
    ]
  },
  {
    id: "bu-book-club",
    name: "BU Book Club",
    shortName: "BU Book Club",
    description: "Boston University Book Club brings together students who love reading and meaningful conversations. Our monthly meetups often feature light refreshments, coffee, and pastries to create a cozy, welcoming atmosphere. We discuss contemporary fiction, non-fiction, and everything in between while enjoying good food and great company.",
    category: "Student Club",
    campusFocus: "Central Campus",
    followers: 456,
    tags: ["Literature", "Community", "Social"],
    pastEvents: [
      {
        id: "9",
        title: "Book Club Coffee & Pastries",
        date: "Sat, Nov 22",
        location: "GSU Backcourt",
        food: "Croissants, muffins, drip coffee, tea"
      },
      {
        id: "10",
        title: "Author Discussion & Light Dinner",
        date: "Thu, Nov 6",
        location: "CAS 216",
        food: "Sandwiches, soup, cookies, hot beverages"
      },
      {
        id: "11",
        title: "Poetry Night Snacks",
        date: "Fri, Oct 31",
        location: "GSU Food Court",
        food: "Tea, scones, finger sandwiches, chocolates"
      }
    ],
    upcomingEvents: []
  },
  {
    id: "club-sports-council",
    name: "Club Sports Council",
    shortName: "Club Sports",
    description: "The Club Sports Council coordinates athletic activities and events across BU's various club sports teams. After games and tournaments, we often have leftover team meals, snacks, and beverages. Share our victories and grab a bite! Perfect for athletes and sports enthusiasts looking for post-game fuel or pre-workout snacks.",
    category: "Student Club",
    campusFocus: "West Campus",
    followers: 678,
    tags: ["Athletics", "Community", "Fitness"],
    pastEvents: [
      {
        id: "12",
        title: "Club Sports Post-Game Bites",
        date: "Sun, Nov 23",
        location: "Nickerson Field Gate C",
        food: "Wraps, fruit cups, Gatorade"
      },
      {
        id: "13",
        title: "Intramural Championship Snacks",
        date: "Sat, Nov 15",
        location: "FitRec",
        food: "Protein bars, bananas, sports drinks, trail mix"
      },
      {
        id: "14",
        title: "Team Building BBQ Leftovers",
        date: "Sun, Nov 9",
        location: "Nickerson Field",
        food: "Hot dogs, hamburgers, chips, water bottles"
      }
    ],
    upcomingEvents: [
      {
        id: "15",
        title: "Winter Tournament Fuel",
        date: "Sat, Dec 6",
        location: "FitRec Lobby",
        food: "Energy bars, fruit, sports drinks"
      }
    ]
  },
  {
    id: "sustainability-club",
    name: "BU Sustainability Club",
    shortName: "Sustainability Club",
    description: "BU Sustainability Club is dedicated to environmental awareness and reducing waste across campus. We partner with dining services, local businesses, and student organizations to rescue and redistribute food that would otherwise go to waste. Join us for events focused on sustainability, composting, and building a more eco-conscious campus community.",
    category: "Student Club",
    campusFocus: "All campuses",
    followers: 1023,
    tags: ["Sustainability", "Environment", "Community"],
    pastEvents: [
      {
        id: "16",
        title: "Zero Waste Fair",
        date: "Wed, Nov 19",
        location: "GSU Plaza",
        food: "Vegan wraps, smoothies, organic snacks"
      },
      {
        id: "17",
        title: "Farm to Table Leftovers",
        date: "Fri, Nov 14",
        location: "CAS 100",
        food: "Local produce, artisan bread, fresh juice"
      },
      {
        id: "18",
        title: "Eco-Event Cleanup Snacks",
        date: "Sun, Nov 2",
        location: "Marsh Plaza",
        food: "Compostable-packaged snacks, water"
      }
    ],
    upcomingEvents: [
      {
        id: "19",
        title: "Green Week Celebration",
        date: "Mon, Dec 1",
        location: "GSU",
        food: "Plant-based meals, local produce, sustainable snacks"
      }
    ]
  }
];

export function getClubById(id: string): Club | undefined {
  return mockClubs.find(c => c.id === id);
}

