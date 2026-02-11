export default function Home() {
  console.log("[v0] Home page rendered on server");
  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Contrail Coffee - Test
      </h1>
      <p>This page should be visible at /</p>
    </main>
  );
}
