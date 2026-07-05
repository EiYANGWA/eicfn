import axios from "axios";
import type { AuthResponse } from "../types/auth";
import type { Message } from "../types/message";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("chat_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function checkBackendHealth() {
  const apiUrl = import.meta.env.VITE_API_URL as string;
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");

  const response = await axios.get<{ status: string }>(`${baseUrl}/health`, {
    timeout: 8000
  });

  return response.data;
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function getMessages() {
  const response = await api.get<{ messages: Message[] }>("/messages");
  return response.data.messages;
}