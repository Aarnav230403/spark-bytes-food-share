import { Button, Menu } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateEventModal from "@/pages/CreateEvent";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { key: "home", label: "Home", onClick: () => navigate("/") },
    { key: "events", label: "Events", onClick: () => navigate("/homepage") },
    { key: "clubs", label: "Clubs", onClick: () => navigate("/clubs") },
    { key: "my-events", label: "My Events", onClick: () => navigate("/my-events") },
    { key: "reservations", label: "My Reservations", onClick: () => navigate("/myreservations") }, 
    { key: "profile", label: "Profile", onClick: () => navigate("/profile") },
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
    left: {
      display: "flex",
      alignItems: "center",
      gap: 8,
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
  };

  return (
    <><header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <div style={styles.logoBox}>TT</div>
          <h1 style={styles.logoText}>TerrierTable</h1>
        </div>
        <Menu mode="horizontal" items={menuItems} style={styles.menu} />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
          style={styles.button}
        >
          Create Event
        </Button>
      </div>
    </header><CreateEventModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}