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

For admin login, configure `ADMIN_USERNAME`, `ADMIN_PASSWORD` (local only) or `ADMIN_PASSWORD_HASH`, and a random `JWT_SECRET` with at least 32 characters. Set `MONGODB_URI`. Cloudinary credentials are needed for new team photo uploads; legacy `/uploads/team/...` images are served from the retained uploads directory.

## Products

Use **Add Product** in the admin dashboard. Product metadata is saved to MongoDB through authenticated `/api/admin/products` endpoints and public cards load from `/api/products`. The four existing featured cards include Online Exam System, Portfolio Website, Growtech Axon, and Super Dry Cleaners.

## Offer settings

The offer CSS, public offer JavaScript, and admin offer JavaScript were carried over unchanged. The offer section itself was not refactored.
