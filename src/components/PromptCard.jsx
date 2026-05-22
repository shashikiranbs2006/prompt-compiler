// src/components/PromptCard.jsx
import { PLATFORMS } from "../constants/platforms";
import { CopyButton } from "./CopyButton";

export function PromptCard({ prompt, label, tech, platform, onRefine }) {
  const platformColor = PLATFORMS.find((p) => p.id === platform)?.color || "#a8a8b3";

  return (
    <div className="bg-[#0d0d14] border border-zinc-800 rounded-xl overflow-hidden mt-2 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#12121c] border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border"
            style={{
              color: platformColor,
              background: `${platformColor}18`,
              borderColor: `${platformColor}33`,
            }}
          >
            {label}
          </span>
          {tech && (
            <span className="text-[10px] font-mono text-zinc-600">↳ {tech}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefine && (
            <button
              onClick={onRefine}
              className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 border border-zinc-700 hover:border-zinc-500 rounded-md px-2 py-0.5 transition-all"
            >
              refine →
            </button>
          )}
          <CopyButton text={prompt} small />
        </div>
      </div>

      {/* Prompt content */}
      <pre className="m-0 px-4 py-4 font-mono text-[12px] leading-relaxed text-zinc-300 whitespace-pre-wrap break-words max-h-72 overflow-y-auto">
        {prompt}
      </pre>
    </div>
  );
}
