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
  BookOpen,
  Calendar,
  MessageCircle,
} from "lucide-react";

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

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pupils: 0,
    present: 0,
    absent: 0,
    lessons: 0,
    schemes: 0,
    messages: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/teacher-stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statItems = [
    { icon: Users, label: "My Pupils", value: stats.pupils },
    { icon: CheckCircle, label: "Present Today", value: stats.present },
    { icon: Clock, label: "Absent Today", value: stats.absent },
    { icon: BookOpen, label: "Lesson Notes", value: stats.lessons },
    { icon: Calendar, label: "Scheme Progress", value: stats.schemes },
    { icon: MessageCircle, label: "Messages", value: stats.messages },
  ];

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ color: "white", fontSize: 32, marginBottom: 8 }}>
          Welcome, {user?.name} 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
          Your teaching dashboard
        </p>

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

        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <h3 style={{ color: "white", marginBottom: 8 }}>Quick Actions</h3>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            Mark attendance • Enter results • Create lesson notes • View scheme
          </p>
        </GlassCard>
      </motion.div>
    </Container>
  );
}
