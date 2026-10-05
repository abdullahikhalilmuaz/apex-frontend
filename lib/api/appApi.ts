import axios from "axios";

export const APP_SERVER_URL =
  "https://apex-app-backend-server.onrender.com/api/app";

const appApi = axios.create({
  baseURL: APP_SERVER_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 65000,
});

appApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

appApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("App-Server network error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default appApi;
