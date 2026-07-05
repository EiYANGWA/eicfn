import { LogOut, Menu, SendHorizonal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/message";
import type { OnlineUser } from "../types/online";
import MessageBubble from "./MessageBubble";

type Props = {
  username: string;
  messages: Message[];
  onlineUsers: OnlineUser[];
  input: string;
  onlineNotice: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onLogout: () => void;
};

export default function ChatLayout({
  username,
  messages,
  onlineUsers,
  input,
  onlineNotice,
  onInputChange,
  onSend,
  onLogout
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const otherOnlineUsers = onlineUsers.filter(
    (user) => user.username !== username
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages]);

  function handleMobileLogout() {
    setSidebarOpen(false);
    onLogout();
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className="flex items-start justify-between gap-4 px-1 pb-5">
        <div>
          <div className="text-sm font-semibold text-blue-400">
            Messenger Chat
          </div>
          <h1 className="mt-1 text-2xl font-bold text-white">Team Room</h1>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="border-b border-white/10 pb-5">
        <div className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
          You
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-blue-500/10 p-4 ring-1 ring-blue-400/20">
          <span className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-center text-base font-bold leading-[44px] text-white">
            {username.charAt(0).toUpperCase()}
          </span>

          <div className="min-w-0 flex-1">
            <div className="truncate font-bold text-white">{username}</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Active Now
          </div>
          <div className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-bold text-zinc-300">
            {otherOnlineUsers.length}
          </div>
        </div>

        <div className="space-y-1">
          {otherOnlineUsers.length === 0 ? (
            <div className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm text-zinc-500 ring-1 ring-white/10">
              No other users online
            </div>
          ) : (
            otherOnlineUsers.map((user) => (
              <div
                key={user.userId}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-zinc-800"
              >
                <div className="relative shrink-0">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-700 text-sm font-bold text-zinc-100">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#18191a] bg-emerald-400" />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-zinc-100">
                    {user.username}
                  </div>
                  <div className="truncate text-xs text-zinc-500">
                    {user.email}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={mobile ? handleMobileLogout : onLogout}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 px-4 py-3 text-sm font-bold text-zinc-100 transition hover:bg-zinc-700"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#18191a] text-zinc-100">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/45"
          />

          <aside
            onClick={(event) => event.stopPropagation()}
            className="absolute inset-y-0 left-0 flex w-[min(88vw,340px)] flex-col bg-[#18191a] p-5 shadow-2xl ring-1 ring-white/10"
          >
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      <section className="mx-auto flex h-dvh w-full max-w-7xl overflow-hidden bg-[#242526] shadow-2xl lg:h-[min(900px,94vh)] lg:translate-y-[3vh] lg:rounded-[28px] lg:ring-1 lg:ring-white/10">
        <aside className="hidden w-[340px] shrink-0 flex-col border-r border-white/10 bg-[#18191a] p-5 lg:flex">
          <SidebarContent />
        </aside>

        <div
          className={`flex min-w-0 flex-1 flex-col bg-[#242526] transition duration-300 lg:blur-none ${
            sidebarOpen ? "blur-[2px]" : "blur-0"
          }`}
        >
          <header className="border-b border-white/10 bg-[#242526] px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-zinc-800 text-zinc-100 transition hover:bg-zinc-700 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={22} />
              </button>

              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-bold text-white">
                  General Chat
                </div>
                <div className="truncate text-xs font-medium text-zinc-400">
                  {onlineNotice || `${onlineUsers.length} users online`}
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="hidden items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold text-zinc-100 transition hover:bg-zinc-700 sm:flex lg:hidden"
              >
                <LogOut size={17} />
                Exit
              </button>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
              <div className="flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-bold text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {username}
              </div>

              {otherOnlineUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-100"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {user.username}
                </div>
              ))}
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[#18191a] px-4 py-5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                currentUsername={username}
              />
            ))}

            <div ref={messagesEndRef} />
          </div>

          <footer className="border-t border-white/10 bg-[#242526] p-3 sm:p-4">
            <div className="flex items-end gap-2 rounded-[24px] bg-[#3a3b3c] p-2 sm:gap-3">
              <textarea
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    onSend();
                  }
                }}
                rows={1}
                placeholder="Aa"
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-400"
              />

              <button
                type="button"
                onClick={onSend}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-500"
                aria-label="Send message"
              >
                <SendHorizonal size={20} />
              </button>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}