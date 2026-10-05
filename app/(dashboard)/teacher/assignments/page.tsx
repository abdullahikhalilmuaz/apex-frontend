"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";
import { Plus, Trash2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const SUBJECTS = [
  "",
  "English Studies",
  "Mathematics",
  "Basic Science",
  "Basic Technology",
  "Computer Studies",
  "Physical and Health Education",
  "Social Studies",
  "Civic Education",
  "Security Education",
  "Islamic Religion Studies",
  "Christian Religion Studies",
  "Agricultural Science",
  "Home Economics",
  "Yoruba",
  "Hausa",
  "Igbo",
  "French",
  "Arabic",
  "Cultural and Creative Arts",
  "History",
];

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
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const AddBtn = styled.button`
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 999px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

const Label = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-bottom: 6px;
  margin-top: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-family: inherit;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  min-height: 80px;
`;

const Select = styled.select`
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  width: 100%;
  option {
    color: black;
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalBox = styled(GlassCard)`
  width: 100%;
  max-width: 600px;
  padding: 28px;
  max-height: 90vh;
  overflow-y: auto;
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

export default function TeacherAssignments() {
  const { className, loading: classLoading } = useTeacherClass();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    topic: "",
  });

  const load = async () => {
    if (!className) return;
    try {
      const res = await appApi.get(
        `/assignments/class/${encodeURIComponent(className)}`,
      );
      setAssignments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [className]);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      toast.error("Title required");
      return;
    }
    try {
      await appApi.post("/assignments", { ...form, class: className });
      toast.success("Assignment posted");
      setShowModal(false);
      setForm({ title: "", description: "", subject: "", topic: "" });
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      await appApi.delete(`/assignments/${id}`);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error("Failed");
    }
  };

  if (loading || classLoading) {
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
        <div>
          <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
            📚 Assignments
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Post homework for {className}
          </p>
        </div>
        <AddBtn onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Assignment
        </AddBtn>
      </Header>

      {assignments.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>No assignments yet.</p>
        </GlassCard>
      ) : (
        assignments.map((a) => (
          <GlassCard key={a._id} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "white", margin: 0, fontSize: 16 }}>
                  {a.title}
                </h3>
                <p
                  style={{
                    color: "#a78bfa",
                    fontSize: 13,
                    margin: "4px 0 0 0",
                  }}
                >
                  {a.subject ? a.subject : "All subjects"}
                  {a.topic ? ` • Topic: ${a.topic}` : ""}
                </p>
                {a.description && (
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 13,
                      marginTop: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(a._id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f87171",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </GlassCard>
        ))
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 style={{ color: "white" }}>New Assignment</h2>
              <button
                onClick={() => setShowModal(false)}
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

            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Read Chapter 3"
            />

            <Label>Subject</Label>
            <Select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              {SUBJECTS.map((s) => (
                <option key={s || "none"} value={s}>
                  {s ? s : "— All subjects —"}
                </option>
              ))}
            </Select>

            <Label>Topic (helps parent find it in the book)</Label>
            <Input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="e.g. Chapter 3, Page 42"
            />

            <Label>Description / Instructions</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What should the student do?"
            />

            <SaveBtn onClick={handleCreate}>
              <Plus size={18} /> Post Assignment
            </SaveBtn>
          </ModalBox>
        </Modal>
      )}
    </Container>
  );
}
