import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/header";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, message } from "antd";

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventsCount, setEventsCount] = useState<number | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchClub = async () => {
      setLoading(true);
      const { data } = await supabase.from("clubs").select("*").eq("id", id).single();
      setClub(data);
      setEditValues(data);
      setLoading(false);
    };

    fetchClub();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchEventsCount = async () => {
      const byId = await supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("club_host", id);
      setEventsCount(byId.count || 0);
    };

    fetchEventsCount();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchFollowerData = async () => {
      const { count } = await supabase
        .from("follow_clubs")
        .select("*", { count: "exact", head: true })
        .eq("club_id", id);
      setFollowersCount(count || 0);
    };

    fetchFollowerData();
  }, [id]);

  useEffect(() => {
    if (!id || !userId) return;

    const checkFollowing = async () => {
      const { data } = await supabase
        .from("follow_clubs")
        .select("*")
        .eq("club_id", id)
        .eq("user_id", userId)
        .maybeSingle();

      setIsFollowing(!!data);
    };

    checkFollowing();
  }, [id, userId]);

  const toggleFollow = async () => {
    if (!userId) return;

    if (isFollowing) {
      await supabase
        .from("follow_clubs")
        .delete()
        .eq("club_id", id)
        .eq("user_id", userId);
      setIsFollowing(false);
      setFollowersCount((n) => n - 1);
    } else {
      await supabase.from("follow_clubs").insert({
        user_id: userId,
        club_id: id,
      });
      setIsFollowing(true);
      setFollowersCount((n) => n + 1);
    }
  };

  const handleSaveEdit = async () => {
    if (!club) return;
    const { error } = await supabase.from("clubs").update(editValues).eq("id", club.id);
    if (!error) {
      message.success("Club updated", 0.8);
      setClub({ ...club, ...editValues });
      setEditing(false);
    } else {
      message.error("Failed to save changes");
    }
  };

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

  const isCreator = userId === club?.created_by;

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
                {(club.name || "??").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
              </div>
            )}

            <div className="flex-1">
              {editing ? (
                <Input
                  value={editValues.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  className="mb-1"
                />
              ) : (
                <h1 className="text-2xl font-bold">{club.name}</h1>
              )}
              <div className="flex gap-2 items-center mt-1">
                <span className="text-sm text-muted-foreground">{club.category || "Uncategorized"}</span>
                <Badge variant="outline">{club.campus_focus || "All campuses"}</Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Followers</div>
              <div className="text-xl font-semibold">{followersCount}</div>
              <div className="mt-3">
                <Link to={`/clubs/${club.id}/events`}>
                  <Button size="sm">View Events</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {!isCreator && (
              <Button
                onClick={toggleFollow}
                className={isFollowing ? "bg-gray-500 hover:bg-gray-600" : ""}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>

          <div className="mt-6">
            {editing ? (
              <>
                <Input.TextArea
                  value={editValues.description}
                  onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                  rows={3}
                  className="mb-2"
                />
                <Input
                  value={editValues.website}
                  onChange={(e) => setEditValues({ ...editValues, website: e.target.value })}
                  placeholder="Website"
                  className="mb-2"
                />
                <Input
                  value={editValues.contact_email}
                  onChange={(e) => setEditValues({ ...editValues, contact_email: e.target.value })}
                  placeholder="Contact Email"
                />
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{club.description || "No description provided."}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <a href={`mailto:${club.contact_email}`} className="text-sm text-blue-600">
                        {club.contact_email}
                      </a>
                    ) : (
                      <div className="text-sm text-muted-foreground">—</div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Created</div>
                <div className="text-sm text-muted-foreground">
                  {club.created_at ? new Date(club.created_at).toLocaleString() : "—"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Events Created</div>
                <div className="text-lg font-semibold">{eventsCount ?? "—"}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/clubs">
                <Button variant="ghost">Back</Button>
              </Link>

              {isCreator && !editing && (
                <Button onClick={() => setEditing(true)}>Edit Club</Button>
              )}
              {editing && (
                <>
                  <Button onClick={handleSaveEdit}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
