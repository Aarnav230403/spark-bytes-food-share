import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Filter, X, Users, Search } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockClubs } from "@/data/mockClubs";

export default function ClubsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");

  const categories = ["all", "Student Club", "Department", "Athletics"];
  const campuses = ["all", "All campuses", "East Campus", "Central Campus", "West Campus"];

  const filteredClubs = useMemo(() => {
    return mockClubs.filter((club) => {
      const matchesSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || club.category === selectedCategory;
      
      const matchesCampus = selectedCampus === "all" || club.campusFocus === selectedCampus;
      
      return matchesSearch && matchesCategory && matchesCampus;
    });
  }, [searchQuery, selectedCategory, selectedCampus]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCampus("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedCampus !== "all";

  // Helper function to get initials from club name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white py-16 lg:py-20">
          <div className="absolute inset-0 bg-foreground/5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Clubs & Orgs on Spark Bytes
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto">
                Discover campus groups that share leftover food and host community events.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{mockClubs.length} Active Clubs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Campus Filter */}
                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All campuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus} value={campus}>
                        {campus === "all" ? "All campuses" : campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
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
                  <Badge variant="secondary" className="flex items-center gap-1">
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
        <section className="container mx-auto px-6 py-8 max-w-6xl">
          {filteredClubs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                No clubs match your filters.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredClubs.length} of {mockClubs.length} clubs
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredClubs.map((club) => (
                  <Card
                    key={club.id}
                    className="group hover:shadow-md transition-all duration-300 rounded-2xl border border-slate-200 shadow-sm bg-white flex flex-col"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        {/* Logo or Initials */}
                        {club.logoUrl ? (
                          <img
                            src={club.logoUrl}
                            alt={club.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                            {club.shortName ? getInitials(club.shortName) : getInitials(club.name)}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                              {club.name}
                            </CardTitle>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {club.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-3 mt-2 text-sm">
                        {club.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {club.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium bg-slate-100 text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Campus Focus */}
                      <div className="text-xs text-muted-foreground">
                        Campus: {club.campusFocus}
                      </div>

                      {/* Followers */}
                      <div className="mt-auto pt-3 border-t flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {club.followers?.toLocaleString() || 0} followers
                        </span>
                        <Link to={`/clubs/${club.id}`}>
                          <Button
                            variant="default"
                            size="sm"
                            className="mt-3 text-xs font-medium rounded-full px-4 py-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            View Club
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

