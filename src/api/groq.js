// src/api/groq.js
// All API calls go through this single file.
// API key is read from .env — never hardcoded.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

/**
 * Call the Groq API with a system prompt and user message.
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @returns {Promise<string>} The model's text response
 */
export async function callGroq(systemPrompt, userMessage) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error(
      "No API key found. Copy .env.example to .env and add your Groq key."
    );
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `API error: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
