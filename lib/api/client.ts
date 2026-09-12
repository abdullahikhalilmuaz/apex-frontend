import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://apex-global-academy.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 65000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - backend may be down");
    }
    if (!error.response) {
      console.error("Network Error - Check if backend is running");
    }
    return Promise.reject(error);
  },
);

export default api;
