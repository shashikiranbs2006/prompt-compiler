// src/App.jsx
import { useState } from "react";
import { PLATFORMS } from "./constants/platforms";
import { useQuickFix } from "./hooks/useQuickFix";
import { useDeepBuild } from "./hooks/useDeepBuild";
import { QuickFixPanel } from "./components/QuickFixPanel";
import { DeepBuildPanel } from "./components/DeepBuildPanel";

export default function App() {
  const [mode, setMode]         = useState("quick");
  const [platform, setPlatform] = useState("universal");
  const [input, setInput]       = useState("");

  const qf = useQuickFix(platform);
  const db = useDeepBuild(platform);

  const error   = qf.error || db.error;
  const loading = qf.loading || db.loading;
  const platformObj = PLATFORMS.find((p) => p.id === platform);

  const switchMode = (m) => { setMode(m); qf.reset(); db.reset(); setInput(""); };
  const switchPlatform = (p) => { setPlatform(p); qf.reset(); db.reset(); setInput(""); };

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (mode === "quick") { qf.compile(input.trim()); }
    else if (db.phase === "done") { db.refine(input.trim()); }
    else { db.send(input.trim()); }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const submitLabel = loading ? "..." : mode === "quick" ? "compile →" : db.phase === "done" ? "refine →" : "send →";
  const placeholder = mode === "quick"
    ? "Type your rough prompt or idea... (⌘↵ to compile)"
    : db.phase === "done" ? "Refine — 'make it shorter', 'add examples'... (⌘↵)"
    : db.phase === "questioning" ? "Your answer... (⌘↵)"
    : "Describe your idea and I'll ask smart questions to build it... (⌘↵)";

  return (
    <div className="min-h-screen bg-[#08080f] flex flex-col items-center px-4 py-8 pb-20">
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-baseline gap-3 mb-1.5">
          <h1 className="font-mono text-xl font-semibold text-zinc-100 tracking-tight">
            <span className="text-indigo-500">▶</span> prompt<span className="text-indigo-400">compiler</span>
          </h1>
          <span className="font-mono text-[9px] text-zinc-700 bg-[#10101a] px-2 py-0.5 rounded border border-zinc-800 tracking-widest">v1.0</span>
        </div>
        <p className="text-zinc-600 text-xs font-mono tracking-wide">you speak human → your AI needs a prompt → we translate</p>
      </div>

      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex bg-[#0e0e18] border border-zinc-800 rounded-lg p-0.5 gap-0.5">
            {[{ id:"quick", icon:"⚡", label:"Quick Fix"}, { id:"deep", icon:"🔬", label:"Deep Build"}].map((m) => (
              <button key={m.id} onClick={() => switchMode(m.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode===m.id ? "bg-[#1e1e34] border border-[#3a3a5a] text-zinc-200" : "text-zinc-600 hover:bg-[#1a1a28]"}`}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {PLATFORMS.map((p) => (
              <button key={p.id} onClick={() => switchPlatform(p.id)}
                className="px-3 py-1 rounded-full text-[11px] font-mono transition-all border"
                style={{ background: platform===p.id ? `${p.color}18` : "transparent", borderColor: platform===p.id ? p.color : "#2a2a3a", color: platform===p.id ? p.color : "#50506a", opacity: platform===p.id ? 1 : 0.7 }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "quick" && <QuickFixPanel hook={qf} platform={platform} />}
        {mode === "deep"  && <DeepBuildPanel hook={db} platform={platform} />}

        {error && (
          <div className="bg-red-950/40 border border-red-900 rounded-lg px-4 py-3 mb-4 text-red-400 text-xs font-mono">
            ✕ {error}
          </div>
        )}

        <div className="bg-[#0e0e18] border border-zinc-800 rounded-xl overflow-hidden">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={placeholder} rows={3}
            className="w-full bg-transparent border-none px-4 py-4 text-zinc-200 text-sm leading-relaxed placeholder-zinc-700 resize-none outline-none" />
          <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-[#1a1a28]">
            <span className="text-[10px] font-mono text-zinc-800">
              {mode==="quick" ? "⚡ quick fix" : "🔬 deep build"} · {platformObj?.icon} {platformObj?.label}
            </span>
            <button onClick={handleSubmit} disabled={loading || !input.trim()}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-semibold tracking-wide transition-all ${loading||!input.trim() ? "bg-[#1a1a2a] border border-zinc-800 text-zinc-700 cursor-not-allowed" : "bg-indigo-900 border border-indigo-700 text-indigo-100 hover:bg-indigo-800"}`}>
              {submitLabel}
            </button>
          </div>
        </div>

        <div className="text-center mt-5">
          <span className="text-[10px] font-mono text-zinc-900">powered by groq · llama-3.3-70b · no login · no history · just prompts</span>
        </div>
      </div>
    </div>
  );
}
