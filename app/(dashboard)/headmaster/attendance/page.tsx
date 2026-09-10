"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { Calendar, Search } from "lucide-react";
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

const Input = styled.input`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  width: 200px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
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

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

export default function HeadmasterAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedClass, setSelectedClass] = useState("Primary 1");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("today");

  const classes = [
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
  ];

  useEffect(() => {
    fetchData();
  }, [selectedClass, selectedDate, viewMode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (viewMode === "today") {
        const url = `/attendance/headmaster/class?class=${selectedClass}${
          selectedDate ? `&date=${selectedDate}` : ""
        }`;
        const res = await api.get(url);
        setAttendance(res.data);
      } else {
        const res = await api.get(
          `/attendance/headmaster/history?class=${selectedClass}&days=30`
        );
        setHistory(res.data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );

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
      <Title>📊 Attendance</Title>
      <Subtitle>View attendance for all classes</Subtitle>

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
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Button
            onClick={() => setViewMode("today")}
            style={{
              background:
                viewMode === "today"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255,255,255,0.1)",
            }}
          >
            <Calendar size={16} /> Today
          </Button>
          <Button
            onClick={() => setViewMode("history")}
            style={{
              background:
                viewMode === "history"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255,255,255,0.1)",
            }}
          >
            <Calendar size={16} /> History (30 days)
          </Button>
        </FilterSection>

        {viewMode === "today" ? (
          <>
            <h3 style={{ color: "white", marginBottom: 16 }}>
              Today's Attendance
            </h3>
            <Table>
              <thead>
                <tr>
                  <Th>Pupil</Th>
                  <Th>Admission No</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <Td colSpan={3} style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                      No attendance records for today
                    </Td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <motion.tr
                      key={record._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Td>{record.pupilId?.name || "Unknown"}</Td>
                      <Td>{record.pupilId?.admissionNumber || "-"}</Td>
                      <Td>
                        <StatusBadge status={record.status}>
                          {record.status}
                        </StatusBadge>
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
              Attendance History (Last 30 Days)
            </h3>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Pupil</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <Td colSpan={3} style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                      No history available
                    </Td>
                  </tr>
                ) : (
                  history.slice(0, 50).map((record) => (
                    <motion.tr
                      key={record._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Td>{new Date(record.date).toLocaleDateString()}</Td>
                      <Td>{record.pupilId?.name || "Unknown"}</Td>
                      <Td>
                        <StatusBadge status={record.status}>
                          {record.status}
                        </StatusBadge>
                      </Td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </Table>
          </>
        )}
      </GlassCard>
    </Container>
  );
}