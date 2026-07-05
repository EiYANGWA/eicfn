import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("chat_token");
  const user = localStorage.getItem("chat_user");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}