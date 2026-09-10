"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api/client";
import styled from "@emotion/styled";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
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

const Input = styled.input`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  width: 250px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
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
  max-width: 500px;
  padding: 32px;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;

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
  font-size: 14px;

  option {
    color: black;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
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
  margin-top: 8px;

  &:hover {
    transform: scale(1.02);
  }
`;

export default function PupilsPage() {
  const [pupils, setPupils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    admissionNumber: "",
    class: "",
    dateOfBirth: "",
  });

  const fetchPupils = async () => {
    try {
      const res = await api.get("/pupils");
      setPupils(res.data);
    } catch (error) {
      console.error("Error fetching pupils:", error);
      toast.error("Failed to load pupils");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPupils();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/pupils/${editing}`, formData);
        toast.success("Pupil updated successfully! 🎉");
      } else {
        await api.post("/pupils", formData);
        toast.success("Pupil added successfully! 🎉");
      }
      fetchPupils();
      setShowModal(false);
      setEditing(null);
      setFormData({
        name: "",
        admissionNumber: "",
        class: "",
        dateOfBirth: "",
      });
    } catch (error) {
      console.error("Error saving pupil:", error);
      toast.error(error?.response?.data?.error || "Failed to save pupil");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this pupil?")) return;

    try {
      await api.delete(`/pupils/${id}`);
      toast.success("Pupil deleted successfully! 🗑️");
      fetchPupils();
    } catch (error) {
      console.error("Error deleting pupil:", error);
      toast.error("Failed to delete pupil");
    }
  };

  const filteredPupils = pupils.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.admissionNumber.includes(search),
  );

  if (loading)
    return (
      <Container>
        <div style={{ color: "white", textAlign: "center", paddingTop: 100 }}>
          Loading...
        </div>
      </Container>
    );

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
          success: {
            iconTheme: { primary: "#34d399", secondary: "white" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "white" },
          },
        }}
      />
      <Header>
        <Title>Pupils</Title>
        <Button
          onClick={() => {
            setEditing(null);
            setFormData({
              name: "",
              admissionNumber: "",
              class: "",
              dateOfBirth: "",
            });
            setShowModal(true);
          }}
        >
          <Plus size={20} /> Add Pupil
        </Button>
      </Header>

      <GlassCard style={{ padding: 20 }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
          <Input
            placeholder="Search by name or admission number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Admission No</Th>
              <Th>Class</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredPupils.length === 0 ? (
              <tr>
                <Td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  No pupils found
                </Td>
              </tr>
            ) : (
              filteredPupils.map((pupil) => (
                <motion.tr
                  key={pupil._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Td>{pupil.name}</Td>
                  <Td>{pupil.admissionNumber}</Td>
                  <Td>{pupil.class}</Td>
                  <Td>
                    <ActionButton
                      onClick={() => {
                        setEditing(pupil._id);
                        setFormData({
                          name: pupil.name,
                          admissionNumber: pupil.admissionNumber,
                          class: pupil.class,
                          dateOfBirth: pupil.dateOfBirth || "",
                        });
                        setShowModal(true);
                      }}
                    >
                      <Edit2 size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(pupil._id)}>
                      <Trash2 size={16} />
                    </ActionButton>
                  </Td>
                </motion.tr>
              ))
            )}
          </tbody>
        </Table>
      </GlassCard>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editing ? "Edit Pupil" : "Add Pupil"}</ModalTitle>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name</Label>
                <FormInput
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={submitting}
                />
              </FormGroup>
              <FormGroup>
                <Label>Admission Number</Label>
                <FormInput
                  required
                  value={formData.admissionNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      admissionNumber: e.target.value,
                    })
                  }
                  disabled={submitting}
                />
              </FormGroup>
              <FormGroup>
                <Label>Class</Label>
                <Select
                  required
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                  disabled={submitting}
                >
                  <option value="">Select Class</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 3">Primary 3</option>
                  <option value="Primary 4">Primary 4</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="Primary 6">Primary 6</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Date of Birth</Label>
                <FormInput
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  disabled={submitting}
                />
              </FormGroup>
              <ModalButton type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editing ? "Update" : "Create"}
              </ModalButton>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
