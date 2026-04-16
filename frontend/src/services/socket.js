import { io } from "socket.io-client";

export const socket = io("https://reunio.onrender.com", {
  transports: ["websocket"],

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,

  timeout: 20000,

  withCredentials: true,
});

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`🔄 Reconnect attempt: ${attempt}`);
});

socket.on("reconnect", () => {
  console.log("🟢 Reconnected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket disconnected:", reason);

  if (reason === "io server disconnect") {
    socket.connect();
  }
});

socket.on("connect_error", (err) => {
  console.error("⚠️ Socket connection error:", err.message);
});