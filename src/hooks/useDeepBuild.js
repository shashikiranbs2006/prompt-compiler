// src/hooks/useDeepBuild.js
import { useState } from "react";
import { callGroq } from "../api/groq";
import { DEEP_BUILD_SYSTEM, REFINE_SYSTEM } from "../constants/systemPrompts";
import { parseDeepBuild } from "../utils/parsers";

export function useDeepBuild(platform) {
  const [chat, setChat]       = useState([]); // { role, content }
  const [finalPrompt, setFinalPrompt] = useState(null);
  const [phase, setPhase]     = useState("idle"); // idle | questioning | done
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const buildContextString = (history) =>
    history.map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`).join("\n");

  const send = async (userMessage) => {
    const newChat = [...chat, { role: "user", content: userMessage }];
    setChat(newChat);
    setLoading(true);
    setError(null);

    try {
      const ctx = buildContextString(newChat);
      const raw = await callGroq(DEEP_BUILD_SYSTEM(platform, ctx), userMessage);
      const parsed = parseDeepBuild(raw);

      if (parsed.phase === "GENERATE" && parsed.prompt) {
        setChat((prev) => [...prev, { role: "assistant", content: parsed.msg }]);
        setFinalPrompt(parsed.prompt);
        setPhase("done");
      } else {
        setChat((prev) => [...prev, { role: "assistant", content: parsed.msg }]);
        setPhase("questioning");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const refine = async (refineRequest) => {
    if (!finalPrompt) return;
    const newChat = [...chat, { role: "user", content: refineRequest }];
    setChat(newChat);
    setLoading(true);
    setError(null);

    try {
      const result = await callGroq(
        REFINE_SYSTEM(platform),
        `Original prompt:\n${finalPrompt}\n\nRefinement request: ${refineRequest}`
      );
      setFinalPrompt(result.trim());
      setChat((prev) => [...prev, { role: "assistant", content: "Done! Here's your refined prompt ↓" }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setChat([]);
    setFinalPrompt(null);
    setPhase("idle");
    setError(null);
  };

  return {
    chat, finalPrompt, phase,
    loading, error,
    send, refine, reset,
  };
}
