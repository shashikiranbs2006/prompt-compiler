// src/components/QuickFixPanel.jsx
import { useState } from "react";
import { PromptCard } from "./PromptCard";
import { LoaderDots } from "./LoaderDots";

export function QuickFixPanel({ hook, platform }) {
  const { variations, refined, refineIdx, setRefineIdx, loading } = hook;
  const [refineInput, setRefineInput] = useState("");

  const handleRefine = (prompt) => {
    hook.refine(prompt, refineInput);
    setRefineInput("");
  };

  if (loading && !variations) {
    return (
      <div className="bg-[#0e0e18] border border-zinc-800 rounded-xl p-5 flex items-center gap-3 mb-6 fade-in">
        <LoaderDots />
        <span className="text-zinc-500 text-xs font-mono">
          compiling 3 variations for {platform}...
        </span>
      </div>
    );
  }

  if (!variations) return null;

  return (
    <div className="mb-6 fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-zinc-600 text-xs font-mono">
          // 3 variations · {platform} format
        </span>
        <button
          onClick={hook.reset}
          className="text-zinc-700 hover:text-zinc-500 text-[10px] font-mono transition-colors"
        >
          ↺ start over
        </button>
      </div>

      {variations.map((v, i) => (
        <div key={i} className="mb-4">
          <PromptCard
            prompt={v.prompt}
            label={v.label}
            tech={v.tech}
            platform={platform}
            onRefine={refineIdx === i ? null : () => { setRefineIdx(i); }}
          />

          {/* Inline refine input */}
          {refineIdx === i && !refined && (
            <div className="flex gap-2 mt-2 px-3 py-2.5 bg-[#0e0e18] border border-zinc-800 rounded-lg">
              <input
                value={refineInput}
                onChange={(e) => setRefineInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRefine(v.prompt)}
                placeholder="make it shorter · add examples · change tone..."
                className="flex-1 bg-transparent border-none text-zinc-300 text-xs font-mono placeholder-zinc-700 outline-none"
              />
              <button
                onClick={() => handleRefine(v.prompt)}
                disabled={loading || !refineInput.trim()}
                className="bg-indigo-900 hover:bg-indigo-800 text-indigo-200 rounded-md px-3 py-1 text-xs font-mono disabled:opacity-40 transition-colors"
              >
                refine
              </button>
            </div>
          )}

          {/* Refined result */}
          {refineIdx === i && refined && (
            <div className="mt-2 fade-in">
              <PromptCard
                prompt={refined}
                label="Refined"
                tech="user refinement"
                platform={platform}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
