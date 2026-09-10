import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Apex Global Academy",
  description:
    "Contact Apex Global Academy, a leading primary school in Katsina, Nigeria. Address, phone, and email.",
};

export default function ContactPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        color: "white",
        padding: "120px 32px 80px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 24 }}>
          Contact Us
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 40,
          }}
        >
          We'd love to hear from you. Reach out to us for admissions, inquiries,
          or any other information.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            marginBottom: 60,
          }}
        >
          <div
            style={{
              padding: 24,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Address</h3>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              Barhim, Mani Road, Katsina, Katsina State, Nigeria
            </p>
          </div>
          <div
            style={{
              padding: 24,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Phone</h3>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>+234 800 000 0000</p>
          </div>
          <div
            style={{
              padding: 24,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Email</h3>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              info@apexglobalacademy.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
