import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admissions | Apex Global Academy",
  description:
    "Apply for admission into Apex Global Academy, a leading primary school in Katsina, Nigeria. Admissions open for Primary 1 - Primary 6.",
};

export default function AdmissionsPage() {
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
          Admissions
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 40,
          }}
        >
          Admissions are now open for Primary 1 to Primary 5.
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>
          Requirements
        </h2>
        <ul
          style={{
            fontSize: 16,
            lineHeight: 2,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 40,
            paddingLeft: 24,
          }}
        >
          <li>Birth Certificate</li>
          <li>Previous School Report Card (if applicable)</li>
          <li>Passport Photographs (4 copies)</li>
          <li>Parent/Guardian ID Card</li>
        </ul>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>
          How to Apply
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.75)",
            marginBottom: 24,
          }}
        >
          Visit our school in Katsina or contact us via phone or email. Our
          admissions team will guide you through the process.
        </p>
        <a
          href="/contact"
          style={{
            display: "inline-block",
            padding: "16px 36px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 16,
            color: "white",
            textDecoration: "none",
            fontWeight: 600,
            marginTop: 20,
          }}
        >
          Contact Admissions
        </a>
      </div>
    </div>
  );
}
