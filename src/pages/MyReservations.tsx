import { useEffect, useState } from "react";
import Header from "../components/header";
import { supabase } from "../lib/supabaseClient";

export default function MyReservations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { data: reservations } = await supabase
        .from("reservations")
        .select("*, events(title)")
        .eq("user_id", user.data.user.id);

      setData(reservations || []);
    };

    load();
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Reservations</h1>

        {data.length === 0 ? (
          <p>You have no reservations.</p>
        ) : (
          data.map((r: any) => (
            <div key={r.id} className="border p-4 rounded mb-3">
              <p className="font-semibold">{r.events.title}</p>
              <p>{r.food_name}</p>
              <p className="text-sm text-gray-400">
                Reserved at {new Date(r.reserved_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
