"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { messagingApi } from "@/lib/api/messagingApi";
import { connectSocket } from "@/lib/api/socket";
import { useAuth } from "@/hooks/useAuth";
import styled from "@emotion/styled";
import { ArrowLeft, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const BackBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 999px;
  padding: 8px;
  color: white;
  cursor: pointer;
  display: flex;
`;

const ChatArea = styled(GlassCard)`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 400px;
  max-height: 60vh;
  margin-bottom: 12px;
`;

const BubbleRow = styled.div<{ mine: boolean }>`
  display: flex;
  margin-bottom: 12px;
  justify-content: ${(p) => (p.mine ? "flex-end" : "flex-start")};
`;

const Bubble = styled.div<{ mine: boolean }>`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  background: ${(p) => (p.mine ? "#667eea" : "rgba(255,255,255,0.12)")};
  color: white;
  border-top-${(p) => (p.mine ? "right" : "left")}-radius: 4px;
`;

const SenderName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3px;
  margin-left: 4px;
`;

const Time = styled.div<{ mine: boolean }>`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
  text-align: ${(p) => (p.mine ? "right" : "left")};
  margin-right: ${(p) => (p.mine ? "4px" : "0")};
  margin-left: ${(p) => (p.mine ? "0" : "4px")};
`;

const InputBar = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  color: white;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  font-family: inherit;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SendBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #667eea;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function TeacherChat() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const conversationId = params.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await messagingApi.getMessages(conversationId);
        setMessages(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    const socket = connectSocket();
    if (!socket) return;

    const onNew = (msg: any) => {
      if (String(msg.conversationId) !== String(conversationId)) return;
      setMessages((prev) => {
        const withoutTemp = prev.filter(
          (m) =>
            !(
              m._id.startsWith?.("temp-") &&
              m.content === msg.content &&
              String(m.senderId) === String(msg.senderId)
            ),
        );
        if (withoutTemp.some((m) => m._id === msg._id)) return withoutTemp;
        return [...withoutTemp, msg];
      });
    };

    socket.on("new-message", onNew);
    socket.emit("join-conversation", conversationId);

    return () => {
      socket.off("new-message", onNew);
      socket.emit("leave-conversation", conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        senderId: user?.id,
        senderName: user?.name,
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");

    try {
      const res = await messagingApi.send(conversationId, content);
      setMessages((prev) => prev.map((m) => (m._id === tempId ? res.data : m)));
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
      <Header>
        <BackBtn onClick={() => router.push("/teacher/messages")}>
          <ArrowLeft size={18} />
        </BackBtn>
        <h2 style={{ color: "white" }}>Chat</h2>
      </Header>

      <ChatArea ref={scrollRef as any}>
        {messages.length === 0 ? (
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No messages yet — say hello 👋
          </p>
        ) : (
          messages.map((m) => {
            const mine = String(m.senderId) === String(user?.id);
            return (
              <BubbleRow key={m._id} mine={mine}>
                <div style={{ maxWidth: "75%" }}>
                  {!mine && m.senderName && (
                    <SenderName>{m.senderName}</SenderName>
                  )}
                  <Bubble mine={mine}>{m.content}</Bubble>
                  <Time mine={mine}>{fmt(m.createdAt)}</Time>
                </div>
              </BubbleRow>
            );
          })
        )}
      </ChatArea>

      <InputBar>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
        />
        <SendBtn onClick={handleSend} disabled={sending || !text.trim()}>
          <Send size={18} />
        </SendBtn>
      </InputBar>
    </Container>
  );
}
