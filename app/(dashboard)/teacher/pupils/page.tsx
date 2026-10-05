"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";

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

const Input = styled.input`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
`;

export default function TeacherPupils() {
  const { className, loading: classLoading } = useTeacherClass();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!className) return;
    (async () => {
      try {
        const res = await appApi.get(
          `/students/class/${encodeURIComponent(className)}`,
        );
        setStudents(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [className]);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const full =
      `${s.firstName} ${s.middleName || ""} ${s.lastName}`.toLowerCase();
    return (
      full.includes(q) || (s.admissionNumber || "").toLowerCase().includes(q)
    );
  });

  if (loading || classLoading) {
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
        👨‍🎓 My Pupils
      </h1>
      <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
        {className} • {students.length} pupils
      </p>

      <GlassCard style={{ padding: 24 }}>
        <Input
          placeholder="Search by name or admission no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Admission No</Th>
              <Th>Class</Th>
              <Th>Gender</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <Td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  No pupils found
                </Td>
              </tr>
            ) : (
              filtered.map((s) => (
                <motion.tr
                  key={s._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Td>
                    {s.firstName} {s.middleName} {s.lastName}
                  </Td>
                  <Td>{s.admissionNumber || "—"}</Td>
                  <Td>{s.class}</Td>
                  <Td>{s.gender || "—"}</Td>
                </motion.tr>
              ))
            )}
          </tbody>
        </Table>
      </GlassCard>
    </Container>
  );
}
