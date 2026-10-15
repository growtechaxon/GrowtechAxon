# GrowtechAxon Website

A modular static website with an Express/Mongoose API and admin panel. Duplicate archived project copies, Git metadata, committed environment secrets, and unrelated empty files are excluded from this delivery.

## Structure

```text
GrowtechAxon/
├── server.js                  # Local website server + /api proxy
├── package.json               # Root run/check commands
├── .env.example               # Safe configuration template
├── frontend/                  # Public website and admin UI
│   ├── index.html
│   ├── pages/ services/ solutions/ training/
│   ├── assets/css/             # Shared, offer and product styles
│   ├── assets/js/              # Shared, offer, team and product behavior
│   └── admin/                  # Dashboard, styles and feature modules
├── backend/
│   ├── api-server.js            # API entry point
│   ├── package.json
│   ├── .env.example
│   ├── MODELS/                 # Lead, Team, OfferSetting, Product
│   ├── data/                   # Local lead fallback data
│   └── uploads/                # Existing legacy team photo assets
├── tests/                      # HTTP smoke test
└── docs/                       # Architecture, security, SEO
```

## Run locally

1. Install Node.js 18 or later.
2. Copy `backend/.env.example` to `backend/.env` and fill in your own valid values. Never commit `.env`.
3. In `backend/`, run `npm install`.
4. From the project root, run `npm start`.
5. Website: `http://localhost:5173`; admin login: `http://localhost:5173/admin/`; API health: `http://localhost:5000/api/health`.

For admin login, configure `ADMIN_USERNAME`, `ADMIN_PASSWORD` (local only) or `ADMIN_PASSWORD_HASH`, and a random `JWT_SECRET` with at least 32 characters. Set `MONGODB_URI`. Team and project images use Cloudinary when all three Cloudinary values are configured. Local development falls back to `backend/uploads/`; production intentionally returns a clear 503 instead of saving uploads to Render's non-persistent filesystem. Existing legacy `/uploads/team/...` images remain in the project.

## Products

Use **Add Product** in the admin dashboard to select a project image from your computer; the selected image is previewed and uploaded with the project. Editing without selecting a replacement preserves the current image. Product/project metadata remains in the existing MongoDB `products` collection (the existing `Product` model is retained for compatibility). Public cards load all active records from `/api/products`; static featured cards are preserved and matching URLs are not duplicated.

## Offer settings

The offer CSS, public offer JavaScript, and admin offer JavaScript were carried over unchanged. The offer section itself was not refactored.

## Render deployment (single web service)

This repository uses the root `server.js` as the only public entry point. It serves `frontend/` and proxies `/api/*` requests to `backend/api-server.js`. Keep the backend directory name exactly `backend` (lowercase).

In Render, configure the existing Web Service as follows:

- **Root Directory:** leave blank (repository root)
- **Build Command:** `npm install --prefix backend`
- **Start Command:** `node server.js`
- **Health Check Path:** `/api/health` (optional)

Set these environment variables in Render's Environment settings; do not commit `.env` files:

- `MONGODB_URI` — the existing MongoDB connection string
- `JWT_SECRET` — a random secret at least 32 characters long
- `ADMIN_USERNAME` and either `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`
- `FRONTEND_ORIGIN` — comma-separated allowed origins, for example `https://growtechaxon.in,https://www.growtechaxon.in`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` if team-image uploads use Cloudinary

The public server listens on Render's `PORT`; the API uses internal port `5001` on Render. Locally, the website uses port `5173` and the API uses port `5000`. Existing database collections are not migrated or deleted by this deployment configuration.

Before pushing, inspect `git status` and do not commit `.env`, `node_modules`, or local customer data. After deployment, verify `/api/health`, `/api/offer-settings`, the admin login, and the offer settings save flow.

## Exact Windows PowerShell setup

From PowerShell, after extracting the ZIP:

```powershell
cd C:\Users\hp\Downloads\GrowtechAxon
Copy-Item .\backend\.env.example .\backend\.env
notepad .\backend\.env
cd .\backend
npm install
cd ..
npm start
```

Fill `backend/.env` with your own MongoDB URI, a new random JWT secret, admin credentials, and Cloudinary credentials before expecting database-backed admin operations or production-style uploads to work. Do not paste real secrets into chat. The website is served at `http://localhost:5173`, admin at `http://localhost:5173/admin/`, and API health at `http://localhost:5000/api/health`. To run the static HTTP smoke test, open a second PowerShell window in the project root and run `npm run check`.

## Image storage

- Supported upload formats are JPEG/JPG, PNG, and WEBP, with a 5 MB maximum. The API checks both declared MIME type and file signature.
- Production deployments must configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Do not use Render's ephemeral filesystem for production uploads.
- On local development without Cloudinary, uploaded files are written beneath `backend/uploads/team/` or `backend/uploads/projects/` and served by the API.

## Verification limits

Run `npm run check` for the HTTP/static smoke test and `node --check` on JavaScript files. Database-backed CRUD and real Cloudinary uploads require working MongoDB, admin credentials/JWT configuration, and Cloudinary credentials; they must be tested after those are supplied. The audit environment used for this ZIP had no network/DNS access to npm or the live Render domains, so those external checks are marked blocked rather than passed.
