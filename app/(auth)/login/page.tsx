"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import styled from "@emotion/styled";
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
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.12);
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      toast.success(result?.message || "Login successful! 🎉");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please try again.";
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
        style={{ width: "100%", maxWidth: 420 }}
      >
        <GlassCard>
          <h1 style={{ color: "white", fontSize: 28, marginBottom: 8 }}>
            ApexGlobal Academy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </Container>
  );
}
