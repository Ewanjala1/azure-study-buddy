const fs = require("fs");
const path = require("path");
const http = require("http");
const knowledge = require("./knowledge.js");

// Safely load environment variables from .env if present
try {
  if (process.loadEnvFile) {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath);
    }
  }
} catch (e) {
  // Ignore missing or malformed .env
}

const E = process.env;

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
async function ground(query) {
  if (!E.AZURE_SEARCH_ENDPOINT || !E.AZURE_SEARCH_INDEX || !E.AZURE_SEARCH_KEY) return [];
  try {
    const url = `${E.AZURE_SEARCH_ENDPOINT.replace(/\/$/, "")}/indexes/${E.AZURE_SEARCH_INDEX}/docs/search?api-version=2024-07-01`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": E.AZURE_SEARCH_KEY },
      body: JSON.stringify({ search: query, top: 3 }),
    });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.value || []).map((d) => ({ title: d.title, content: String(d.content || "").slice(0, 1500) }));
  } catch (err) {
    console.warn("Grounding query failed, continuing without search sources:", err.message);
    return [];
  }
}

const clip = (s) => String(s || "").trim().slice(0, 80);

// Core study query handler
async function handleStudyRequest(body) {
  const { mode, q, a, b } = body || {};
  const level = LV[body && body.level] ? body.level : "normal";
  let prompt, query;

  if (mode === "compare") {
    const x = clip(a), y = clip(b);
    if (!x || !y) {
      const err = new Error("Both terms are required.");
      err.status = 400;
      throw err;
    }
    query = `${x} ${y}`;
    prompt = comparePrompt(level, x, y);
  } else {
    const t = clip(q);
    if (!t) {
      const err = new Error("A topic is required.");
      err.status = 400;
      throw err;
    }
    query = t;
    prompt = explainPrompt(level, t);
  }

  // If Azure OpenAI is configured, attempt call
  const hasAzureOpenAI = E.AZURE_OPENAI_ENDPOINT && E.AZURE_OPENAI_KEY && E.AZURE_OPENAI_DEPLOYMENT;
  if (hasAzureOpenAI) {
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

      if (r.status === 429) {
        const err = new Error("rate_limited");
        err.status = 429;
        throw err;
      }
      if (r.ok) {
        const j = await r.json();
        return JSON.parse(j.choices[0].message.content);
      }
      console.warn("Azure OpenAI returned status", r.status, "- falling back to knowledge engine.");
    } catch (apiErr) {
      if (apiErr.status === 429) throw apiErr;
      console.warn("Azure OpenAI call failed, using knowledge engine:", apiErr.message);
    }
  }

  // Fallback to local intelligent knowledge engine
  return knowledge.resolveStudyQuery(mode, level, q, a, b);
}

// Check if Express is available
let expressApp = null;
try {
  const express = require("express");
  const app = express();
  app.use(express.json({ limit: "10kb" }));

  // Serve static files from both public/ and root directory
  const publicDir = path.join(__dirname, "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }
  app.use(express.static(__dirname));

  app.post("/api/study", async (req, res) => {
    try {
      const result = await handleStudyRequest(req.body);
      res.json(result);
    } catch (e) {
      if (e.status === 400) return res.status(400).json({ error: e.message });
      if (e.status === 429) return res.status(429).json({ error: "rate_limited" });
      console.error(e);
      res.status(502).json({ error: "upstream" });
    }
  });

  expressApp = app;
} catch (_) {
  // Express not installed; will use built-in http server below
}

// Built-in HTTP server (zero external dependencies required)
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
}

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  // Handle API route
  if (req.method === "POST" && pathname === "/api/study") {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 20000) {
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Payload too large" }));
        req.destroy();
      }
    });

    req.on("end", async () => {
      try {
        const body = raw ? JSON.parse(raw) : {};
        const result = await handleStudyRequest(body);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        const status = err.status || 500;
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message || "upstream" }));
      }
    });
    return;
  }

  // Handle static files
  if (req.method === "GET") {
    let reqPath = pathname === "/" ? "/index.html" : pathname;
    const cleanPath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, "");

    // Check public directory first, then root directory
    const publicPath = path.join(__dirname, "public", cleanPath);
    const rootPath = path.join(__dirname, cleanPath);

    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      return serveFile(res, publicPath);
    }
    if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
      return serveFile(res, rootPath);
    }

    // Default fallback to index.html for root or SPA paths
    const defaultIndex = fs.existsSync(publicPath)
      ? path.join(__dirname, "public", "index.html")
      : path.join(__dirname, "index.html");

    if (fs.existsSync(defaultIndex)) {
      return serveFile(res, defaultIndex);
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain" });
  res.end("Method Not Allowed");
});

const PORT = E.PORT || 3000;
const appToListen = expressApp ? expressApp : server;

appToListen.listen(PORT, () => {
  console.log(`Study Buddy on http://localhost:${PORT}`);
});
