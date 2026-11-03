# Balaji Stationery and Communications — Render deployment

This project is configured as one Node/Express web service: Express serves the built Vite frontend and exposes the PostgreSQL-backed API on the same domain.

## 1. Neon database

1. In Neon Console, open your project and click **Connect**.
2. Select the branch and database you created; copy the pooled PostgreSQL connection string (include `sslmode=require`).
3. Keep the connection string private. Do not put it in frontend code or commit it to GitHub.
4. The server creates the `admin_users` and `customer_requests` tables automatically on its first successful start.

The selected Neon region can remain as-is. It does not need to match the user's location; choose a nearby region for lower latency if you later create a new database.

## 2. Push the updated project to GitHub

Upload/commit the contents of this `bsc-website` directory to the repository root (the `package.json`, `src/`, `server/`, and `index.html` must be at the root). Commit the updated `package.json`, `server/index.js`, `.env.example`, `.gitignore`, and `README-RENDER.md`.

## 3. Create the Render service

Use **New + → Web Service**, not Static Site.

- Repository: your Balaji Stationery repository
- Root Directory: leave blank if `package.json` is in repository root; otherwise set it to `bsc-website`
- Runtime: Node
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Instance: a Node web service (a free instance is suitable for initial testing; check Render's current plan limits)

## 4. Set Render Environment Variables

In Render → your Web Service → **Environment**, add:

- `NODE_ENV` = `production`
- `DATABASE_URL` = the Neon PostgreSQL connection string
- `ADMIN_PASSWORD` = a new, unique password with at least 12 characters
- `JWT_SECRET` = a cryptographically random secret of at least 32 characters

Generate a JWT secret locally with `openssl rand -hex 32`. Never use the example values from `.env.example` as real secrets. Do not paste secrets into chat, source code, GitHub, or screenshots.

The initial admin password is hashed and stored when the database is initialized for the first time. If the database already has an admin row, changing `ADMIN_PASSWORD` in Render does not reset that row; use the admin dashboard's password-change screen instead.

## 5. Verify deployment

After deploy, open `https://YOUR-RENDER-SERVICE.onrender.com/api/health`. Expected response: `{"ok":true,"database":"connected"}`.

Then test a customer request using non-sensitive test details, log into the admin dashboard, and confirm it appears. Request tracking uses the generated request ID and intentionally reveals only service/status/date information publicly.

## 6. Connect GoDaddy domain

In Render → Settings → Custom Domains, add `balajicommunications.in` and `www.balajicommunications.in`. Copy the exact DNS records Render displays into GoDaddy → Domain → DNS → Manage DNS. Do not use guessed record values. Remove only conflicting records after checking they are old website records. Verify the domain in Render and wait for DNS/SSL provisioning.

## Security and current scope

- Admin API routes require a signed 8-hour JWT; passwords are hashed with bcrypt.
- Public request tracking requires the unguessable request ID and does not return customer mobile, payment details, or admin notes.
- Full card numbers, CVV/CVC, OTP, PIN, and passwords must never be submitted or stored. Do not collect card credentials or bank login details.
- The existing payment UI is not connected to a real payment gateway. Payment details are recorded as **verification pending**; staff must verify payments independently. Do not treat the UI's UPI selection as proof of payment.
- Service catalogue edits, theme/logo preferences, and gateway display settings still use browser local storage. They are not yet shared between devices. Customer requests and request statuses are stored centrally in Neon.
- Uploaded files are currently represented by filenames only; no cloud file storage is configured.
