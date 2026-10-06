"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import appApi from "@/lib/api/appApi";
import { useTeacherClass } from "@/hooks/useTeacherClass";
import styled from "@emotion/styled";
import { Plus, Trash2, Users, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
  margin: 0;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-top: 4px;
`;

const AddBtn = styled.button`
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
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #5568c9;
    transform: scale(1.05);
  }
`;

const TableCard = styled(GlassCard)`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;

  &:hover {
    transform: none;
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
  flex-shrink: 0;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

const CountText = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  margin-bottom: 12px;
  flex-shrink: 0;
`;

const TableScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;
  margin: 0 -24px;
  padding: 0 24px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const Table = styled.table`
  width: 100%;
  color: white;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  position: sticky;
  top: 0;
  background: #5c60a5;
  z-index: 1;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalBox = styled(GlassCard)`
  width: 100%;
  max-width: 560px;
  padding: 28px;
  max-height: 90vh;
  overflow-y: auto;

  &:hover {
    transform: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.09);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;

  option {
    color: black;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #667eea;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #5568c9;
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -8px rgba(102, 126, 234, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

type Student = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  class: string;
  gender?: string;
  admissionNumber?: string;
};

export default function TeacherPupils() {
  const { className, loading: classLoading, error: classError } = useTeacherClass();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "male",
    guardianName: "",
    guardianPhone: "",
  });

  const loadStudents = async () => {
    if (!className) return;
    setLoading(true);
    try {
      const res = await appApi.get(
        `/students/class/${encodeURIComponent(className)}`
      );
      setStudents(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [className]);

  const handleAdd = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name required");
      return;
    }
    setSaving(true);
    try {
      await appApi.post("/students", { ...form, class: className });
      toast.success("Student added");
      setShowAdd(false);
      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "male",
        guardianName: "",
        guardianPhone: "",
      });
      loadStudents();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student? This will hide them from the class.")) return;
    try {
      await appApi.delete(`/students/${id}`);
      toast.success("Student removed");
      loadStudents();
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const full =
      `${s.firstName} ${s.middleName || ""} ${s.lastName}`.toLowerCase();
    return (
      full.includes(q) || (s.admissionNumber || "").toLowerCase().includes(q)
    );
  });

  if (classLoading) {
    return (
      <Container>
        <div style={{ color: "white" }}>Loading...</div>
      </Container>
    );
  }

  if (!className) {
    return (
      <Container>
        <GlassCard style={{ padding: 40 }}>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              margin: 0,
            }}
          >
            {classError || "No class assigned to your account"}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              marginTop: 8,
              fontSize: 13,
            }}
          >
            Contact the headmaster to assign you a class.
          </p>
        </GlassCard>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster position="top-right" />
      <Header>
        <div>
          <Title>👨‍🎓 My Pupils</Title>
          <Subtitle>Manage your class roster</Subtitle>
        </div>
        <AddBtn onClick={() => setShowAdd(true)} title="Add Student">
          <Plus size={22} />
        </AddBtn>
      </Header>

      <TableCard>
        <SearchInput
          placeholder="Search by name or admission no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CountText>
          {filtered.length} student{filtered.length === 1 ? "" : "s"} in {className}
        </CountText>

        <TableScroll>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Admission No</Th>
                <Th>Class</Th>
                <Th>Gender</Th>
                <Th style={{ width: 60, textAlign: "center" }}>Action</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <Td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.5)",
                      padding: 40,
                    }}
                  >
                    Loading...
                  </Td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <Td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.5)",
                      padding: 40,
                    }}
                  >
                    {search
                      ? "No matches"
                      : "No students yet. Tap + to add one."}
                  </Td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <motion.tr
                    key={s._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Td>
                      {s.firstName} {s.middleName ? s.middleName + " " : ""}
                      {s.lastName}
                    </Td>
                    <Td>{s.admissionNumber || "—"}</Td>
                    <Td>{s.class}</Td>
                    <Td style={{ textTransform: "capitalize" }}>
                      {s.gender || "—"}
                    </Td>
                    <Td style={{ textAlign: "center" }}>
                      <DeleteBtn
                        onClick={() => handleDelete(s._id)}
                        title="Delete student"
                      >
                        <Trash2 size={18} />
                      </DeleteBtn>
                    </Td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </Table>
        </TableScroll>
      </TableCard>

      {showAdd && (
        <ModalOverlay onClick={() => setShowAdd(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add Student</ModalTitle>
              <CloseBtn onClick={() => setShowAdd(false)}>
                <X size={22} />
              </CloseBtn>
            </ModalHeader>

            <Label>First name *</Label>
            <Input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="e.g. Ahmed"
            />

            <Label>Middle name (optional)</Label>
            <Input
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
              placeholder="e.g. Musa"
            />

            <Label>Last name *</Label>
            <Input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="e.g. Ibrahim"
            />

            <Label>Gender</Label>
            <Select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>

            <Label>Guardian name (optional)</Label>
            <Input
              value={form.guardianName}
              onChange={(e) =>
                setForm({ ...form, guardianName: e.target.value })
              }
            />

            <Label>Guardian phone (optional)</Label>
            <Input
              type="tel"
              value={form.guardianPhone}
              onChange={(e) =>
                setForm({ ...form, guardianPhone: e.target.value })
              }
            />

            <SaveBtn onClick={handleAdd} disabled={saving}>
              <Plus size={18} /> {saving ? "Adding..." : "Add Student"}
            </SaveBtn>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
}