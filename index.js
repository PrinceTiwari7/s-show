import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always load .env from the same folder as this file (server/.env)
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ──────────────────────────────────────────────
//  Generic catch-all proxy route
//  Forwards /api/<path>?<query> → TMDB /<path>?<query>
// ──────────────────────────────────────────────
app.get("/api/*", async (req, res) => {
  try {
    // Read token fresh on every request so timing issues don't matter
    const TMDB_TOKEN = process.env.TMDB_TOKEN;

    if (!TMDB_TOKEN) {
      return res.status(500).json({ error: "TMDB_TOKEN not set in server/.env" });
    }

    // Strip the leading /api from the path
    const tmdbPath = req.path.replace(/^\/api/, "");

    // Forward all query params (page, language, etc.)
    const response = await axios.get(`${TMDB_BASE_URL}${tmdbPath}`, {
      params: req.query,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (err) {
    const status = err?.response?.status || 500;
    const message = err?.response?.data?.status_message || "TMDB request failed";
    console.error(`[TMDB Error] ${status} – ${message}`);
    res.status(status).json({ error: message });
  }
});

// ──────────────────────────────────────────────
//  Health check
// ──────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", port: PORT }));

app.listen(PORT, () => {
  const token = process.env.TMDB_TOKEN;
  console.log(`\n✅  S-Show backend running at http://localhost:${PORT}`);
  if (!token) {
    console.warn("⚠️   TMDB_TOKEN is not set! Add it to server/.env");
  } else {
    console.log(`🔑  TMDB token loaded (${token.slice(0, 20)}...)`);
  }
});
