import { useEffect, useState } from "react";
import api from "@/lib/api/client";

export function useTeacherClass() {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/dashboard/teacher-stats");
        const c = res.data?.classAssigned || "";
        setClassName(c);
        if (!c) setError("No class assigned to your account");
      } catch (e: any) {
        setError(e?.message || "Failed to load class");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { className, loading, error };
}
