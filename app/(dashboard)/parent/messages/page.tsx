"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { Send } from "lucide-react";
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

const MessageItem = styled(GlassCard)`
  padding: 16px 20px;
  margin-bottom: 12px;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const Sender = styled.span`
  color: white;
  font-weight: 500;
`;

const Time = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
`;

const MessageContent = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  flex: 1;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function ParentMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/parent/messages");
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await api.post("/parent/messages", {
        content: newMessage,
      });
      toast.success("Message sent to Headmaster! 📨");
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
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
      <Title>💬 Messages</Title>
      <Subtitle>Communicate with the headmaster</Subtitle>

      <GlassCard style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Input
            placeholder="Type a message to the headmaster..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={sending}
          />
          <SendButton onClick={handleSend} disabled={sending}>
            <Send size={20} /> {sending ? "Sending..." : "Send"}
          </SendButton>
        </div>
      </GlassCard>

      {messages.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>No messages yet</p>
        </GlassCard>
      ) : (
        messages.map((msg) => (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MessageItem>
              <MessageHeader>
                <Sender>
                  {msg.senderName || msg.senderId?.name || "Unknown"}
                  {msg.senderModel && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.4)",
                        marginLeft: 8,
                        textTransform: "capitalize",
                      }}
                    >
                      ({msg.senderModel})
                    </span>
                  )}
                </Sender>
                <Time>{new Date(msg.createdAt).toLocaleString()}</Time>
              </MessageHeader>
              <MessageContent>{msg.content}</MessageContent>
            </MessageItem>
          </motion.div>
        ))
      )}
    </Container>
  );
}
