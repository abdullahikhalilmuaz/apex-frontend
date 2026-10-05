"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";
import { Plus, Save, Send, Trash2, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const SUBJECTS = [
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
const TERMS = ["First", "Second", "Third"];
const SESSIONS = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"];

const Container = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
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

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
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
  resize: vertical;
  min-height: 60px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
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

const SectionHeader = styled.div<{ open: boolean }>`
  background: ${(p) => (p.open ? "#667eea" : "rgba(20, 20, 60, 0.6)")};
  padding: 12px 16px;
  border-radius: 10px;
  margin: 20px 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: white;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const QCard = styled(GlassCard)`
  margin-bottom: 12px;
  padding: 16px;
`;

const QHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const QNum = styled.span`
  color: #667eea;
  font-weight: 700;
  font-size: 14px;
`;

const Trash = styled.button`
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  padding: 4px;
`;

const OptionRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

const OptionLabel = styled.span`
  color: white;
  font-weight: 700;
  width: 20px;
  font-size: 13px;
`;

const CorrectBtn = styled.button<{ active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.active ? "#34d399" : "rgba(255,255,255,0.15)")};
  background: ${(p) => (p.active ? "#34d399" : "transparent")};
  color: ${(p) => (p.active ? "white" : "rgba(255,255,255,0.4)")};
  cursor: pointer;
  font-weight: 700;
`;

const AddRow = styled.button`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

const ActionBtn = styled.button<{ variant?: "primary" }>`
  flex: 1;
  padding: 14px;
  background: ${(p) =>
    p.variant === "primary"
      ? "linear-gradient(135deg, #667eea, #764ba2)"
      : "rgba(255,255,255,0.1)"};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TopBar = styled.div`
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

function ExamEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { className, loading: classLoading } = useTeacherClass();

  const [data, setData] = useState<any>({
    title: "",
    class: "",
    subject: "Mathematics",
    term: "First",
    session: "2026/2027",
    duration: "2 hours",
    totalMarks: 100,
    instructions: "",
    objectives: [],
    essays: [],
    fillBlanks: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [openSection, setOpenSection] = useState<
    "objectives" | "essays" | "fillBlanks"
  >("objectives");

  useEffect(() => {
    if (className && !id) {
      setData((prev: any) => ({ ...prev, class: className }));
    }
  }, [className, id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await appApi.get(`/exams/${id}`);
        setData(res.data);
        setIsExisting(true);
      } catch (e) {
        toast.error("Failed to load exam");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const update = (patch: any) => setData({ ...data, ...patch });

  // Objectives
  const addObjective = () =>
    update({
      objectives: [
        ...data.objectives,
        {
          number: data.objectives.length + 1,
          text: "",
          options: ["", "", "", ""],
          correct: "",
        },
      ],
    });
  const updateObjective = (i: number, patch: any) => {
    const arr = [...data.objectives];
    arr[i] = { ...arr[i], ...patch };
    update({ objectives: arr });
  };
  const removeObjective = (i: number) => {
    const arr = data.objectives.filter((_: any, idx: number) => idx !== i);
    arr.forEach((o: any, idx: number) => (o.number = idx + 1));
    update({ objectives: arr });
  };
  const updateOption = (i: number, oi: number, val: string) => {
    const arr = [...data.objectives];
    const opts = [...(arr[i].options || ["", "", "", ""])];
    opts[oi] = val;
    arr[i] = { ...arr[i], options: opts };
    update({ objectives: arr });
  };

  // Essays
  const addEssay = () =>
    update({
      essays: [
        ...data.essays,
        { number: data.essays.length + 1, text: "", marks: 5 },
      ],
    });
  const updateEssay = (i: number, patch: any) => {
    const arr = [...data.essays];
    arr[i] = { ...arr[i], ...patch };
    update({ essays: arr });
  };
  const removeEssay = (i: number) => {
    const arr = data.essays.filter((_: any, idx: number) => idx !== i);
    arr.forEach((o: any, idx: number) => (o.number = idx + 1));
    update({ essays: arr });
  };

  // Fill blanks
  const addBlank = () =>
    update({
      fillBlanks: [
        ...data.fillBlanks,
        { number: data.fillBlanks.length + 1, text: "", answer: "" },
      ],
    });
  const updateBlank = (i: number, patch: any) => {
    const arr = [...data.fillBlanks];
    arr[i] = { ...arr[i], ...patch };
    update({ fillBlanks: arr });
  };
  const removeBlank = (i: number) => {
    const arr = data.fillBlanks.filter((_: any, idx: number) => idx !== i);
    arr.forEach((o: any, idx: number) => (o.number = idx + 1));
    update({ fillBlanks: arr });
  };

  const handleSave = async (submit: boolean) => {
    setSaving(true);
    try {
      await appApi.post("/exams", { ...data, submit });
      toast.success(submit ? "Submitted for review" : "Saved");
      if (submit) router.push("/teacher/exams");
      else setIsExisting(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete exam?")) return;
    try {
      await appApi.delete(`/exams/${id}`);
      toast.success("Deleted");
      router.push("/teacher/exams");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  if (loading || classLoading) {
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );
  }

  const sectionHeader = (
    key: "objectives" | "essays" | "fillBlanks",
    label: string,
    count: number
  ) => (
    <SectionHeader
      open={openSection === key}
      onClick={() => setOpenSection(openSection === key ? "objectives" : key)}
    >
      <span>
        {label} ({count})
      </span>
      <span>{openSection === key ? "−" : "+"}</span>
    </SectionHeader>
  );

  return (
    <Container>
      <Toaster position="top-right" />
      <TopBar>
        <BackBtn onClick={() => router.push("/teacher/exams")}>
          <ArrowLeft size={18} />
        </BackBtn>
        <h2 style={{ color: "white" }}>
          {isExisting ? "Edit Exam" : "New Exam"}
        </h2>
        {isExisting && (
          <button
            onClick={handleDelete}
            style={{
              marginLeft: "auto",
              background: "rgba(239,68,68,0.2)",
              border: "none",
              color: "#f87171",
              padding: "8px 14px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </TopBar>

      <GlassCard style={{ padding: 24 }}>
        <Label>Class (locked)</Label>
        <Input value={data.class} disabled />

        <Label>Subject</Label>
        <Select
          value={data.subject}
          onChange={(e) => update({ subject: e.target.value })}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 4,
          }}
        >
          <div>
            <Label>Term</Label>
            <Select
              value={data.term}
              onChange={(e) => update({ term: e.target.value })}
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Session</Label>
            <Select
              value={data.session}
              onChange={(e) => update({ session: e.target.value })}
            >
              {SESSIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 4,
          }}
        >
          <div>
            <Label>Duration</Label>
            <Input
              value={data.duration}
              onChange={(e) => update({ duration: e.target.value })}
              placeholder="2 hours"
            />
          </div>
          <div>
            <Label>Total Marks</Label>
            <Input
              type="number"
              value={data.totalMarks}
              onChange={(e) =>
                update({ totalMarks: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <Label>Instructions (optional)</Label>
        <Textarea
          value={data.instructions}
          onChange={(e) => update({ instructions: e.target.value })}
          placeholder="e.g. Answer all questions in Section A"
        />
      </GlassCard>

      {/* OBJECTIVES */}
      {sectionHeader("objectives", "SECTION A · OBJECTIVE", data.objectives.length)}
      {openSection === "objectives" && (
        <>
          {data.objectives.map((o: any, i: number) => (
            <QCard key={i}>
              <QHeader>
                <QNum>Q{i + 1}</QNum>
                <Trash onClick={() => removeObjective(i)}>
                  <Trash2 size={16} />
                </Trash>
              </QHeader>
              <Textarea
                value={o.text}
                onChange={(e) => updateObjective(i, { text: e.target.value })}
                placeholder="Question text"
              />
              {["A", "B", "C", "D"].map((letter, oi) => (
                <OptionRow key={letter}>
                  <OptionLabel>{letter}.</OptionLabel>
                  <Input
                    style={{ flex: 1 }}
                    value={o.options?.[oi] || ""}
                    onChange={(e) => updateOption(i, oi, e.target.value)}
                    placeholder={`Option ${letter}`}
                  />
                  <CorrectBtn
                    active={o.correct === letter}
                    onClick={() => updateObjective(i, { correct: letter })}
                  >
                    ✓
                  </CorrectBtn>
                </OptionRow>
              ))}
            </QCard>
          ))}
          <AddRow onClick={addObjective}>
            <Plus size={16} /> Add Objective Question
          </AddRow>
        </>
      )}

      {/* ESSAYS */}
      {sectionHeader("essays", "SECTION B · ESSAY", data.essays.length)}
      {openSection === "essays" && (
        <>
          {data.essays.map((ess: any, i: number) => (
            <QCard key={i}>
              <QHeader>
                <QNum>Q{i + 1}</QNum>
                <Trash onClick={() => removeEssay(i)}>
                  <Trash2 size={16} />
                </Trash>
              </QHeader>
              <Textarea
                value={ess.text}
                onChange={(e) => updateEssay(i, { text: e.target.value })}
                placeholder="Essay question"
              />
              <Label>Marks</Label>
              <Input
                type="number"
                value={ess.marks}
                onChange={(e) =>
                  updateEssay(i, { marks: parseInt(e.target.value) || 0 })
                }
              />
            </QCard>
          ))}
          <AddRow onClick={addEssay}>
            <Plus size={16} /> Add Essay Question
          </AddRow>
        </>
      )}

      {/* FILL BLANKS */}
      {sectionHeader("fillBlanks", "SECTION C · FILL IN THE BLANK", data.fillBlanks.length)}
      {openSection === "fillBlanks" && (
        <>
          {data.fillBlanks.map((fb: any, i: number) => (
            <QCard key={i}>
              <QHeader>
                <QNum>Q{i + 1}</QNum>
                <Trash onClick={() => removeBlank(i)}>
                  <Trash2 size={16} />
                </Trash>
              </QHeader>
              <Textarea
                value={fb.text}
                onChange={(e) => updateBlank(i, { text: e.target.value })}
                placeholder="The capital of Nigeria is ___"
              />
              <Label>Answer</Label>
              <Input
                value={fb.answer}
                onChange={(e) => updateBlank(i, { answer: e.target.value })}
                placeholder="Abuja"
              />
            </QCard>
          ))}
          <AddRow onClick={addBlank}>
            <Plus size={16} /> Add Fill-in-the-Blank
          </AddRow>
        </>
      )}

      <ActionsRow>
        <ActionBtn onClick={() => handleSave(false)} disabled={saving}>
          <Save size={18} /> Save Draft
        </ActionBtn>
        <ActionBtn
          variant="primary"
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          <Send size={18} /> {saving ? "Submitting..." : "Submit for Review"}
        </ActionBtn>
      </ActionsRow>
    </Container>
  );
}

export default function ExamEditor() {
  return (
    <Suspense
      fallback={
        <Container>
          <div style={{ color: "white" }}>Loading...</div>
        </Container>
      }
    >
      <ExamEditorInner />
    </Suspense>
  );
}