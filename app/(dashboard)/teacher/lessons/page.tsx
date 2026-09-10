"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { Plus, Edit2, Trash2, Save, X, FileText } from "lucide-react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#ffffff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  section: { marginBottom: 12 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 4,
  },
  content: { fontSize: 12, color: "#1a1a1a", marginBottom: 8 },
  divider: { borderBottom: "1px solid #e5e5e5", marginVertical: 12 },
});

// PDF Component
const LessonNotePDF = ({ note }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>{note.topic}</Text>
      <View style={pdfStyles.divider} />

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Subject:</Text>
        <Text style={pdfStyles.content}>{note.subject}</Text>
      </View>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Class:</Text>
        <Text style={pdfStyles.content}>{note.class}</Text>
      </View>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Date:</Text>
        <Text style={pdfStyles.content}>
          {new Date(note.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={pdfStyles.divider} />

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Objectives:</Text>
        {note.objectives?.map((obj, i) => (
          <Text key={i} style={pdfStyles.content}>
            • {obj}
          </Text>
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Teaching Materials:</Text>
        {note.teachingMaterials?.map((mat, i) => (
          <Text key={i} style={pdfStyles.content}>
            • {mat}
          </Text>
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Introduction:</Text>
        <Text style={pdfStyles.content}>{note.introduction}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Presentation:</Text>
        <Text style={pdfStyles.content}>{note.presentation}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Evaluation:</Text>
        <Text style={pdfStyles.content}>{note.evaluation}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Assignment:</Text>
        <Text style={pdfStyles.content}>{note.assignment}</Text>
      </View>
    </Page>
  </Document>
);

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
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NoteCard = styled(GlassCard)`
  padding: 20px;
  margin-bottom: 16px;
`;

const NoteTitle = styled.h3`
  color: white;
  font-size: 18px;
  margin-bottom: 4px;
`;

const NoteMeta = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  margin-bottom: 12px;
`;

const NoteContent = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;

  &:hover {
    color: white;
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
  max-width: 600px;
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Input = styled.input`
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  min-height: 80px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const PDFButton = styled(Button)`
  background: linear-gradient(135deg, #f59e0b, #d97706);
`;

export default function TeacherLessons() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    class: "Primary 1",
    subject: "Mathematics",
    topic: "",
    objectives: "",
    teachingMaterials: "",
    introduction: "",
    presentation: "",
    evaluation: "",
    assignment: "",
  });

  const classes = [
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
  ];
  const subjects = [
    "English",
    "Mathematics",
    "Basic Science",
    "Social Studies",
    "Civic Education",
    "Computer Studies",
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/lesson-notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        objectives: formData.objectives.split("\n").filter(Boolean),
        teachingMaterials: formData.teachingMaterials
          .split("\n")
          .filter(Boolean),
      };

      if (editing) {
        await api.put(`/lesson-notes/${editing}`, data);
      } else {
        await api.post("/lesson-notes", data);
      }
      fetchNotes();
      setShowModal(false);
      setEditing(null);
      setFormData({
        class: "Primary 1",
        subject: "Mathematics",
        topic: "",
        objectives: "",
        teachingMaterials: "",
        introduction: "",
        presentation: "",
        evaluation: "",
        assignment: "",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving lesson note");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this lesson note?")) {
      await api.delete(`/lesson-notes/${id}`);
      fetchNotes();
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
      <Header>
        <div>
          <Title>📝 Lesson Notes</Title>
          <Subtitle>Create and manage your lesson notes</Subtitle>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} /> New Note
        </Button>
      </Header>

      {notes.length === 0 ? (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>No lesson notes yet</p>
        </GlassCard>
      ) : (
        notes.map((note) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NoteCard>
              <NoteTitle>{note.topic}</NoteTitle>
              <NoteMeta>
                {note.class} • {note.subject} •{" "}
                {new Date(note.date).toLocaleDateString()}
              </NoteMeta>
              <NoteContent>
                {note.introduction?.substring(0, 100)}...
              </NoteContent>
              <ButtonGroup>
                <ActionButton
                  onClick={() => {
                    setEditing(note._id);
                    setFormData({
                      ...note,
                      objectives: note.objectives?.join("\n") || "",
                      teachingMaterials:
                        note.teachingMaterials?.join("\n") || "",
                    });
                    setShowModal(true);
                  }}
                >
                  <Edit2 size={16} />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(note._id)}>
                  <Trash2 size={16} />
                </ActionButton>
                <PDFButton as="div">
                  <PDFDownloadLink
                    document={<LessonNotePDF note={note} />}
                    fileName={`${note.topic}-${new Date().toISOString().split("T")[0]}.pdf`}
                  >
                    {({ loading }) => (
                      <>
                        <FileText size={16} />
                        {loading ? "Loading PDF..." : "PDF"}
                      </>
                    )}
                  </PDFDownloadLink>
                </PDFButton>
              </ButtonGroup>
            </NoteCard>
          </motion.div>
        ))
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "white", marginBottom: 24 }}>
              {editing ? "Edit Lesson Note" : "New Lesson Note"}
            </h2>
            <form onSubmit={handleSubmit}>
              <Select
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
              >
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <Select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Input
                placeholder="Topic"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                required
              />
              <Textarea
                placeholder="Objectives (one per line)"
                value={formData.objectives}
                onChange={(e) =>
                  setFormData({ ...formData, objectives: e.target.value })
                }
              />
              <Textarea
                placeholder="Teaching Materials (one per line)"
                value={formData.teachingMaterials}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teachingMaterials: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Introduction"
                value={formData.introduction}
                onChange={(e) =>
                  setFormData({ ...formData, introduction: e.target.value })
                }
              />
              <Textarea
                placeholder="Presentation"
                value={formData.presentation}
                onChange={(e) =>
                  setFormData({ ...formData, presentation: e.target.value })
                }
              />
              <Textarea
                placeholder="Evaluation"
                value={formData.evaluation}
                onChange={(e) =>
                  setFormData({ ...formData, evaluation: e.target.value })
                }
              />
              <Textarea
                placeholder="Assignment"
                value={formData.assignment}
                onChange={(e) =>
                  setFormData({ ...formData, assignment: e.target.value })
                }
              />
              <Button
                type="submit"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Save size={20} /> {editing ? "Update" : "Create"}
              </Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
