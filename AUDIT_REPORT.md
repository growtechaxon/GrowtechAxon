# GrowtechAxon audit and repair report

## Scope
Audited the uploaded `GrowtechAxon(2).zip` source. Existing frontend structure, brand, Product model/collection, Team model/collection, and API route names were retained. No database was connected, migrated, cleared, or modified by this audit.

## Root causes found and corrections

1. **Team image upload**: The admin already used `FormData` and the `photo` field, while the API expected `upload.single('photo')`. The reported empty `photo` response proves that the saved document had no image URL, but by itself does not prove which hop lost the file. The backend now validates actual image signatures, returns actionable upload errors, requires all Cloudinary credentials before cloud upload, saves a returned secure URL, and preserves the existing image when no replacement file is selected.
2. **Project image management**: The admin accepted only a manually typed image URL and sent JSON; it had no computer-file selector or upload flow. It now uses a file selector, preview, `FormData`, upload/loading messages, and keeps the current image when editing without a replacement. The existing `/api/admin/products` route and Product collection remain.
3. **Project display/deduplication**: `/api/products` already queried all active Product records without a limit. The public script appended managed records but its duplicate set omitted some hard-coded featured project URLs. It now checks the current grid's existing links before appending managed projects and resolves local `/uploads/` image references against the API origin.
4. **Team social fields**: The admin sent Instagram and GitHub values, but the Team schema did not define them, so Mongoose strict mode could discard them. The schema and Team CRUD now preserve these fields.
5. **Update semantics**: Team updates now preserve omitted fields and the old image. Project updates load the selected record and preserve its old image when no replacement is uploaded. Invalid IDs and missing records return appropriate 400/404 responses.
6. **Storage safety**: Uploads are limited to 5 MB and JPG/JPEG, PNG, or WEBP. File signatures are checked in addition to MIME type. Local disk fallback is restricted to non-production; production without Cloudinary returns a clear 503 instead of silently using ephemeral storage.

## API route inventory

| Method | Route | Auth | Purpose | Test status in this environment |
|---|---|---|---|---|
| GET | `/`, `/api`, `/api/health`, `/api/test` | Public | Service status | Source inspected; HTTP runtime check blocked by missing dependencies/network |
| GET | `/api/offer-settings` | Public | Read public offer settings | Source inspected; DB test blocked |
| PUT | `/api/admin/offer-settings` | Admin bearer token | Save offer settings | Source inspected; DB/auth test blocked |
| POST | `/api/admin/login` | Public with rate limit | Issue admin JWT | Source inspected; credentials unavailable |
| POST | `/api/leads` | Public with rate limit | Create lead | Source inspected; DB test blocked |
| GET | `/api/leads` | Admin bearer token | List leads | Source inspected; DB/auth test blocked |
| PUT | `/api/leads/:id/status` | Admin bearer token | Update lead status | Source inspected; DB/auth test blocked |
| DELETE | `/api/leads/:id` | Admin bearer token | Delete lead | Source inspected; DB/auth test blocked |
| GET | `/api/team` | Public | List active team members | Source inspected; DB test blocked |
| GET | `/api/admin/team` | Admin bearer token | List all team members | Source inspected; DB/auth test blocked |
| POST | `/api/admin/team` | Admin bearer token | Create member and optional image upload | Source inspected; upload/DB test blocked |
| PUT | `/api/admin/team/:id` | Admin bearer token | Update member and optional image replacement | Source inspected; upload/DB test blocked |
| DELETE | `/api/admin/team/:id` | Admin bearer token | Delete member | Source inspected; DB/auth test blocked |
| GET | `/api/products` | Public | List all active projects | Source inspected; DB test blocked |
| GET | `/api/admin/products` | Admin bearer token | List all projects | Source inspected; DB/auth test blocked |
| POST | `/api/admin/products` | Admin bearer token | Create project and optional image upload | Source inspected; upload/DB test blocked |
| PUT | `/api/admin/products/:id` | Admin bearer token | Update one project and optionally replace image | Source inspected; upload/DB test blocked |
| DELETE | `/api/admin/products/:id` | Admin bearer token | Delete one project | Source inspected; DB/auth test blocked |

## Verification performed

- JavaScript syntax checks: performed after edits.
- Full `npm ci`: **blocked** because the environment could not resolve `registry.npmjs.org`; dependencies were not installed.
- Live Render API requests: **blocked** because DNS resolution to `growtechaxon-backend.onrender.com` and `growtechaxon.in` was unavailable from the audit environment.
- MongoDB persistence, admin authentication, and Cloudinary uploads: **blocked** because valid environment credentials were not available and must not be invented.
- No successful live CRUD or image persistence claims are made.

## Deployment requirements

Use repository root as Render Root Directory, Build Command `npm install --prefix backend`, Start Command `node server.js`, Health Check Path `/api/health`. Configure `MONGODB_URI`, `JWT_SECRET` (at least 32 random characters), `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (preferred) or `ADMIN_PASSWORD`, `FRONTEND_ORIGIN`, and all three Cloudinary variables. Keep the existing MongoDB URI/database unchanged.
