"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";
import { Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
  margin-bottom: 24px;
  flex-shrink: 0;
`;

const DateCard = styled(GlassCard)`
  padding: 20px 24px;
  margin-bottom: 16px;
  flex-shrink: 0;

  &:hover {
    transform: none;
  }
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
`;

const DateInput = styled.input`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

const TableCard = styled(GlassCard)`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  &:hover {
    transform: none;
  }
`;

const TableScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;
  margin: 0 -24px;
  padding: 0 24px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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

const Table = styled.table`
  width: 100%;
  color: white;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  position: sticky;
  top: 0;
  background: #5c60a5;
  z-index: 1;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  margin-top: 16px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -8px rgba(102, 126, 234, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

type Status = "present" | "absent" | "late" | "excused";
const STATUSES: Status[] = ["present", "absent", "late", "excused"];
const STATUS_COLORS: Record<Status, string> = {
  present: "#34d399",
  absent: "#f87171",
  late: "#fbbf24",
  excused: "#60a5fa",
};

export default function TeacherAttendance() {
  const { className, loading: classLoading } = useTeacherClass();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!className) return;
    (async () => {
      setLoading(true);
      try {
        const [sRes, aRes] = await Promise.all([
          appApi.get(`/students/class/${encodeURIComponent(className)}`),
          appApi.get(
            `/attendance/class/${encodeURIComponent(className)}?date=${date}`,
          ),
        ]);
        setStudents(sRes.data);
        const existing: Record<string, Status> = {};
        aRes.data.forEach((r: any) => {
          existing[r.studentId._id || r.studentId] = r.status;
        });
        setMarks(existing);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [className, date]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s._id,
        status: marks[s._id] || "present",
      }));
      await appApi.post("/attendance", { class: className, date, records });
      toast.success("Attendance saved! ✅");
    } catch (e) {
      toast.error("Failed to save");
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
      <Title>📋 Attendance</Title>
      <Subtitle>{className}</Subtitle>

      <DateCard>
        <Label>Date</Label>
        <DateInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </DateCard>

      <TableCard>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <Td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.5)",
                      padding: 40,
                    }}
                  >
                    No students in {className}
                  </Td>
                </tr>
              ) : (
                students.map((s) => {
                  const current: Status = marks[s._id] || "present";
                  return (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Td>
                        {s.firstName} {s.middleName} {s.lastName}
                      </Td>
                      <Td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {STATUSES.map((st) => (
                            <button
                              key={st}
                              onClick={() =>
                                setMarks({ ...marks, [s._id]: st })
                              }
                              style={{
                                padding: "6px 14px",
                                borderRadius: 20,
                                border: "none",
                                cursor: "pointer",
                                background:
                                  current === st
                                    ? STATUS_COLORS[st]
                                    : "rgba(255,255,255,0.08)",
                                color:
                                  current === st
                                    ? "white"
                                    : "rgba(255,255,255,0.6)",
                                fontWeight: current === st ? 600 : 400,
                                transition: "all 0.15s ease",
                              }}
                            >
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </button>
                          ))}
                        </div>
                      </Td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableScroll>

        {students.length > 0 && (
          <SaveBtn onClick={handleSave} disabled={saving}>
            <Save size={20} /> {saving ? "Saving..." : "Save Attendance"}
          </SaveBtn>
        )}
      </TableCard>
    </Container>
  );
}
