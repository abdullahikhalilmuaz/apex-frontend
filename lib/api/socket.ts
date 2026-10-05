import { io, Socket } from "socket.io-client";

export const SOCKET_URL = "https://apex-app-backend-server.onrender.com";

let socket: Socket | null = null;

export function connectSocket(): Socket | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1500,
    reconnectionAttempts: 30,
    timeout: 20000,
  });

  socket.on("connect", () => console.log("[socket] CONNECTED id=", socket?.id));
  socket.on("disconnect", (r) => console.log("[socket] DISCONNECTED", r));
  socket.on("connect_error", (e) =>
    console.log("[socket] CONNECT ERROR", e?.message),
  );

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
