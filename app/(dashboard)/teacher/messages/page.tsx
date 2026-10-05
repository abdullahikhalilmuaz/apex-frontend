"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { messagingApi } from "@/lib/api/messagingApi";
import { useAuth } from "@/hooks/useAuth";
import styled from "@emotion/styled";
import { Plus, User, Users as UsersIcon, MessageCircle, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
`;

const Avatar = styled.div<{ group?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: ${(p) => (p.group ? "#a78bfa" : "#667eea")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const NameRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  font-weight: 700;
`;

const Preview = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  margin-top: 3px;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
`;

const ModalContent = styled(GlassCard)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
`;

export default function TeacherMessages() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await messagingApi.syncMe(user?.name, user?.email).catch(() => {});
        const [c, r] = await Promise.all([
          messagingApi.getConversations(),
          messagingApi.getRecipients(),
        ]);
        setConversations(c.data || []);
        setRecipients(r.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const startDirect = async (toUserId: string) => {
    try {
      const res = await messagingApi.startDirect(toUserId);
      setShowPicker(false);
      router.push(`/teacher/messages/${res.data._id}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to start chat");
    }
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  if (loading) {
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster position="top-right" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
            💬 Messages
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Chat with headmaster & staff
          </p>
        </div>
        <button
          onClick={() => setShowPicker(true)}
          style={{
            padding: "10px 20px",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: 999,
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Plus size={18} /> New
        </button>
      </div>

      {conversations.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <MessageCircle size={32} color="rgba(255,255,255,0.4)" />
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
            No conversations yet
          </p>
        </GlassCard>
      ) : (
        conversations.map((c) => (
          <GlassCard
            key={c._id}
            style={{ padding: 0, marginBottom: 12, cursor: "pointer" }}
            onClick={() => router.push(`/teacher/messages/${c._id}`)}
          >
            <Row>
              <Avatar group={c.type === "group"}>
                {c.type === "group" ? (
                  <UsersIcon size={20} />
                ) : (
                  <User size={20} />
                )}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <NameRow>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {timeAgo(c.lastMessageAt)}
                  </span>
                </NameRow>
                <Preview>
                  {c.lastMessageSenderName
                    ? `${c.lastMessageSenderName}: `
                    : ""}
                  {c.lastMessage || "No messages yet"}
                </Preview>
              </div>
            </Row>
          </GlassCard>
        ))
      )}

      {showPicker && (
        <Modal onClick={() => setShowPicker(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2 style={{ color: "white" }}>New Message</h2>
              <button
                onClick={() => setShowPicker(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>
            {recipients.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.5)" }}>
                No recipients available
              </p>
            ) : (
              recipients.map((r) => (
                <div
                  key={r.id}
                  onClick={() => startDirect(r.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "white",
                  }}
                >
                  <Avatar>
                    {r.role === "parent" ? (
                      <UsersIcon size={18} />
                    ) : (
                      <User size={18} />
                    )}
                  </Avatar>
                  {r.label}
                </div>
              ))
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
