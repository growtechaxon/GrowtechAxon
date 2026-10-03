# GrowtechAxon architecture
The root `server.js` is the development runner. It serves the static frontend on port 5173 and starts the API child process on port 5000.
- `frontend/` — public website, SEO pages and admin UI.
- `backend/api-server.js` — Express API only.
- `backend/MODELS/` — MongoDB models.
- `docs/` — architecture, security and SEO notes.
Local: Website `http://localhost:5173`, Admin `http://localhost:5173/admin/`, API `http://localhost:5000/api`.
