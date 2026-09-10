"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { Bell } from "lucide-react";

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

const AnnouncementCard = styled(GlassCard)`
  padding: 20px;
  margin-bottom: 16px;
`;

const AnnouncementTitle = styled.h3`
  color: white;
  font-size: 18px;
  margin-bottom: 8px;
`;

const AnnouncementContent = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`;

const AnnouncementMeta = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
`;

export default function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements/feed");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
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
      <Title>📢 Announcements</Title>
      <Subtitle>School announcements and updates</Subtitle>

      {announcements.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <Bell
            size={48}
            style={{ color: "rgba(255,255,255,0.3)", marginBottom: 16 }}
          />
          <p style={{ color: "rgba(255,255,255,0.5)" }}>No announcements yet</p>
        </GlassCard>
      ) : (
        announcements.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnnouncementCard>
              <AnnouncementTitle>{item.title}</AnnouncementTitle>
              <AnnouncementContent>{item.content}</AnnouncementContent>
              <AnnouncementMeta>
                {new Date(item.createdAt).toLocaleDateString()} • To:{" "}
                {item.audience}
                {item.createdBy?.name && ` • By: ${item.createdBy.name}`}
              </AnnouncementMeta>
            </AnnouncementCard>
          </motion.div>
        ))
      )}
    </Container>
  );
}
