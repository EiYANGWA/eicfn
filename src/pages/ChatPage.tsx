import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatLayout from "../components/ChatLayout";
import { getMessages } from "../services/api";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import type { AuthUser } from "../types/auth";
import type { Message } from "../types/message";
import type { OnlineUser } from "../types/online";

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [input, setInput] = useState("");
  const [onlineNotice, setOnlineNotice] = useState("");

  const user = useMemo<AuthUser | null>(() => {
  const raw = localStorage.getItem("chat_user");

  // 1. เช็คว่ามีค่าไหม? และต้องไม่ใช่คำว่า "undefined"
  if (!raw || raw === "undefined") {
    return null;
  }

  // 2. ใช้ try-catch ครอบ JSON.parse เผื่อข้อมูลใน localStorage พัง
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse chat_user from localStorage:", error);
    return null; // ถ้า parse ไม่ได้ ก็ให้เป็น null ไปเลย
  }
}, []);

  useEffect(() => {
    const token = localStorage.getItem("chat_token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    getMessages().then(setMessages);

    const socket = connectSocket(token);

    socket.on("message:new", (message: Message) => {
      setMessages((current) => [...current, message]);
    });

    socket.on("online:users", (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socket.on("user:joined", (payload: { username: string }) => {
      setOnlineNotice(`${payload.username} joined`);
      setTimeout(() => setOnlineNotice(""), 2500);
    });

    socket.on("user:left", (payload: { username: string }) => {
      setOnlineNotice(`${payload.username} left`);
      setTimeout(() => setOnlineNotice(""), 2500);
    });

    socket.on("connect_error", () => {
      localStorage.removeItem("chat_token");
      localStorage.removeItem("chat_user");
      navigate("/login");
    });

    return () => {
      socket.off("message:new");
      socket.off("online:users");
      socket.off("user:joined");
      socket.off("user:left");
      socket.off("connect_error");
      disconnectSocket();
    };
  }, [navigate, user]);

  function handleSend() {
    const text = input.trim();

    if (!text) {
      return;
    }

    const socket = getSocket();
    socket?.emit("message:send", { text });
    setInput("");
  }

  function handleLogout() {
    disconnectSocket();
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");
    navigate("/login");
  }

  return (
    <ChatLayout
      username={user?.username || "User"}
      messages={messages}
      onlineUsers={onlineUsers}
      input={input}
      onlineNotice={onlineNotice}
      onInputChange={setInput}
      onSend={handleSend}
      onLogout={handleLogout}
    />
  );
}