// src/components/ChatBubble.jsx
export function ChatBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#1e1e2e] border border-[#3a3a5a] flex items-center justify-center text-[10px] mr-2 flex-shrink-0 text-indigo-400 font-mono">
          pc
        </div>
      )}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 text-[13px] leading-relaxed text-zinc-300
          ${isUser
            ? "bg-[#1e1e3a] border border-[#3a3a6a] rounded-[12px_12px_4px_12px]"
            : "bg-[#14141e] border border-zinc-800 rounded-[4px_12px_12px_12px]"
          }`}
      >
        {content}
      </div>
    </div>
  );
}
