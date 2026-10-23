const express = require("express");
const E = process.env;
const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(express.static("public"));

const LV = {
  eli12: "Explain like I’m 12: everyday objects, no jargon, short sentences.",
  normal: "Clear beginner level; define each technical term once.",
  exam: "Exam focused: precise Microsoft fundamentals-exam wording, what the exam tends to test, common traps.",
};
const SYSTEM =
  "You are a patient Azure study buddy for beginners preparing for Microsoft Azure fundamentals exams (AZ-900, AI-900). " +
  "Reply with ONLY valid JSON. If you are unsure of a fact or the topic is not Azure or cloud related, " +
  'set "confidence" to "low" and say what you are unsure about instead of guessing.';

const explainPrompt = (level, t) =>
  `Level: ${LV[level]}\nTopic: "${t}"\nJSON shape: {"title":string,"analogy":string (everyday analogy, max 40 words),"definition":string (accurate, max 60 words),"exam_tip":string (one line),"check":{"q":string,"options":[three strings],"answer":0|1|2 (index of correct option),"why":string (one or two sentences)},"confidence":"high"|"low"}`;
const comparePrompt = (level, a, b) =>
  `Level: ${LV[level]}\nCompare "${a}" and "${b}".\nJSON shape: {"title":string,"rows":[exactly four {"aspect":string,"a":string,"b":string} each cell max 14 words],"remember":string (one-line memory hook),"confidence":"high"|"low"}`;

// Optional grounding: Azure AI Search index over Microsoft Learn exam pages.
// Expected index fields: title, content (adjust below to match your index).
async function ground(query) {
  if (!E.AZURE_SEARCH_ENDPOINT || !E.AZURE_SEARCH_INDEX || !E.AZURE_SEARCH_KEY) return [];
  const url = `${E.AZURE_SEARCH_ENDPOINT.replace(/\/$/, "")}/indexes/${E.AZURE_SEARCH_INDEX}/docs/search?api-version=2024-07-01`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": E.AZURE_SEARCH_KEY },
    body: JSON.stringify({ search: query, top: 3 }),
  });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.value || []).map((d) => ({ title: d.title, content: String(d.content || "").slice(0, 1500) }));
}

const clip = (s) => String(s || "").trim().slice(0, 80);

app.post("/api/study", async (req, res) => {
  const { mode, q, a, b } = req.body || {};
  const level = LV[req.body && req.body.level] ? req.body.level : "normal";
  let prompt, query;
  if (mode === "compare") {
    const x = clip(a), y = clip(b);
    if (!x || !y) return res.status(400).json({ error: "Both terms are required." });
    query = `${x} ${y}`;
    prompt = comparePrompt(level, x, y);
  } else {
    const t = clip(q);
    if (!t) return res.status(400).json({ error: "A topic is required." });
    query = t;
    prompt = explainPrompt(level, t);
  }
  try {
    const sources = await ground(query);
    const user = sources.length
      ? `${prompt}\n\nSources (use only these for factual claims; if they don't cover the topic, set confidence to "low"):\n` +
        sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.content}`).join("\n")
      : prompt;
    const url = `${E.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "")}/openai/deployments/${E.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${E.AZURE_OPENAI_API_VERSION || "2024-10-21"}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": E.AZURE_OPENAI_KEY },
      body: JSON.stringify({
        messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });
    if (r.status === 429) return res.status(429).json({ error: "rate_limited" });
    if (!r.ok) throw new Error(await r.text());
    const j = await r.json();
    res.json(JSON.parse(j.choices[0].message.content));
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "upstream" });
  }
});

app.listen(E.PORT || 3000, () => console.log(`Study Buddy on http://localhost:${E.PORT || 3000}`));
