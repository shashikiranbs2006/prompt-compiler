// src/hooks/useQuickFix.js
import { useState } from "react";
import { callGroq } from "../api/groq";
import { QUICK_FIX_SYSTEM, REFINE_SYSTEM } from "../constants/systemPrompts";
import { parseQuickFix } from "../utils/parsers";

export function useQuickFix(platform) {
  const [variations, setVariations] = useState(null);
  const [refined, setRefined]       = useState(null);
  const [refineIdx, setRefineIdx]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const compile = async (userInput) => {
    setLoading(true);
    setError(null);
    setVariations(null);
    setRefined(null);
    setRefineIdx(null);

    try {
      const raw  = await callGroq(QUICK_FIX_SYSTEM(platform), userInput);
      const vars = parseQuickFix(raw);
      if (!vars.length) throw new Error("Couldn't parse variations — try again.");
      setVariations(vars);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const refine = async (originalPrompt, refineRequest) => {
    setLoading(true);
    setError(null);

    try {
      const result = await callGroq(
        REFINE_SYSTEM(platform),
        `Original prompt:\n${originalPrompt}\n\nRefinement request: ${refineRequest}`
      );
      setRefined(result.trim());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setVariations(null);
    setRefined(null);
    setRefineIdx(null);
    setError(null);
  };

  return {
    variations, refined, refineIdx, setRefineIdx,
    loading, error,
    compile, refine, reset,
  };
}
