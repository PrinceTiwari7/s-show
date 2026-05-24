import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only in development
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_BASE_URL = "https://api.tmdb.org/3";
const IS_PROD = process.env.NODE_ENV === "production";

// Trim token
const TMDB_TOKEN = (process.env.TMDB_TOKEN || "").trim();

if (!IS_PROD) {
    app.use(cors({ origin: "http://localhost:5173" }));
} else {
    app.use(cors());
}

app.use(express.json());

// Serve built React app
if (IS_PROD) {
    const distPath = path.join(__dirname, "../dist");
    app.use(express.static(distPath));
}

// Decode JWT to get API Key if it is a v4 token
let tmdbKey = TMDB_TOKEN;
if (TMDB_TOKEN.includes(".")) {
    try {
          const payload = JSON.parse(Buffer.from(TMDB_TOKEN.split(".")[1], "base64").toString());
          if (payload && payload.aud) {
                  tmdbKey = payload.aud;
          }
    } catch (e) {
          console.error("Error parsing TMDB_TOKEN JWT:", e.message);
    }
}

// TMDB axios client
const tmdb = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
          api_key: tmdbKey,
    },
    timeout: 15000,
});

// Concurrency semaphore
const MAX_CONCURRENT = 3;
let activeCount = 0;
const waitQueue = [];

const acquire = () =>
    new Promise((resolve) => {
          if (activeCount < MAX_CONCURRENT) { activeCount++; resolve(); }
          else waitQueue.push(resolve);
    });

const release = () => {
    if (waitQueue.length > 0) waitQueue.shift()();
    else activeCount--;
};

// Response cache
const cache = new Map();
const CACHE_TTL = 60000;

const getCached = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
    return entry.data;
};
const setCached = (key, data) => cache.set(key, { data, ts: Date.now() });

// In-flight deduplication
const inFlight = new Map();

// Core TMDB fetcher
const fetchFromTMDB = async (path, params, attempt = 0) => {
    await acquire();
    let released = false;
    try {
          const response = await tmdb.get(path, { params });
          return response.data;
    } catch (err) {
          const retryable = !err.response || err.code === "ECONNRESET" ||
                  err.code === "ECONNABORTED" || err.response?.status >= 500;
          if (attempt < 3 && retryable) {
                  release();
                  released = true;
                  await new Promise((r) => setTimeout(r, (attempt + 1) * 1000));
                  return fetchFromTMDB(path, params, attempt + 1);
          }
          throw err;
    } finally {
          if (!released) release();
    }
};

const fetchTMDB = (tmdbPath, params) => {
    const cacheKey = `${tmdbPath}?${new URLSearchParams(params).toString()}`;
    const cached = getCached(cacheKey);
    if (cached) return Promise.resolve(cached);
    if (inFlight.has(cacheKey)) return inFlight.get(cacheKey);

    const promise = fetchFromTMDB(tmdbPath, params)
      .then((data) => { setCached(cacheKey, data); inFlight.delete(cacheKey); return data; })
      .catch((err) => { inFlight.delete(cacheKey); throw err; });

    inFlight.set(cacheKey, promise);
    return promise;
};

// API proxy route
app.get("/api/*", async (req, res) => {
    if (!TMDB_TOKEN) {
          return res.status(500).json({ error: "TMDB_TOKEN not set in environment" });
    }
    const tmdbPath = req.path.replace(/^\/api/, "");
    try {
          const data = await fetchTMDB(tmdbPath, req.query);
          res.json(data);
    } catch (err) {
          const status = err?.response?.status || 500;
          const message = err?.response?.data?.status_message || err?.message || "TMDB request failed";
          console.error(`[TMDB Error] ${status} - ${message} (${tmdbPath})`);
          res.status(status).json({ error: message });
    }
});

// Health check
app.get("/health", (_req, res) =>
    res.json({ status: "ok", port: PORT, tokenLoaded: !!TMDB_TOKEN, env: IS_PROD ? "production" : "development" })
        );

// Catch-all
if (IS_PROD) {
    app.get("*", (_req, res) => {
          res.sendFile(path.join(__dirname, "../dist", "index.html"));
    });
}

// Start
app.listen(PORT, () => {
    console.log(`\n S-Show backend running at http://localhost:${PORT}`);
    console.log(` Mode: ${IS_PROD ? "PRODUCTION" : "DEVELOPMENT"}`);
    if (!TMDB_TOKEN) {
          console.warn(" TMDB_TOKEN is not set!");
    } else {
          console.log(` TMDB token loaded (${TMDB_TOKEN.slice(0, 20)}...)`);
          console.log(` Concurrency limit : ${MAX_CONCURRENT} parallel TMDB requests`);
          console.log(` Response cache TTL : ${CACHE_TTL / 1000}s`);
          console.log(` Auto-retry : 3 retries with 1s/2s/3s back-off`);
          console.log(` In-flight dedupe : enabled\n`);
    }
});
