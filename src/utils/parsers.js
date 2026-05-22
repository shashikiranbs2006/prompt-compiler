// src/utils/parsers.js

/**
 * Parse Quick Fix response into 3 variation objects.
 */
export function parseQuickFix(raw) {
  const variations = [];
  const sections = raw.split(/---VARIATION_[ABC]---/).filter(Boolean);

  sections.forEach((section, i) => {
    const labelMatch = section.match(/\[LABEL\]:\s*(.+)/);
    const techMatch  = section.match(/\[TECHNIQUE\]:\s*(.+)/);
    const promptMatch = section.match(/\[PROMPT\]:\n([\s\S]+?)(?=---END---|$)/);

    if (promptMatch) {
      variations.push({
        label:  labelMatch?.[1]?.trim()  || ["Minimal Fix", "Contextual", "Fully Structured"][i],
        tech:   techMatch?.[1]?.trim()   || "",
        prompt: promptMatch[1].replace(/---END---/g, "").trim(),
      });
    }
  });

  return variations;
}

/**
 * Parse Deep Build response into { phase, msg, prompt }.
 */
export function parseDeepBuild(raw) {
  const phase  = raw.match(/PHASE:\s*(QUESTION|GENERATE)/)?.[1] || "QUESTION";
  const msg    = raw.match(/MESSAGE:\s*([\s\S]+?)(?=PROMPT:|$)/)?.[1]?.trim() || raw.trim();
  const prompt = raw.match(/PROMPT:\n([\s\S]+)/)?.[1]?.trim() || null;
  return { phase, msg, prompt };
}
