# GrowtechAxon

GrowtechAxon is organized as a public frontend + separate API backend.

## Run locally

1. Install Node.js 18+.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `MONGODB_URI` and a strong `JWT_SECRET` (32+ characters).
4. For local admin login, set `ADMIN_USERNAME` and `ADMIN_PASSWORD`. For production, prefer `ADMIN_PASSWORD_HASH`.
5. If team image uploads are required, configure Cloudinary values.
6. Install API dependencies:

```bash
cd backend
npm install
cd ..
```

7. Start the complete workspace from the project root:

```bash
npm run dev
```

## Local URLs

- Website: http://localhost:5173
- Admin: http://localhost:5173/admin/
- API: http://localhost:5000/api
- API health: http://localhost:5000/api/health

The root `server.js` is the front entry point. It serves the frontend and starts the API process. The backend never serves the public website.

## Production notes

- Deploy the `frontend/` static site separately from `backend/` when using a managed hosting platform, or keep the root runner behind a reverse proxy.
- Set `FRONTEND_ORIGIN` to the exact production frontend origin.
- Use HTTPS, a long random JWT secret, a bcrypt admin password hash, MongoDB access controls, Cloudinary credentials, backups and monitoring.
- Submit `https://growtechaxon.in/sitemap.xml` in Google Search Console after the production domain is live.
- Do not ship `.env` files, secrets, Git history or `node_modules` in release archives.

## Team / Founder display

- Team profiles are managed from `/admin/` and published through `/api/team`.
- A profile can be marked **Founder / Primary Profile** from the admin Team form.
- The Founder is rendered as a larger centered card; remaining active members appear below in a responsive grid.
- Public team profiles expose only the LinkedIn profile link. Instagram and GitHub fields are not part of the current team UI/API contract.
- Profile photos can be uploaded through the admin panel when Cloudinary is configured.
