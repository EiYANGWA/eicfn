import { useEffect, useState } from "react";
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
  
  // 1. ใช้ State แทน useMemo เพื่อให้ React สั่ง Re-render ได้ทันทีถ้าค่าเปลี่ยน
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล User ตั้งแต่ Component เริ่ม Load
  useEffect(() => {
    const raw = localStorage.getItem("chat_user");
    const token = localStorage.getItem("chat_token");

    if (!raw || !token || raw === "undefined") {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(raw));
      setLoading(false);
    } catch (e) {
      console.error("Auth parsing error:", e);
      navigate("/login");
    }
  }, [navigate]);

  // 2. จัดการ Socket และการดึงข้อความ (แยก Effect ออกมาเพื่อความสะอาด)
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("chat_token") || "";

    // ดึงข้อความ
    getMessages()
      .then(setMessages)
      .catch((err) => console.error("Failed to fetch messages:", err));

    // เชื่อมต่อ Socket
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
      console.error("Socket connection error");
      navigate("/login");
    });

    return () => {
      disconnectSocket();
    };
  }, [user, navigate]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

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

  // แสดงผล Loading ระหว่างรอเช็ค Auth
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
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