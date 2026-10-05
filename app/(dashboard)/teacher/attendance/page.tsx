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
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
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
      <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
        📋 Attendance
      </h1>
      <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
        {className}
      </p>

      <GlassCard style={{ padding: 24, marginBottom: 16 }}>
        <label
          style={{
            color: "rgba(255,255,255,0.7)",
            display: "block",
            marginBottom: 8,
          }}
        >
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "10px 16px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            color: "white",
          }}
        />
      </GlassCard>

      <GlassCard style={{ padding: 24 }}>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
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
                          onClick={() => setMarks({ ...marks, [s._id]: st })}
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
                          }}
                        >
                          {st.charAt(0).toUpperCase() + st.slice(1)}
                        </button>
                      ))}
                    </div>
                  </Td>
                </motion.tr>
              );
            })}
          </tbody>
        </Table>

        {students.length > 0 && (
          <SaveBtn onClick={handleSave} disabled={saving}>
            <Save size={20} /> {saving ? "Saving..." : "Save Attendance"}
          </SaveBtn>
        )}
      </GlassCard>
    </Container>
  );
}
