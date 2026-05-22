// src/components/DeepBuildPanel.jsx
import { useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { PromptCard } from "./PromptCard";
import { LoaderDots } from "./LoaderDots";
import { PLATFORMS } from "../constants/platforms";

export function DeepBuildPanel({ hook, platform }) {
  const { chat, finalPrompt, phase, loading } = hook;
  const endRef = useRef(null);
  const platformLabel = PLATFORMS.find((p) => p.id === platform)?.label;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  if (chat.length === 0 && !loading) return null;

  return (
    <div className="bg-[#0a0a14] border border-zinc-800 rounded-xl mb-4 overflow-hidden fade-in">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e2e]">
        <span className="text-[10px] font-mono text-zinc-700">
          // deep build · {platformLabel} ·{" "}
          {phase === "done" ? "prompt generated" : "collecting context"}
        </span>
        <button
          onClick={hook.reset}
          className="text-[10px] font-mono text-zinc-700 hover:text-zinc-500 transition-colors"
        >
          ↺ start over
        </button>
      </div>

      {/* Chat messages */}
      <div className="px-4 py-4 max-h-80 overflow-y-auto">
        {chat.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="pl-9">
            <LoaderDots />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Final prompt output */}
      {finalPrompt && (
        <div className="px-4 pb-4">
          <PromptCard
            prompt={finalPrompt}
            label={`${platformLabel} Prompt`}
            platform={platform}
          />
        </div>
      )}
    </div>
  );
}
