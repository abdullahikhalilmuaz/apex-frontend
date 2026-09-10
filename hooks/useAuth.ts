import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/client";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    router.push(`/${user.role}`);
    return response.data;
  };

  const register = async (data: any, role: string) => {
    const endpoint = `/${role}/register`;
    const response = await api.post(endpoint, data);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    router.push(`/${role}`);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return { user, loading, login, register, logout };
};
