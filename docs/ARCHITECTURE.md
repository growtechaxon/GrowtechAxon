# GrowtechAxon architecture

## Runtime layout
- `server.js`: local/static frontend server and same-origin `/api` proxy.
- `frontend/`: public pages, assets, team rendering, product rendering, and admin UI.
- `frontend/assets/css/` and `frontend/assets/js/`: page behavior/styles split into small modules, including product cards.
- `frontend/admin/`: admin HTML, styles, team/lead logic, and isolated product management module.
- `backend/api-server.js`: Express API, authentication, rate limits, and API routes.
- `backend/MODELS/`: Mongoose models (`Lead`, `Team`, `OfferSetting`, `Product`).
- `tests/`: lightweight HTTP smoke tests.
- `docs/`: architecture/security/SEO notes.

## Local start
1. Copy `.env.example` to `backend/.env` and set valid MongoDB, admin, JWT and Cloudinary credentials.
2. Run `npm install` in `backend/`.
3. Run `npm start` from the repository root.
4. Website: `http://localhost:5173`; Admin: `http://localhost:5173/admin/`; API health: `http://localhost:5000/api/health`.

Product management uses authenticated `/api/admin/products` routes and stores product metadata in MongoDB. Public product cards read `/api/products`. Offer settings and offer assets remain separate and are intentionally not refactored.
