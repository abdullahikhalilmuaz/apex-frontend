"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";

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

const Input = styled.input`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
  flex-shrink: 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
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
      <Title>👨‍🎓 My Pupils</Title>
      <Subtitle>
        {className} • {students.length} pupils
      </Subtitle>

      <TableCard>
        <Input
          placeholder="Search by name or admission no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TableScroll>
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
                      padding: 40,
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
        </TableScroll>
      </TableCard>
    </Container>
  );
}
