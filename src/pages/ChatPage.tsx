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

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem("chat_user");
      localStorage.removeItem("chat_token");
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("chat_token");

    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    getMessages()
      .then(setMessages)
      .catch(() => {
        localStorage.removeItem("chat_token");
        localStorage.removeItem("chat_user");
        navigate("/login", { replace: true });
      });

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
      navigate("/login", { replace: true });
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

    if (!socket?.connected) {
      setOnlineNotice("Connection lost. Please refresh.");
      return;
    }

    socket.emit("message:send", { text });
    setInput("");
  }

  function handleLogout() {
    disconnectSocket();
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");
    navigate("/login", { replace: true });
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