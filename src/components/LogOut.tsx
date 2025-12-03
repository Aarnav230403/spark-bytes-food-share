import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  onAfterLogout?: () => void;
  redirectTo?: string;
  label?: string;
};

export default function LogoutButton({
  onAfterLogout,
  redirectTo = "/",
  label = "Log out",
}: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("someClientFlag");

      if (onAfterLogout) {
        onAfterLogout();
      }

      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error("Logout failed:", err?.message ?? err);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleLogout} disabled={loading} size="sm">
      {loading ? "Signing out…" : label}
    </Button>
  );
}
