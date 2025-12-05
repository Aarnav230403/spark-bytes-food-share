// src/pages/clubs/index.tsx (or wherever your clubs page lives)
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, X, Users, Search } from "lucide-react";
import Header from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";

export default function ClubsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");

  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    "all",  
    "Department",
    "Student Government", 
    "Art & Culture",
    "Greek Life",
    "Academics",
    "Community Service",
    "Club Sports",,
    "Other"];

  const campuses = [
    "all",
    "Central Campus",
    "West Campus",
    "East Campus",
    "South Campus",
    "Fenway Campus",
    "Medical Campus",
  ];

  const fetchClubs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clubs:", error);
      setClubs([]);
    } else {
      setClubs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClubs();

    const channel = supabase
      .channel("public:clubs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clubs" },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          setClubs((current) => {
            if (eventType === "INSERT") {
              return [newRow, ...current];
            }
            if (eventType === "UPDATE") {
              return current.map((c) => (c.id === newRow.id ? newRow : c));
            }
            if (eventType === "DELETE") {
              return current.filter((c) => c.id !== oldRow.id);
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter Calculations
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const name = (club.name || "").toLowerCase();
      const description = (club.description || "").toLowerCase();
      const tagsArr: string[] = Array.isArray(club.tags)
        ? club.tags
        : club.tags
        ? [club.tags.toString()]
        : [];

      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        description.includes(searchQuery.toLowerCase()) ||
        tagsArr.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" ||
        (club.category || "all") === selectedCategory;

      const matchesCampus =
        selectedCampus === "all" ||
        (club.campus_focus || "all") === selectedCampus;

      return matchesSearch && matchesCategory && matchesCampus;
    });
  }, [clubs, searchQuery, selectedCategory, selectedCampus]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCampus("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedCampus !== "all";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative bg-gradient-hero text-white py-16 lg:py-20">
          <div className="absolute inset-0 bg-foreground/5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Clubs & Organizations
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Discover campus groups, communities, and student-led initiatives.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{clubs.length} Active Clubs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "all" ? "All categories" : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Campus */}
                <Select
                  value={selectedCampus}
                  onValueChange={setSelectedCampus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "all" ? "All campuses" : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}{" "}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCampus !== "all" && (
                  <Badge variant="secondary">
                    Campus: {selectedCampus}
                    <button
                      onClick={() => setSelectedCampus("all")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Clubs Grid */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading clubs…
              </p>
            ) : filteredClubs.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No clubs found.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="group">
                    <Card className="hover:shadow-lg transition">
                      <CardHeader className="flex flex-row items-center gap-3">
                        {club.logo_url ? (
                          <img
                            src={club.logo_url}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                            {getInitials(club.name)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg">{club.name}</CardTitle>
                          <CardDescription className="truncate">
                            {club.category || "Uncategorized"}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {club.description || "No description provided."}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(Array.isArray(club.tags)
                            ? club.tags
                            : club.tags
                            ? [club.tags]
                            : []
                          ).slice(0, 6).map((tag, idx) => (
                            <Badge key={idx} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-muted-foreground">
                            Campus: {club.campus_focus || "N/A"}
                          </div>

                          <div className="flex gap-2">
                            <Link to={`/clubs/${club.id}`}>
                              <Button size="sm" className="bg-red-600 text-white">
                                View Club
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}