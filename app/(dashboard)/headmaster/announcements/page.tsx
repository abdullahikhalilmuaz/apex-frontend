"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { Bell, Plus, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 40px -12px rgba(102, 126, 234, 0.4);
  }
`;

const AnnouncementCard = styled(GlassCard)`
  margin-bottom: 16px;
  padding: 20px;
  transition: all 0.3s ease;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #f87171;
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
  max-width: 500px;
  padding: 32px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  margin-bottom: 12px;

  option {
    color: black;
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

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "all",
    eventDate: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await api.post("/announcements", formData);
      toast.success("Announcement posted! 📢");
      setShowModal(false);
      setFormData({ title: "", content: "", audience: "all", eventDate: "" });
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error(
        error?.response?.data?.error || "Failed to create announcement",
      );
    } finally {
      setSubmitting(false);
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
      <Header>
        <Title>Announcements</Title>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} /> New Announcement
        </Button>
      </Header>

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
                <span>
                  To: {item.audience} •{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                  {item.eventDate && (
                    <>
                      {" "}
                      • Event: {new Date(item.eventDate).toLocaleDateString()}
                    </>
                  )}
                </span>
              </AnnouncementMeta>
            </AnnouncementCard>
          </motion.div>
        ))
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "white", marginBottom: 24 }}>
              New Announcement
            </h2>
            <form onSubmit={handleSubmit}>
              <FormInput
                placeholder="Title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={submitting}
              />
              <FormTextarea
                placeholder="Content"
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                disabled={submitting}
              />
              <Select
                value={formData.audience}
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
                disabled={submitting}
              >
                <option value="all">Everyone</option>
                <option value="teachers">Teachers Only</option>
                <option value="parents">Parents Only</option>
              </Select>
              <FormInput
                type="date"
                placeholder="Event Date (optional)"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                disabled={submitting}
              />
              <ModalButton type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post Announcement"}
              </ModalButton>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
