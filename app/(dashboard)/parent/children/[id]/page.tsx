"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { ArrowLeft, CheckCircle, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

const BackButton = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  &:hover {
    color: white;
  }
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled(GlassCard)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatValue = styled.div`
  color: white;
  font-size: 28px;
  font-weight: 700;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
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

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  background: ${(props) =>
    props.status === "present"
      ? "rgba(52, 211, 153, 0.2)"
      : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => (props.status === "present" ? "#34d399" : "#f87171")};
  text-transform: capitalize;
`;

export default function ChildDetail() {
  const params = useParams();
  const [child, setChild] = useState(null);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [childRes, resultsRes, attendanceRes] = await Promise.all([
        api.get(`/pupils/${params.id}`),
        api.get(`/results/parent/child/${params.id}`), // ← UPDATED ROUTE
        api.get(`/attendance/parent/child/${params.id}?days=30`),
      ]);
      setChild(childRes.data);
      setResults(resultsRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load child data");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    subjects: results.length,
    average:
      results.length > 0
        ? Math.round(
            results.reduce((acc, r) => acc + r.total, 0) / results.length,
          )
        : 0,
    attendance: attendance.filter((a) => a.status === "present").length || 0,
    totalDays: attendance.length || 1,
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
      <BackButton href="/parent/children">
        <ArrowLeft size={20} /> Back to Children
      </BackButton>

      <Title>{child?.name}</Title>
      <Subtitle>
        {child?.class} • Admission: {child?.admissionNumber}
      </Subtitle>

      <Grid>
        <StatCard>
          <StatIcon>
            <BookOpen size={24} />
          </StatIcon>
          <div>
            <StatValue>{stats.subjects}</StatValue>
            <StatLabel>Subjects</StatLabel>
          </div>
        </StatCard>
        <StatCard>
          <StatIcon>
            <CheckCircle size={24} />
          </StatIcon>
          <div>
            <StatValue>{stats.average}%</StatValue>
            <StatLabel>Average Score</StatLabel>
          </div>
        </StatCard>
        <StatCard>
          <StatIcon>
            <Clock size={24} />
          </StatIcon>
          <div>
            <StatValue>
              {Math.round((stats.attendance / stats.totalDays) * 100)}%
            </StatValue>
            <StatLabel>Attendance</StatLabel>
          </div>
        </StatCard>
      </Grid>

      <h2 style={{ color: "white", fontSize: 20, marginBottom: 16 }}>
        Results
      </h2>
      <GlassCard style={{ padding: 20, marginBottom: 24 }}>
        {results.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            No results available
          </p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Subject</Th>
                <Th>CA</Th>
                <Th>Exam</Th>
                <Th>Total</Th>
                <Th>Grade</Th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <motion.tr
                  key={result._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Td>{result.subject}</Td>
                  <Td>{result.caScore}</Td>
                  <Td>{result.examScore}</Td>
                  <Td>{result.total}</Td>
                  <Td>
                    <GradeBadge grade={result.grade}>{result.grade}</GradeBadge>
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        )}
      </GlassCard>

      <h2 style={{ color: "white", fontSize: 20, marginBottom: 16 }}>
        Attendance History
      </h2>
      <GlassCard style={{ padding: 20 }}>
        {attendance.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            No attendance records
          </p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {attendance.slice(0, 20).map((record) => (
                <motion.tr
                  key={record._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Td>{new Date(record.date).toLocaleDateString()}</Td>
                  <Td>
                    <StatusBadge status={record.status}>
                      {record.status}
                    </StatusBadge>
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        )}
      </GlassCard>
    </Container>
  );
}
