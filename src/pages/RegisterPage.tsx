import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { registerUser } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const data = await registerUser({ username, email, password });
      localStorage.setItem("chat_token", data.token);
      localStorage.setItem("chat_user", JSON.stringify(data.user));
      navigate("/");
    } catch {
      setError("Register failed. Username or email may already exist.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[#18191a] px-4 py-8 text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8_0,transparent_32%),radial-gradient(circle_at_bottom_left,#7c3aed_0,transparent_26%)] opacity-30" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#242526]/95 p-7 shadow-2xl backdrop-blur sm:p-8"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-13 w-13 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <MessageCircle size={27} />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Join the realtime workspace
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 ring-1 ring-red-500/20">
            {error}
          </div>
        )}

        <label className="mb-2 block text-sm font-semibold text-zinc-300">
          Username
        </label>
        <input
          className="mb-4 w-full rounded-2xl border border-white/10 bg-[#3a3b3c] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Your display name"
          required
        />

        <label className="mb-2 block text-sm font-semibold text-zinc-300">
          Email
        </label>
        <input
          className="mb-4 w-full rounded-2xl border border-white/10 bg-[#3a3b3c] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="you@example.com"
          required
        />

        <label className="mb-2 block text-sm font-semibold text-zinc-300">
          Password
        </label>
        <input
          className="mb-6 w-full rounded-2xl border border-white/10 bg-[#3a3b3c] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="At least 6 characters"
          minLength={6}
          required
        />

        <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-500 active:scale-[0.99]">
          Register
        </button>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}