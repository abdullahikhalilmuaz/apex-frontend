"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import Link from "next/link";
import { Eye } from "lucide-react";
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

const ChildCard = styled(GlassCard)`
  padding: 24px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChildInfo = styled.div`
  flex: 1;
`;

const ChildName = styled.h3`
  color: white;
  font-size: 20px;
`;

const ChildClass = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-top: 4px;
`;

const ViewButton = styled(Link)`
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

export default function ParentChildren() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await api.get("/parent/children");
      setChildren(res.data);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const unlinkChild = async (pupilId) => {
    if (!confirm("Unlink this child?")) return;
    try {
      await api.delete(`/parent/unlink-child/${pupilId}`);
      toast.success("Child unlinked successfully");
      fetchChildren();
    } catch (error) {
      toast.error("Failed to unlink child");
      console.error("Error unlinking child:", error);
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
      <Title>👨‍👩‍👧 My Children</Title>
      <Subtitle>View all your children and their progress</Subtitle>

      {children.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            No children linked to your account
          </p>
        </GlassCard>
      ) : (
        children.map((child) => (
          <motion.div
            key={child._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ChildCard>
              <ChildInfo>
                <ChildName>{child.name}</ChildName>
                <ChildClass>
                  {child.class} • {child.admissionNumber}
                </ChildClass>
              </ChildInfo>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <ViewButton href={`/parent/children/${child._id}`}>
                  <Eye size={18} /> View
                </ViewButton>
                <button
                  onClick={() => unlinkChild(child._id)}
                  style={{
                    background: "rgba(239,68,68,0.2)",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  Unlink
                </button>
              </div>
            </ChildCard>
          </motion.div>
        ))
      )}
    </Container>
  );
}
