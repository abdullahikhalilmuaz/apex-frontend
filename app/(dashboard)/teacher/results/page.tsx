"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import styled from "@emotion/styled";
import { Save, Send, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
`;

const Table = styled.table`
  width: 100%;
  color: white;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Input = styled.input`
  width: 80px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Select = styled.select`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  margin-bottom: 20px;
  width: 200px;
  margin-right: 12px;

  option {
    color: black;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Button = styled.button<{ variant?: "primary" | "success" }>`
  padding: 12px 32px;
  background: ${(props) =>
    props.variant === "success"
      ? "linear-gradient(135deg, #34d399, #059669)"
      : "linear-gradient(135deg, #667eea, #764ba2)"};
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 40px -12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const GradeBadge = styled.span<{ grade: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.grade) {
      case "A":
        return "rgba(52, 211, 153, 0.3)";
      case "B":
        return "rgba(96, 165, 250, 0.3)";
      case "C":
        return "rgba(251, 191, 36, 0.3)";
      case "D":
        return "rgba(251, 146, 60, 0.3)";
      default:
        return "rgba(239, 68, 68, 0.3)";
    }
  }};
  color: ${(props) => {
    switch (props.grade) {
      case "A":
        return "#34d399";
      case "B":
        return "#60a5fa";
      case "C":
        return "#fbbf24";
      case "D":
        return "#fb923c";
      default:
        return "#f87171";
    }
  }};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PublishedBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(52, 211, 153, 0.2);
  color: #34d399;
`;

export default function TeacherResults() {
  const { user } = useAuth();
  const [pupils, setPupils] = useState([]);
  const [results, setResults] = useState({});
  const [savedResults, setSavedResults] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedTerm, setSelectedTerm] = useState("First");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [teacherClass, setTeacherClass] = useState("");

  const subjects = [
    "English",
    "Mathematics",
    "Basic Science",
    "Social Studies",
    "Civic Education",
    "Computer Studies",
  ];
  const terms = ["First", "Second", "Third"];

  useEffect(() => {
    fetchData();
  }, [selectedSubject, selectedTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get teacher profile
      const teacherRes = await api.get("/teacher/profile");
      setTeacherClass(teacherRes.data.classAssigned);

      // Get pupils for the class
      const pupilsRes = await api.get(`/pupils/class/${teacherRes.data.classAssigned}`);
      setPupils(pupilsRes.data);

      // Get existing results for this class
      const resultsRes = await api.get(
        `/results/teacher?subject=${selectedSubject}&term=${selectedTerm}`
      );
      setSavedResults(resultsRes.data);

      // Check if results are published
      if (resultsRes.data.length > 0) {
        setIsPublished(resultsRes.data[0].isPublished || false);
      } else {
        setIsPublished(false);
      }

      // Initialize form data
      const initial = {};
      pupilsRes.data.forEach((p) => {
        const existing = resultsRes.data.find((r) => r.pupilId._id === p._id);
        initial[p._id] = {
          ca: existing?.caScore || 0,
          exam: existing?.examScore || 0,
        };
      });
      setResults(initial);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateResult = (pupilId, field, value) => {
    setResults((prev) => ({
      ...prev,
      [pupilId]: {
        ...prev[pupilId],
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const getGrade = (ca, exam) => {
    const total = (ca || 0) + (exam || 0);
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    if (total >= 30) return "E";
    return "F";
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const promises = pupils.map((pupil) => {
        const data = {
          pupilId: pupil._id,
          subject: selectedSubject,
          caScore: results[pupil._id]?.ca || 0,
          examScore: results[pupil._id]?.exam || 0,
          term: selectedTerm,
          session: "2024/2025",
        };
        return api.post("/results", data);
      });
      await Promise.all(promises);
      toast.success("Results saved successfully! ✅");
      fetchData();
    } catch (error) {
      console.error("Error saving results:", error);
      toast.error("Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm("Publish results to parents? This cannot be undone.")) return;

    setPublishing(true);
    try {
      await api.post("/results/publish", {
        subject: selectedSubject,
        term: selectedTerm,
        session: "2024/2025",
      });
      setIsPublished(true);
      toast.success("Results published to parents! ✅");
      fetchData();
    } catch (error) {
      console.error("Error publishing results:", error);
      toast.error("Failed to publish results");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ color: "white", textAlign: "center", paddingTop: 100 }}>
          Loading...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: { iconTheme: { primary: "#34d399", secondary: "white" } },
          error: { iconTheme: { primary: "#f87171", secondary: "white" } },
        }}
      />
      <Title>📊 Enter Results</Title>
      <Subtitle>
        Enter CA and Exam scores for {teacherClass}
      </Subtitle>

      <GlassCard style={{ padding: 24 }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            {terms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          {isPublished && <PublishedBadge>Published</PublishedBadge>}
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>CA (40)</Th>
              <Th>Exam (60)</Th>
              <Th>Total</Th>
              <Th>Grade</Th>
            </tr>
          </thead>
          <tbody>
            {pupils.length === 0 ? (
              <tr>
                <Td colSpan={5} style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                  No pupils found
                </Td>
              </tr>
            ) : (
              pupils.map((pupil) => {
                const ca = results[pupil._id]?.ca || 0;
                const exam = results[pupil._id]?.exam || 0;
                const total = ca + exam;
                const grade = getGrade(ca, exam);
                return (
                  <motion.tr
                    key={pupil._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Td>{pupil.name}</Td>
                    <Td>
                      <Input
                        type="number"
                        min="0"
                        max="40"
                        value={ca}
                        onChange={(e) => updateResult(pupil._id, "ca", e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        min="0"
                        max="60"
                        value={exam}
                        onChange={(e) => updateResult(pupil._id, "exam", e.target.value)}
                      />
                    </Td>
                    <Td>{total}</Td>
                    <Td>
                      <GradeBadge grade={grade}>{grade}</GradeBadge>
                    </Td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </Table>

        <ButtonGroup>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save size={20} />
            {saving ? "Saving..." : "Save Results"}
          </Button>

          <Button
            variant="success"
            onClick={handlePublish}
            disabled={publishing || isPublished}
          >
            <Send size={20} />
            {publishing ? "Publishing..." : isPublished ? "Published" : "Publish to Parents"}
          </Button>
        </ButtonGroup>
      </GlassCard>
    </Container>
  );
}