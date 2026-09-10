import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Apex Global Academy",
  description:
    "Learn about Apex Global Academy, a leading primary school in Katsina, Nigeria, dedicated to nurturing bright minds for a brighter future.",
};

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        color: "white",
        padding: "120px 32px 80px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 24 }}>
          About Apex Global Academy
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 24,
          }}
        >
          Apex Global Academy is a premier primary school located in Barhim, Mani Road, Katsina,
          Nigeria. We are dedicated to providing quality education that
          combines academic excellence with strong moral values.
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
          Our Mission
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 24,
          }}
        >
          To nurture bright minds for a brighter future by providing a
          supportive, stimulating, and secure learning environment where every
          child can reach their full potential.
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
          Our Vision
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          To be the leading primary school in Northern Nigeria, known for
          academic excellence, innovation, and character development.
        </p>
      </div>
    </div>
  );
}