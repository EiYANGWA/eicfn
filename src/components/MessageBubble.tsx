import type { Message } from "../types/message";

type Props = {
  message: Message;
  currentUsername: string;
};

export default function MessageBubble({ message, currentUsername }: Props) {
  const mine = message.sender.username === currentUsername;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] px-4 py-2.5 shadow-sm ${
          mine
            ? "rounded-[22px] rounded-br-md bg-blue-600 text-white"
            : "rounded-[22px] rounded-bl-md bg-white text-slate-950"
        }`}
      >
        {!mine && (
          <div className="mb-1 text-xs font-bold text-slate-500">
            {message.sender.username}
          </div>
        )}

        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.text}
        </p>

        <div
          className={`mt-1 text-right text-[11px] ${
            mine ? "text-blue-100" : "text-slate-400"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </div>
    </div>
  );
}