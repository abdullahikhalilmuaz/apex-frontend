"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { CheckCircle, Circle } from "lucide-react";

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

const WeekCard = styled(GlassCard)`
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

const WeekInfo = styled.div`
  flex: 1;
`;

const WeekTitle = styled.h3`
  color: white;
  font-size: 16px;
`;

const WeekSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const StatusIcon = styled.div<{ completed: boolean }>`
  color: ${(props) => (props.completed ? "#34d399" : "rgba(255,255,255,0.3)")};
`;

export default function TeacherScheme() {
  const [schemes, setSchemes] = useState([]);
  const [selectedClass, setSelectedClass] = useState("Primary 1");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
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
    "English",
    "Mathematics",
    "Basic Science",
    "Social Studies",
    "Civic Education",
    "Computer Studies",
  ];

  useEffect(() => {
    fetchSchemes();
  }, [selectedClass]);

  const fetchSchemes = async () => {
    try {
      const res = await api.get(`/schemes/class/${selectedClass}`);
      setSchemes(res.data);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = async (schemeId, weekIndex) => {
    try {
      const scheme = schemes.find((s) => s._id === schemeId);
      const week = scheme.weeks[weekIndex];

      await api.put(`/schemes/${schemeId}/week`, {
        weekNumber: week.weekNumber,
      });
      fetchSchemes();
    } catch (error) {
      console.error("Error updating scheme:", error);
    }
  };

  const currentScheme = schemes.find((s) => s.subject === selectedSubject);

  if (loading)
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );

  return (
    <Container>
      <Title>📚 Scheme of Work</Title>
      <Subtitle>Track your curriculum progress</Subtitle>

      <GlassCard style={{ padding: 24 }}>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
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
        </div>

        {!currentScheme ? (
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              padding: 40,
            }}
          >
            No scheme found for {selectedSubject}
          </div>
        ) : (
          <>
            <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
              {currentScheme.weeks.filter((w) => w.completed).length} /{" "}
              {currentScheme.weeks.length} weeks completed
            </div>
            {currentScheme.weeks.map((week, index) => (
              <WeekCard
                key={index}
                onClick={() => toggleWeek(currentScheme._id, index)}
              >
                <WeekInfo>
                  <WeekTitle>
                    Week {week.weekNumber}: {week.topic}
                  </WeekTitle>
                  <WeekSubtitle>{week.subtopics?.join(" • ")}</WeekSubtitle>
                </WeekInfo>
                <StatusIcon completed={week.completed}>
                  {week.completed ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </StatusIcon>
              </WeekCard>
            ))}
          </>
        )}
      </GlassCard>
    </Container>
  );
}
