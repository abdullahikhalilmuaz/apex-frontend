"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";
import { Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const SUBJECTS = [
  "English Studies",
  "Mathematics",
  "Basic Science",
  "Basic Technology",
  "Computer Studies",
  "Physical and Health Education",
  "Social Studies",
  "Civic Education",
  "Security Education",
  "Islamic Religion Studies",
  "Christian Religion Studies",
  "Agricultural Science",
  "Home Economics",
  "Yoruba",
  "Hausa",
  "Igbo",
  "French",
  "Arabic",
  "Cultural and Creative Arts",
  "History",
];
const TERMS = ["First", "Second", "Third"];
const SESSIONS = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"];

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

const Select = styled.select`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  margin-right: 12px;
  margin-bottom: 16px;
  option {
    color: black;
  }
`;

const Table = styled.table`
  width: 100%;
  color: white;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 14px;
`;

const NumInput = styled.input`
  width: 55px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: white;
  text-align: center;
`;

const SaveBtn = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

type Student = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
};
type SubScore = { ca1: number; ca2: number; ca3: number; exam: number };

export default function TeacherResults() {
  const { className, loading: classLoading } = useTeacherClass();
  const [term, setTerm] = useState("First");
  const [session, setSession] = useState("2026/2027");
  const [activeSubject, setActiveSubject] = useState("English Studies");
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<
    Record<string, Record<string, SubScore>>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    if (!className) return;
    (async () => {
      setLoading(true);
      try {
        const sRes = await appApi.get(
          `/students/class/${encodeURIComponent(className)}`,
        );
        setStudents(sRes.data);

        const rRes = await appApi
          .get(
            `/results/class/${encodeURIComponent(
              className,
            )}?term=${term}&session=${encodeURIComponent(session)}`,
          )
          .catch(() => ({ data: [] }));
        const existing = rRes.data || [];
        setHasExisting(existing.length > 0);

        const merged: Record<string, Record<string, SubScore>> = {};
        existing.forEach((r: any) => {
          const sid = r.studentId?._id || r.studentId;
          if (!sid) return;
          merged[sid] = {};
          r.subjects.forEach((s: any) => {
            merged[sid][s.subject] = {
              ca1: s.ca1 ?? s.ca ?? 0,
              ca2: s.ca2 || 0,
              ca3: s.ca3 || 0,
              exam: s.exam || 0,
            };
          });
        });
        setScores(merged);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [className, term, session]);

  const update = (sid: string, field: keyof SubScore, value: string) => {
    const n = parseInt(value || "0");
    setScores((prev) => {
      const sScores = prev[sid] || {};
      const sc = sScores[activeSubject] || {
        ca1: 0,
        ca2: 0,
        ca3: 0,
        exam: 0,
      };
      return {
        ...prev,
        [sid]: {
          ...sScores,
          [activeSubject]: { ...sc, [field]: isNaN(n) ? 0 : n },
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const results = students.map((s) => {
        const sScores = scores[s._id] || {};
        const subjects = SUBJECTS.filter((sub) => {
          const sc = sScores[sub];
          if (!sc) return false;
          return sc.ca1 > 0 || sc.ca2 > 0 || sc.ca3 > 0 || sc.exam > 0;
        }).map((sub) => ({
          subject: sub,
          ca1: sScores[sub]?.ca1 || 0,
          ca2: sScores[sub]?.ca2 || 0,
          ca3: sScores[sub]?.ca3 || 0,
          exam: sScores[sub]?.exam || 0,
        }));
        return { studentId: s._id, subjects };
      });

      await appApi.post("/results", {
        class: className,
        term,
        session,
        results,
      });

      toast.success(hasExisting ? "Results updated" : "Results published");
      setHasExisting(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading || classLoading) {
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster position="top-right" />
      <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
        {hasExisting ? "✏️ Edit Results" : "📊 Enter Results"}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
        {className} — 3 CAs (each /10) + Exam (/70)
      </p>

      <GlassCard style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <Select
            value={activeSubject}
            onChange={(e) => setActiveSubject(e.target.value)}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select value={term} onChange={(e) => setTerm(e.target.value)}>
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t} Term
              </option>
            ))}
          </Select>
          <Select value={session} onChange={(e) => setSession(e.target.value)}>
            {SESSIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Student</Th>
              <Th>CA1</Th>
              <Th>CA2</Th>
              <Th>CA3</Th>
              <Th>Exam</Th>
              <Th>Total</Th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const sc = scores[s._id]?.[activeSubject] || {
                ca1: 0,
                ca2: 0,
                ca3: 0,
                exam: 0,
              };
              const total = sc.ca1 + sc.ca2 + sc.ca3 + sc.exam;
              return (
                <tr key={s._id}>
                  <Td>
                    {s.firstName} {s.middleName} {s.lastName}
                  </Td>
                  <Td>
                    <NumInput
                      type="number"
                      min="0"
                      max="10"
                      value={sc.ca1 || ""}
                      onChange={(e) => update(s._id, "ca1", e.target.value)}
                    />
                  </Td>
                  <Td>
                    <NumInput
                      type="number"
                      min="0"
                      max="10"
                      value={sc.ca2 || ""}
                      onChange={(e) => update(s._id, "ca2", e.target.value)}
                    />
                  </Td>
                  <Td>
                    <NumInput
                      type="number"
                      min="0"
                      max="10"
                      value={sc.ca3 || ""}
                      onChange={(e) => update(s._id, "ca3", e.target.value)}
                    />
                  </Td>
                  <Td>
                    <NumInput
                      type="number"
                      min="0"
                      max="70"
                      value={sc.exam || ""}
                      onChange={(e) => update(s._id, "exam", e.target.value)}
                    />
                  </Td>
                  <Td>
                    <strong>{total}</strong>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <SaveBtn onClick={handleSave} disabled={saving}>
          <Save size={20} />{" "}
          {saving
            ? "Saving..."
            : hasExisting
              ? "Update Results"
              : "Publish Results"}
        </SaveBtn>
      </GlassCard>
    </Container>
  );
}
