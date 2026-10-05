"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import styled from "@emotion/styled";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  color: white;
  font-size: 16px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  color: white;
  font-size: 16px;

  option {
    color: black;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Button = styled.button<{ loading: boolean }>`
  width: 100%;
  padding: 14px;
  background: ${(props) =>
    props.loading
      ? "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.loading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.loading ? 0.7 : 1)};
  transition: all 0.3s ease;

  &:hover {
    transform: ${(props) => (props.loading ? "none" : "scale(1.02)")};
    box-shadow: ${(props) =>
      props.loading ? "none" : "0 20px 40px -12px rgba(102, 126, 234, 0.4)"};
  }
`;

const RoleSection = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "headmaster",
    schoolName: "",
    phone: "",
    classAssigned: "",
    subjects: "",
    relationship: "",
    childrenAdmission: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const data: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      // Headmaster
      if (formData.role === "headmaster") {
        if (!formData.schoolName) {
          toast.error("School name is required for headmaster");
          setLoading(false);
          return;
        }
        data.schoolName = formData.schoolName;
      }

      // Teacher
      if (formData.role === "teacher") {
        if (!formData.classAssigned) {
          toast.error("Class assigned is required for teacher");
          setLoading(false);
          return;
        }
        if (!formData.subjects) {
          toast.error("At least one subject is required for teacher");
          setLoading(false);
          return;
        }

        data.classAssigned = formData.classAssigned;
        data.subjects = formData.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Parent
      if (formData.role === "parent") {
        if (!formData.relationship) {
          toast.error("Relationship is required for parent");
          setLoading(false);
          return;
        }

        data.relationship = formData.relationship;
        data.childrenAdmission = formData.childrenAdmission
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const result = await register(data, formData.role);
      toast.success(result?.message || "Registration successful! 🎉");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
            iconTheme: {
              primary: "#34d399",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "white",
            },
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <GlassCard>
          <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
            Create Account
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24 }}>
            Register as Headmaster, Teacher, or Parent
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                disabled={loading}
              >
                <option value="headmaster">Headmaster</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </Select>
            </div>

            {formData.role === "headmaster" && (
              <RoleSection>
                <Input
                  placeholder="School Name"
                  value={formData.schoolName}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolName: e.target.value })
                  }
                  required
                  disabled={loading}
                />
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    marginTop: 8,
                  }}
                >
                  School will be created automatically
                </p>
              </RoleSection>
            )}

            {formData.role === "teacher" && (
              <RoleSection>
                <Select
                  value={formData.classAssigned}
                  onChange={(e) =>
                    setFormData({ ...formData, classAssigned: e.target.value })
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Class</option>
                  <option value="Pre-Nursery">Pre-Nursery</option>
                  <option value="Nursery 1">Nursery 1</option>
                  <option value="Nursery 2">Nursery 2</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 3">Primary 3</option>
                  <option value="Primary 4">Primary 4</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="Primary 6">Primary 6</option>
                </Select>
                <Input
                  placeholder="Subjects (comma separated: Math, English)"
                  value={formData.subjects}
                  onChange={(e) =>
                    setFormData({ ...formData, subjects: e.target.value })
                  }
                  style={{ marginTop: 12 }}
                  disabled={loading}
                />
              </RoleSection>
            )}

            {formData.role === "parent" && (
              <RoleSection>
                <Select
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Relationship</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </Select>
                <Input
                  placeholder="Children Admission Numbers (comma separated)"
                  value={formData.childrenAdmission}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      childrenAdmission: e.target.value,
                    })
                  }
                  style={{ marginTop: 12 }}
                  disabled={loading}
                />
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    marginTop: 8,
                  }}
                >
                  Enter admission numbers to link children (optional)
                </p>
              </RoleSection>
            )}

            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>
          </form>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#a78bfa" }}>
              Login
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </Container>
  );
}
