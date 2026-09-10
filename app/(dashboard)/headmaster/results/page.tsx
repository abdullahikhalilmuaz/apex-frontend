"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { Search, TrendingUp } from "lucide-react";
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

const Select = styled.select`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  margin-right: 12px;
  width: 200px;

  option {
    color: black;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const PerformanceCard = styled(GlassCard)`
  padding: 20px;
  margin-bottom: 16px;
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

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: center;
`;

const Button = styled.button<{ active?: boolean }>`
  padding: 10px 20px;
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "rgba(255, 255, 255, 0.1)"};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function HeadmasterResults() {
  const [results, setResults] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [selectedClass, setSelectedClass] = useState("Primary 1");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedTerm, setSelectedTerm] = useState("First");
  const [viewMode, setViewMode] = useState("results");
  const [loading, setLoading] = useState(true);

  const classes = [
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
  ];
  const subjects = [
    "All",
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
  }, [selectedClass, selectedSubject, selectedTerm, viewMode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (viewMode === "results") {
        const url = `/results/headmaster/class?class=${selectedClass}&term=${selectedTerm}${
          selectedSubject !== "All" ? `&subject=${selectedSubject}` : ""
        }`;
        const res = await api.get(url);
        setResults(res.data);
      } else {
        const url = `/results/headmaster/performance?class=${selectedClass}&term=${selectedTerm}`;
        const res = await api.get(url);
        setPerformance(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
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
      <Title>📊 Results</Title>
      <Subtitle>View and analyze student performance</Subtitle>

      <GlassCard style={{ padding: 24 }}>
        <FilterSection>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
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
          <Button
            active={viewMode === "results"}
            onClick={() => setViewMode("results")}
          >
            Results
          </Button>
          <Button
            active={viewMode === "performance"}
            onClick={() => setViewMode("performance")}
          >
            <TrendingUp size={16} /> Performance
          </Button>
        </FilterSection>

        {viewMode === "results" ? (
          <>
            <h3 style={{ color: "white", marginBottom: 16 }}>
              Student Results
            </h3>
            <Table>
              <thead>
                <tr>
                  <Th>Pupil</Th>
                  <Th>Admission No</Th>
                  <Th>Subject</Th>
                  <Th>CA</Th>
                  <Th>Exam</Th>
                  <Th>Total</Th>
                  <Th>Grade</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <Td colSpan={8} style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                      No results found
                    </Td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <motion.tr
                      key={result._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Td>{result.pupilId?.name || "Unknown"}</Td>
                      <Td>{result.pupilId?.admissionNumber || "-"}</Td>
                      <Td>{result.subject}</Td>
                      <Td>{result.caScore}</Td>
                      <Td>{result.examScore}</Td>
                      <Td>{result.total}</Td>
                      <Td>
                        <GradeBadge grade={result.grade}>
                          {result.grade}
                        </GradeBadge>
                      </Td>
                      <Td>
                        {result.isPublished ? (
                          <span style={{ color: "#34d399" }}>✅ Published</span>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.4)" }}>📝 Draft</span>
                        )}
                      </Td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </Table>
          </>
        ) : (
          <>
            <h3 style={{ color: "white", marginBottom: 16 }}>
              Class Performance Summary
            </h3>
            {performance.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                No performance data available
              </p>
            ) : (
              performance.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <PerformanceCard>
                    <h4 style={{ color: "white", fontSize: 18, marginBottom: 8 }}>
                      {item.subject}
                    </h4>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <div>
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>Average Score</span>
                        <div style={{ color: "white", fontSize: 24, fontWeight: 700 }}>
                          {item.average}%
                        </div>
                      </div>
                      <div>
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>Students</span>
                        <div style={{ color: "white", fontSize: 24, fontWeight: 700 }}>
                          {item.studentCount}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>Grade Distribution</span>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          {Object.keys(item.gradeDistribution || {}).map((grade) => (
                            <span
                              key={grade}
                              style={{
                                padding: "2px 10px",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.1)",
                                color: "white",
                                fontSize: "13px",
                              }}
                            >
                              {grade}: {item.gradeDistribution[grade]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PerformanceCard>
                </motion.div>
              ))
            )}
          </>
        )}
      </GlassCard>
    </Container>
  );
}