"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import {
  Users,
  CheckCircle,
  Clock,
  Bell,
  MessageCircle,
  Plus,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
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

const ChildCard = styled(GlassCard)`
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChildName = styled.h3`
  color: white;
  font-size: 18px;
`;

const ChildClass = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(GlassCard)`
  width: 90%;
  max-width: 400px;
  padding: 32px;
  position: relative;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 24px;
`;

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({
    announcements: 0,
    messages: 0,
    averageScore: 0,
    attendance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [childrenRes, statsRes] = await Promise.all([
        api.get("/parent/children"),
        api.get("/parent/stats"),
      ]);
      setChildren(childrenRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const linkChild = async () => {
    if (!admissionNumber.trim()) {
      toast.error("Please enter an admission number");
      return;
    }

    setLinking(true);
    try {
      await api.post("/parent/link-child", { admissionNumber });
      toast.success("Child linked successfully! 🎉");
      setShowModal(false);
      setAdmissionNumber("");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to link child");
    } finally {
      setLinking(false);
    }
  };

  const statItems = [
    { icon: Users, label: "Children", value: children.length },
    { icon: CheckCircle, label: "Avg Score", value: `${stats.averageScore}%` },
    { icon: Clock, label: "Attendance", value: `${stats.attendance}%` },
    { icon: Bell, label: "Announcements", value: stats.announcements },
    { icon: MessageCircle, label: "Messages", value: stats.messages },
  ];

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div>
            <h1 style={{ color: "white", fontSize: 32 }}>
              Welcome, {user?.name} 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              Track your children's progress
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={20} /> Link Child
          </Button>
        </div>

        <Grid>
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StatCard>
                <StatIcon>
                  <item.icon size={24} />
                </StatIcon>
                <div>
                  <StatValue>{item.value}</StatValue>
                  <StatLabel>{item.label}</StatLabel>
                </div>
              </StatCard>
            </motion.div>
          ))}
        </Grid>

        <h2 style={{ color: "white", fontSize: 20, marginBottom: 16 }}>
          My Children
        </h2>

        {children.length === 0 ? (
          <GlassCard style={{ padding: 40, textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
              No children linked to your account
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus size={20} /> Link Your Child
            </Button>
          </GlassCard>
        ) : (
          children.map((child) => (
            <motion.div
              key={child._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ChildCard>
                <div>
                  <ChildName>{child.name}</ChildName>
                  <ChildClass>
                    {child.class} • {child.admissionNumber}
                  </ChildClass>
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
                  ✅ Linked
                </span>
              </ChildCard>
            </motion.div>
          ))
        )}
      </motion.div>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowModal(false)}>✕</CloseButton>
            <ModalTitle>Link Your Child</ModalTitle>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
              Enter your child's admission number
            </p>
            <Input
              placeholder="Admission Number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              disabled={linking}
            />
            <ModalButton onClick={linkChild} disabled={linking}>
              {linking ? "Linking..." : "Link Child"}
            </ModalButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
