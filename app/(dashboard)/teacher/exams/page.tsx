"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import styled from "@emotion/styled";
import { Plus, FileText, Trash2, CheckCircle2, Clock } from "lucide-react";
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

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px;
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const Title = styled.h3`
  color: white;
  font-size: 16px;
  margin: 0;
`;

const Meta = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  margin: 4px 0 0 0;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  margin-top: 4px;
`;

const TrashBtn = styled.button`
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  padding: 8px;
`;

export default function TeacherExams() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await appApi.get("/exams/teacher");
      setExams(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exam? All questions will be removed.")) return;
    try {
      await appApi.delete(`/exams/${id}`);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const statusLabel = (s: string) => {
    if (s === "submitted") return "Submitted for review";
    if (s === "reviewed") return "Reviewed";
    return "Draft";
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
      <Header>
        <div>
          <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
            📝 Exam Questions
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Set exam papers per subject
          </p>
        </div>
        <AddBtn onClick={() => router.push("/teacher/exams/editor")}>
          <Plus size={18} /> New Exam
        </AddBtn>
      </Header>

      {exams.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            No exams yet. Click &quot;New Exam&quot; to create one.
          </p>
        </GlassCard>
      ) : (
        exams.map((e) => (
          <GlassCard
            key={e._id}
            style={{ marginBottom: 12, cursor: "pointer" }}
            onClick={() => router.push(`/teacher/exams/editor?id=${e._id}`)}
          >
            <Row>
              <IconWrap>
                <FileText size={20} />
              </IconWrap>
              <div style={{ flex: 1 }}>
                <Title>{e.subject}</Title>
                <Meta>
                  {e.class} • {e.term} Term • {e.session}
                </Meta>
                <StatusRow>
                  {e.status === "submitted" ? (
                    <CheckCircle2 size={14} color="#34d399" />
                  ) : (
                    <Clock size={14} color="#fbbf24" />
                  )}
                  <span>{statusLabel(e.status)}</span>
                  <span>•</span>
                  <span>
                    {e.objectives?.length || 0} obj • {e.essays?.length || 0}{" "}
                    essay • {e.fillBlanks?.length || 0} fill
                  </span>
                </StatusRow>
              </div>
              <TrashBtn
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleDelete(e._id);
                }}
              >
                <Trash2 size={18} />
              </TrashBtn>
            </Row>
          </GlassCard>
        ))
      )}
    </Container>
  );
}
