// src/components/CopyButton.jsx
import { useState } from "react";

export function CopyButton({ text, small = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        border rounded-md font-mono transition-all duration-200
        ${small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}
        ${copied
          ? "bg-green-500/10 border-green-500 text-green-400"
          : "bg-white/5 border-zinc-700 text-zinc-500 hover:bg-white/10"
        }
      `}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}
