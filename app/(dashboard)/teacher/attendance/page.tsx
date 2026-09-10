"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import styled from "@emotion/styled";
import { Check, X, Save, History } from "lucide-react";
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

const StatusButton = styled.button<{ active: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.active ? "rgba(52, 211, 153, 0.3)" : "rgba(239, 68, 68, 0.3)"};
  color: ${(props) => (props.active ? "#34d399" : "#f87171")};

  &:hover {
    transform: scale(1.05);
  }
`;

const SaveButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 20px;
  margin: 32px 0 16px;
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

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [pupils, setPupils] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teacherClass, setTeacherClass] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get teacher's class
      const teacherRes = await api.get("/teacher/profile");
      const className = teacherRes.data.classAssigned;
      setTeacherClass(className);

      // Fetch pupils for that class
      const pupilsRes = await api.get(`/pupils/class/${className}`);
      setPupils(pupilsRes.data);

      // Initialize attendance
      const initial = {};
      pupilsRes.data.forEach((p) => {
        initial[p._id] = "present";
      });
      setAttendance(initial);

      // Fetch attendance history
      const historyRes = await api.get("/attendance/teacher/history?days=30");
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (pupilId) => {
    setAttendance((prev) => ({
      ...prev,
      [pupilId]: prev[pupilId] === "present" ? "absent" : "present",
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {
        class: teacherClass,
        attendance: pupils.map((p) => ({
          pupilId: p._id,
          status: attendance[p._id] || "present",
        })),
        term: "First",
        session: "2024/2025",
      };
      await api.post("/attendance/mark", data);
      toast.success("Attendance saved! ✅");
      fetchData();
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
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
      <Title>📋 Mark Attendance</Title>
      <Subtitle>Mark pupils as present or absent</Subtitle>

      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Class: {teacherClass} • {pupils.length} pupils
          </span>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Admission No</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {pupils.length === 0 ? (
              <tr>
                <Td
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  No pupils found in {teacherClass}
                </Td>
              </tr>
            ) : (
              pupils.map((pupil) => (
                <motion.tr
                  key={pupil._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Td>{pupil.name}</Td>
                  <Td>{pupil.admissionNumber}</Td>
                  <Td>
                    <StatusButton
                      active={attendance[pupil._id] === "present"}
                      onClick={() => toggleStatus(pupil._id)}
                    >
                      {attendance[pupil._id] === "present" ? (
                        <>
                          <Check size={14} /> Present
                        </>
                      ) : (
                        <>
                          <X size={14} /> Absent
                        </>
                      )}
                    </StatusButton>
                  </Td>
                </motion.tr>
              ))
            )}
          </tbody>
        </Table>

        {pupils.length > 0 && (
          <SaveButton onClick={handleSubmit} disabled={saving}>
            <Save size={20} />
            {saving ? "Saving..." : "Save Attendance"}
          </SaveButton>
        )}
      </GlassCard>

      <SectionTitle>
        <History size={20} style={{ display: "inline", marginRight: 8 }} />
        Attendance History (Last 30 Days)
      </SectionTitle>

      <GlassCard style={{ padding: 20 }}>
        {history.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            No attendance history available
          </p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Pupil</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 50).map((record) => (
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
              ))}
            </tbody>
          </Table>
        )}
      </GlassCard>
    </Container>
  );
}
