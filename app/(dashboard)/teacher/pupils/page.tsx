"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import styled from "@emotion/styled";

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
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export default function TeacherPupils() {
  const { user } = useAuth();
  const [pupils, setPupils] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPupils();
  }, []);

  const fetchPupils = async () => {
    try {
      // Get ALL pupils (no class filter)
      const res = await api.get("/pupils");
      setPupils(res.data);
    } catch (error) {
      console.error("Error fetching pupils:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPupils = pupils.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.admissionNumber?.includes(search),
  );

  if (loading) {
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>👨‍🎓 All Pupils</Title>
      <Subtitle>Total: {pupils.length} pupils</Subtitle>

      <GlassCard style={{ padding: 24 }}>
        <Input
          placeholder="Search by name or admission number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Admission No</Th>
              <Th>Class</Th>
              <Th>Date of Birth</Th>
            </tr>
          </thead>
          <tbody>
            {filteredPupils.length === 0 ? (
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
              filteredPupils.map((pupil) => (
                <motion.tr
                  key={pupil._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Td>{pupil.name}</Td>
                  <Td>{pupil.admissionNumber}</Td>
                  <Td>{pupil.class}</Td>
                  <Td>
                    {pupil.dateOfBirth
                      ? new Date(pupil.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </Td>
                </motion.tr>
              ))
            )}
          </tbody>
        </Table>
      </GlassCard>
    </Container>
  );
}
