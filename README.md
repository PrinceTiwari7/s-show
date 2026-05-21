# S-Show – Movie & TV Discovery App

Full-stack setup: **React + Vite** frontend + **Express** backend, running together with a single command.

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your TMDB token
```bash
cp server/.env.example server/.env
```
Then open `server/.env` and replace `your_tmdb_bearer_token_here` with your actual TMDB **Read Access Token (v4 auth)**.

> Get it free at → https://www.themoviedb.org/settings/api  
> Use the **"API Read Access Token"** (long JWT string), NOT the short API key.

### 3. Run everything at once
```bash
npm run dev
```

This starts:
- 🟡 **Express backend** on `http://localhost:5000` (proxies TMDB API, keeps token secret)
- 🔵 **Vite frontend** on `http://localhost:5173` (your React app)

Open your browser at **http://localhost:5173** and you're good to go!

---

## 🗂 Project Structure

```
├── server/
│   ├── index.js          ← Express server (TMDB proxy)
│   ├── .env              ← Your secret token (gitignored)
│   └── .env.example      ← Template – copy to .env
│
├── src/
│   ├── utils/
│   │   └── Axios.jsx     ← Axios instance pointing to /api
│   ├── components/       ← React components (unchanged)
│   └── ...
│
├── vite.config.js        ← Vite proxy: /api → localhost:5000
└── package.json          ← Unified dev script via concurrently
```

---

## 🔒 How the Security Works

```
Browser  →  /api/trending/all/day  →  Vite Proxy  →  Express  →  TMDB API
                                                      (token added here, server-side)
```

The TMDB bearer token **never leaves your server**. It lives in `server/.env` which is gitignored.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start backend + frontend together |
| `npm run dev:server` | Start only the Express backend |
| `npm run dev:client` | Start only the Vite frontend |
| `npm run build` | Production build of the frontend |
| `npm run preview` | Preview the production build |

---

## 🔧 No Code Changes Needed in Components

All your existing components that call `api.get("/trending/all/day")` (or any TMDB path) will work **without modification** because:
- `src/utils/Axios.jsx` baseURL is now `/api`
- Vite proxies `/api/*` to the Express server
- Express strips `/api` and forwards to TMDB with the auth header

---

## 🚀 Future / Production Deployment

When deploying:
1. Build the frontend: `npm run build`
2. Serve the `dist/` folder from Express (add `express.static("dist")`)
3. Set `TMDB_TOKEN` as an environment variable on your hosting platform
4. Remove the Vite proxy (not needed in production)
