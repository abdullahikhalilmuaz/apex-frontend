import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Apex Global Academy",
  description:
    "Explore photos from Apex Global Academy, a leading primary school in Katsina, Nigeria.",
};

export default function GalleryPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        color: "white",
        padding: "120px 32px 80px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          School Gallery
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
            marginBottom: 60,
          }}
        >
          Moments from Apex Global Academy
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                aspectRatio: "4/3",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
                fontSize: 14,
              }}
            >
              Image {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}