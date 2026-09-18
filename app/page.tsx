import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#07509c",
        color: "white",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Link
        href="/worker"
        style={{
          color: "white",
          textDecoration: "none",
          padding: "14px 22px",
          borderRadius: "14px",
          background: "rgba(255,255,255,.14)",
        }}
      >
        Ir al panel de trabajador
      </Link>
    </main>
  );
}