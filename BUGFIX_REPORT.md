# GrowtechAxon Bug Fix Report

## Fixes included

1. **Admin/public API environment mismatch:** public pages and Admin previously defaulted to the hosted backend independently. They now use the current origin by default (or `window.GROWTECHAXON_API_URL` when explicitly configured), so local form submissions and Admin reads go through the same local server/API proxy.
2. **Legacy team records:** the public team API now includes records whose `active` field is absent, while still excluding records explicitly marked inactive. Admin API continues to list all team records.
3. **Starter form and pricing plans:** pricing now shows Starter ₹0, Business ₹4,999, and Software/App ₹9,999. Each CTA carries a stable plan ID. The Starter offer form submits `planId=starter`; contact forms carry the chosen plan ID.
4. **Server-authoritative plan storage:** backend validates plan IDs and uses its own plan configuration to store `planId`, `planName`, and `planPrice`; ₹0 is preserved as a numeric value. Existing enquiries without plan fields remain valid. Admin lead table/details show saved plan and price with fallback for historical leads.

## Changed files

- `frontend/assets/js/app.js` — same-origin API, query-selected plan handling and form prefill.
- `frontend/admin/admin.js` — same-origin API and saved plan display.
- `frontend/assets/js/offer-form.js` — same-origin API and selected plan submission.
- `frontend/pages/pricing.html` — requested pricing and plan-specific links.
- `frontend/pages/contact.html` — hidden plan field.
- `backend/api-server.js` — plan validation/storage and legacy active-field handling.
- `backend/MODELS/Lead.js` — optional plan metadata fields.
- `backend/.env.example` — safe configuration template.

## Tests

- **Passed:** `node --check` for `frontend/assets/js/app.js`, `frontend/admin/admin.js`, `frontend/assets/js/offer-form.js`, `backend/api-server.js`, and `backend/MODELS/Lead.js`.
- **Passed:** `npm run check` — `Smoke checks passed.`
- **Passed:** runtime `/api/health` check returned `success: true`.
- **Passed:** invalid plan ID test returned HTTP 400 and `Invalid pricing plan selected.`
- **Passed:** pricing values and CTA destination checks.
- **Not run:** successful MongoDB write/read integration, because the project ZIP cannot safely validate or use production database credentials. After configuring the local `.env`, submit a test lead and confirm it in Admin.

## Run locally

1. Install dependencies with `npm install` at project root and `npm install` in `backend` if required.
2. Copy `backend/.env.example` to `backend/.env` and fill in valid local credentials/configuration.
3. Run `node server.js`.
4. Open `http://localhost:5173/admin/` and verify team records, then submit a test Starter form and verify the lead in Admin.

No database records were modified by packaging this repair.
