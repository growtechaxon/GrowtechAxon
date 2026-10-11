# GrowtechAxon — Render deployment

## Use one Render Web Service

Configure the existing service that owns `growtechaxon-backend.onrender.com`:

- Root Directory: leave blank (repository root)
- Build Command: `npm install --prefix backend`
- Start Command: `node server.js`
- Optional Health Check Path: `/api/health`

Do not set the Root Directory to `backend`. The root `server.js` serves the frontend on Render's public `PORT` and proxies `/api/*` to the API process on internal port `5001`.

## Required Render environment variables

Set these in Render Dashboard → service → Environment. Do not commit `.env` files.

- `MONGODB_URI`: your existing MongoDB connection string
- `JWT_SECRET`: random secret with at least 32 characters
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD` (prefer the hash)
- `FRONTEND_ORIGIN`: `https://growtechaxon.in,https://www.growtechaxon.in`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` if using Cloudinary image uploads

Keep the existing MongoDB URI/database unchanged to preserve current data. This deployment configuration does not intentionally delete or migrate collections.

## Verify after deployment

1. Open `https://growtechaxon-backend.onrender.com/api/health` — expect JSON with `"status":"ok"`.
2. Open `https://growtechaxon-backend.onrender.com/api/offer-settings` — expect JSON with an `offer` object. This route needs a working MongoDB connection.
3. Open `https://growtechaxon-backend.onrender.com/` — the public website should load.
4. Test admin login and save the offer setting from the dashboard.

## Git safety

Before committing, run `git status`. Never commit `.env`, `node_modules`, or local customer data. The source ZIP intentionally excludes these. Keep the original ZIP as a private backup because it contains local-only files.
