import Header from "../components/header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>
          Welcome to TerrierTable
        </h1>
        <p style={{ fontSize: 18, color: "#555" }}>
          Available Events
        </p>
        {/*to add here event handling once we have the backend set up*/}
      </main>
    </>
  );
}
