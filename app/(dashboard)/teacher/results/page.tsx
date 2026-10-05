"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";
import { Save, ChevronDown, ChevronUp } from "lucide-react";
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
  height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  flex-shrink: 0;
  font-size: 13px;
`;

const FilterCard = styled(GlassCard)`
  padding: 20px 24px;
  margin-bottom: 16px;
  flex-shrink: 0;

  &:hover {
    transform: none;
  }
`;

const ClassValue = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
  margin-bottom: 14px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  display: block;
  margin-bottom: 6px;
`;

const Select = styled.select`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  width: 100%;
  margin-bottom: 12px;

  option {
    color: black;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

const StudentsScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 4px;
  margin-bottom: 12px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const StudentCard = styled(GlassCard)`
  margin-bottom: 12px;
  padding: 16px 20px;

  &:hover {
    transform: none;
  }
`;

const StudentHeader = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  text-align: left;

  &:focus {
    outline: none;
  }
`;

const ExpandIcon = styled.span`
  color: #667eea;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const SubjectsScroll = styled.div`
  margin-top: 16px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
`;

const SubjectHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 130px 50px 50px 50px 55px 55px;
  gap: 6px;
  align-items: center;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  min-width: fit-content;
`;

const SubjectLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;
`;

const SubjectLabelLeft = styled(SubjectLabel)`
  text-align: left;
`;

const SubjectRow = styled.div`
  display: grid;
  grid-template-columns: 130px 50px 50px 50px 55px 55px;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
  min-width: fit-content;
`;

const SubjectName = styled.span`
  color: white;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ScoreInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  text-align: center;
  font-size: 12px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.15);
  }
`;

const TotalText = styled.span`
  color: #667eea;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
`;

const PublishBtn = styled.button`
  padding: 14px 24px;
  background: #667eea;
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  font-size: 15px;
  width: 100%;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #5568c9;
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -8px rgba(102, 126, 234, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

type Student = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
};
type SubScore = { ca1: number; ca2: number; ca3: number; exam: number };

export default function TeacherResults() {
  const {
    className,
    loading: classLoading,
    error: classError,
  } = useTeacherClass();
  const [term, setTerm] = useState("First");
  const [session, setSession] = useState("2026/2027");
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<
    Record<string, Record<string, SubScore>>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStudent, setActiveStudent] = useState<string | null>(null);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    if (!className) return;
    (async () => {
      setLoading(true);
      try {
        const studentsRes = await appApi.get(
          `/students/class/${encodeURIComponent(className)}`,
        );
        setStudents(studentsRes.data);

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

  const updateScore = (
    studentId: string,
    subject: string,
    field: keyof SubScore,
    value: string,
  ) => {
    const num = parseInt(value || "0");
    setScores((prev) => {
      const studentScores = prev[studentId] || {};
      const subjectScore = studentScores[subject] || {
        ca1: 0,
        ca2: 0,
        ca3: 0,
        exam: 0,
      };
      return {
        ...prev,
        [studentId]: {
          ...studentScores,
          [subject]: {
            ...subjectScore,
            [field]: isNaN(num) ? 0 : num,
          },
        },
      };
    });
  };

  const handleSave = async () => {
    if (students.length === 0 || !className) return;
    setSaving(true);
    try {
      const results = students.map((s) => {
        const studentScores = scores[s._id] || {};
        const subjects = SUBJECTS.filter((sub) => {
          const sc = studentScores[sub];
          if (!sc) return false;
          return sc.ca1 > 0 || sc.ca2 > 0 || sc.ca3 > 0 || sc.exam > 0;
        }).map((sub) => ({
          subject: sub,
          ca1: studentScores[sub]?.ca1 || 0,
          ca2: studentScores[sub]?.ca2 || 0,
          ca3: studentScores[sub]?.ca3 || 0,
          exam: studentScores[sub]?.exam || 0,
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

  const buttonLabel = saving
    ? "Saving..."
    : hasExisting
      ? `Update ${term} Term Results`
      : `Publish ${term} Term Results`;

  if (classLoading) {
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );
  }

  if (!className) {
    return (
      <Container>
        <GlassCard style={{ padding: 40 }}>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              margin: 0,
            }}
          >
            {classError || "No class assigned to your account"}
          </p>
        </GlassCard>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster position="top-right" />
      <Title>{hasExisting ? "Edit Results" : "Publish Results"}</Title>
      <Subtitle>Enter 3 CAs (each /10) + Exam (/70) per subject</Subtitle>

      <FilterCard>
        <Label>Your Class</Label>
        <ClassValue>{className}</ClassValue>

        <Label>Term</Label>
        <Select value={term} onChange={(e) => setTerm(e.target.value)}>
          {TERMS.map((t) => (
            <option key={t} value={t}>
              {t} Term
            </option>
          ))}
        </Select>

        <Label>Session</Label>
        <Select value={session} onChange={(e) => setSession(e.target.value)}>
          {SESSIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </FilterCard>

      <StudentsScroll>
        {loading ? (
          <div style={{ color: "white", textAlign: "center", padding: 40 }}>
            Loading...
          </div>
        ) : students.length === 0 ? (
          <GlassCard style={{ padding: 40 }}>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                margin: 0,
              }}
            >
              No students in {className}
            </p>
          </GlassCard>
        ) : (
          students.map((s) => {
            const isActive = activeStudent === s._id;
            const studentScores = scores[s._id] || {};
            return (
              <StudentCard key={s._id}>
                <StudentHeader
                  onClick={() => setActiveStudent(isActive ? null : s._id)}
                >
                  <span>
                    {s.firstName} {s.middleName ? s.middleName + " " : ""}
                    {s.lastName}
                  </span>
                  <ExpandIcon>
                    {isActive ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </ExpandIcon>
                </StudentHeader>

                {isActive && (
                  <SubjectsScroll>
                    <SubjectHeaderRow>
                      <SubjectLabelLeft>Subject</SubjectLabelLeft>
                      <SubjectLabel>CA1</SubjectLabel>
                      <SubjectLabel>CA2</SubjectLabel>
                      <SubjectLabel>CA3</SubjectLabel>
                      <SubjectLabel>Exam</SubjectLabel>
                      <SubjectLabel>Total</SubjectLabel>
                    </SubjectHeaderRow>

                    {SUBJECTS.map((sub) => {
                      const cs = studentScores[sub] || {
                        ca1: 0,
                        ca2: 0,
                        ca3: 0,
                        exam: 0,
                      };
                      const total = cs.ca1 + cs.ca2 + cs.ca3 + cs.exam;
                      return (
                        <SubjectRow key={sub}>
                          <SubjectName title={sub}>{sub}</SubjectName>
                          <ScoreInput
                            type="number"
                            min="0"
                            max="10"
                            value={cs.ca1 || ""}
                            onChange={(e) =>
                              updateScore(s._id, sub, "ca1", e.target.value)
                            }
                            placeholder="0"
                          />
                          <ScoreInput
                            type="number"
                            min="0"
                            max="10"
                            value={cs.ca2 || ""}
                            onChange={(e) =>
                              updateScore(s._id, sub, "ca2", e.target.value)
                            }
                            placeholder="0"
                          />
                          <ScoreInput
                            type="number"
                            min="0"
                            max="10"
                            value={cs.ca3 || ""}
                            onChange={(e) =>
                              updateScore(s._id, sub, "ca3", e.target.value)
                            }
                            placeholder="0"
                          />
                          <ScoreInput
                            type="number"
                            min="0"
                            max="70"
                            value={cs.exam || ""}
                            onChange={(e) =>
                              updateScore(s._id, sub, "exam", e.target.value)
                            }
                            placeholder="0"
                          />
                          <TotalText>{total}</TotalText>
                        </SubjectRow>
                      );
                    })}
                  </SubjectsScroll>
                )}
              </StudentCard>
            );
          })
        )}
      </StudentsScroll>

      {students.length > 0 && (
        <PublishBtn onClick={handleSave} disabled={saving}>
          <Save size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
          {buttonLabel}
        </PublishBtn>
      )}
    </Container>
  );
}
