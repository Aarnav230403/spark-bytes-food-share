import { Button, Dropdown, Menu } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateEventModal from "@/pages/CreateEvent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", user.id)
        .single();
      if (profile) {
        setAvatarUrl(profile.avatar_url);
        setUserName(profile.full_name || user.email?.split("@")[0] || "User");
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const onDropdownClick = ({ key }: { key: string }) => {
    if (key === "profile") navigate("/profile");
    if (key === "logout") handleLogout();
  };

  const dropdownItems = [
    { key: "profile", label: "Profile" },
    { key: "logout", label: "Logout" },
  ];

  const menuItems = [
    { key: "events", label: "Events", onClick: () => navigate("/homepage") },
    { key: "clubs", label: "Clubs", onClick: () => navigate("/clubs") },
    { key: "my-activity", label: "My Activity", onClick: () => navigate("/my-activity") },
    { key: "my-events", label: "My Events", onClick: () => navigate("/my-events") },
    { key: "reservations", label: "My Reservations", onClick: () => navigate("/myreservations") },
  ];

  const styles = {
    header: {
      position: "sticky" as const,
      top: 0,
      zIndex: 100,
      width: "100%",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #f0f0f0",
    },
    inner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: 64,
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 16px",
    },
    logoButton: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: 0,
    },
    logoBox: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: "#CC0000",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      fontSize: 20,
      fontWeight: 600,
      margin: 0,
    },
    menu: {
      flex: 1,
      justifyContent: "center",
      borderBottom: "none",
    },
    button: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#CC0000",
      gap: 4,
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    avatarContainer: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "4px 8px",
      borderRadius: 8,
      transition: "background-color 0.2s",
    },
    logoutButton: {
      backgroundColor: "#d9d9d9",
      border: "none",
    },
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.inner}>
          <button
            type="button"
            style={styles.logoButton}
            onClick={() => navigate("/")}
          >
            <div style={styles.logoBox}>TT</div>
            <h1 style={styles.logoText}>TerrierTable</h1>
          </button>

          <Menu mode="horizontal" items={menuItems} style={styles.menu} />

          <div style={styles.right}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpen(true)}
              style={styles.button}
            >
              Create Event
            </Button>

            <Dropdown
              menu={{ items: dropdownItems, onClick: onDropdownClick }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div
                style={styles.avatarContainer}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Avatar style={{ width: 36, height: 36 }}>
                  <AvatarImage src={avatarUrl || undefined} alt={userName} />
                  <AvatarFallback
                    style={{
                      fontSize: 14,
                      backgroundColor: "#CC0000",
                      color: "white",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>

      <CreateEventModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}