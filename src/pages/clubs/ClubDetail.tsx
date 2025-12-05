// src/pages/ClubDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/header";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventsCount, setEventsCount] = useState<number | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    const fetchClub = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching club:", error);
        setClub(null);
      } else {
        setClub(data);
        setFollowersCount(data?.followers ? Number(data.followers) : 0);
      }

      setLoading(false);
    };

    const fetchEventsCount = async (clubRow: any | null) => {
      if (!clubRow) {
        setEventsCount(0);
        return;
      }

      // Try to count events by club id first, then by club name if needed
      try {
        // head:true with count returns count in count property (no rows)
        const byId = await supabase
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("club_host", id);

        const countById = (byId && (byId.count || 0)) as number;

        if (countById > 0) {
          setEventsCount(countById);
          return;
        }

        // fallback: maybe events store club name in club_host
        const byName = await supabase
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("club_host", clubRow.name);

        setEventsCount((byName && (byName.count || 0)) as number);
      } catch (err) {
        console.error("Error counting events:", err);
        setEventsCount(null);
      }
    };

    fetchClub().then(() => {
      // after club fetched, count events
      // small delay to ensure club state is set (or you can call with returned value)
      setTimeout(() => {
        fetchEventsCount(club);
      }, 0);
    });
  }, [id]);

  // Realtime: subscribe to changes for this club row
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`club-detail-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clubs", filter: `id=eq.${id}` },
        (payload) => {
          const { eventType, new: newRow } = payload;
          if (eventType === "UPDATE" || eventType === "INSERT") {
            setClub(newRow);
            setFollowersCount(newRow?.followers ? Number(newRow.followers) : 0);
          }
          if (eventType === "DELETE") {
            setClub(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-6 py-12">
          <p>Loading club…</p>
        </main>
      </>
    );
  }

  if (!club) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-6 py-12">
          <p>Club not found.</p>
          <Link to="/clubs">
            <Button>Back to Clubs</Button>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center gap-4">
            {club.logo_url ? (
              <img src={club.logo_url} alt={club.name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white text-xl">
                {(club.name || "??").split(" ").map((w: string) => w[0]).join("").slice(0,2)}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{club.name}</h1>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-sm text-muted-foreground">{club.category || "Uncategorized"}</span>
                <Badge variant="outline">{club.campus_focus || "All campuses"}</Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Followers</div>
              <div className="text-xl font-semibold">{followersCount?.toLocaleString() ?? 0}</div>

              <div className="mt-3">
                <Link to={`/clubs/${club.id}/events`}>
                  <Button size="sm">View Events</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground">{club.description || "No description provided."}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(Array.isArray(club.tags) ? club.tags : club.tags ? [club.tags] : []).map((t: string, i: number) => (
                <Badge key={i} variant="secondary">{t}</Badge>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Website</div>
                {club.website ? (
                  <a href={club.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600">
                    {club.website}
                  </a>
                ) : (
                  <div className="text-sm text-muted-foreground">—</div>
                )}
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Contact Email</div>
                {club.contact_email ? (
                  <a href={`mailto:${club.contact_email}`} className="text-sm text-blue-600">{club.contact_email}</a>
                ) : (
                  <div className="text-sm text-muted-foreground">—</div>
                )}
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Created</div>
                <div className="text-sm text-muted-foreground">
                  {club.created_at ? new Date(club.created_at).toLocaleString() : "—"}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-muted-foreground">Events Created</div>
              <div className="text-lg font-semibold">{eventsCount ?? "—"}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/clubs">
                <Button variant="ghost">Back</Button>
              </Link>
              {/* Example action: follow/unfollow (client-only UI placeholder) */}
              <Button
                onClick={async () => {
                  // optional: implement follow logic here (update followers in table)
                  // naive UI-only increment:
                  const newCount = (followersCount || 0) + 1;
                  setFollowersCount(newCount);

                  // Try updating club followers in DB (if column exists)
                  try {
                    const { error } = await supabase
                      .from("clubs")
                      .update({ followers: newCount })
                      .eq("id", club.id);

                    if (error) {
                      console.error("Could not update followers:", error);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Follow
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}