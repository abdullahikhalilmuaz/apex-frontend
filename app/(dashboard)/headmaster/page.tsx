"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  Bell,
  BookOpen,
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

const StatContent = styled.div`
  flex: 1;
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

const SectionTitle = styled.h2`
  color: white;
  font-size: 20px;
  margin-bottom: 16px;
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

const StatusBadge = styled.span<{ status: boolean }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  background: ${(props) =>
    props.status ? "rgba(52, 211, 153, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => (props.status ? "#34d399" : "#f87171")};
`;

export default function HeadmasterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPupils: 0,
    presentToday: 0,
    absentToday: 0,
    totalTeachers: 0,
    classesCompleted: 0,
    announcements: 0,
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, teachersRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/teachers"),
      ]);
      setStats(statsRes.data);
      setTeachers(teachersRes.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { icon: Users, label: "Total Pupils", value: stats.totalPupils },
    { icon: UserCheck, label: "Present Today", value: stats.presentToday },
    { icon: UserX, label: "Absent Today", value: stats.absentToday },
    { icon: BookOpen, label: "Total Teachers", value: stats.totalTeachers },
    {
      icon: Calendar,
      label: "Classes Completed",
      value: stats.classesCompleted,
    },
    { icon: Bell, label: "Announcements", value: stats.announcements },
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ color: "white", fontSize: 32, marginBottom: 8 }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
          Here's your daily overview
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
                <StatContent>
                  <StatValue>{item.value}</StatValue>
                  <StatLabel>{item.label}</StatLabel>
                </StatContent>
              </StatCard>
            </motion.div>
          ))}
        </Grid>

        <SectionTitle>Teacher Monitoring</SectionTitle>
        <GlassCard style={{ padding: 20, overflow: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Teacher</Th>
                <Th>Class</Th>
                <Th>Attendance Submitted</Th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <Td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    No teachers found
                  </Td>
                </tr>
              ) : (
                teachers.map((teacher: any, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Td>{teacher.name}</Td>
                    <Td>{teacher.class}</Td>
                    <Td>
                      <StatusBadge status={teacher.attendanceSubmitted}>
                        {teacher.attendanceSubmitted ? "✅" : "❌"}
                      </StatusBadge>
                    </Td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </Table>
        </GlassCard>
      </motion.div>
    </Container>
  );
}
