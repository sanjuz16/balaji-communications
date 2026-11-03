# Balaji Stationery and Communications — full-stack website

This project includes the React website, an Express API, and persistent PostgreSQL storage for customer service requests. It is prepared for deployment to Render with a managed PostgreSQL database (for example, Neon) and then connecting `balajicommunications.in` from GoDaddy.

## What is persisted
- Customer service requests are stored in PostgreSQL and remain available across devices.
- Admin can sign in, see the request list, and update request status.
- Customers can track a request only with both the Request ID and the same 10-digit mobile number.
- The admin password is hashed in the database; the browser no longer contains a default password.

## Safety and payment notes
- Do not collect/store full card numbers, CVV, PIN, OTP, net-banking passwords, or bank-account credentials. The API does not store card last-four digits.
- The payment UI is not a live payment gateway. It does not verify payments or mark online payments as paid. Before accepting online payments, integrate an approved provider (such as Razorpay) on the server and verify payment signatures/webhooks.
- The current app's service catalogue and some presentation settings remain browser-local. Customer requests and status updates are server-backed.
- The website still uses the shop contact details present in the original supplied TSX. Review them in `src/App.tsx` before publishing.

## 1. Create a PostgreSQL database
1. Create a database with a managed PostgreSQL provider such as Neon.
2. Copy its connection string. It should start with `postgresql://` and generally include `sslmode=require`.
3. Keep this URL private; never place it in frontend code or commit it to a public repository.

The server automatically creates its tables on first startup.

## 2. Deploy the app to Render
1. Put this project in a private GitHub repository, or upload it using a deployment method supported by Render.
2. In Render, create a **Web Service** from the repository.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add these environment variables in Render:
   - `DATABASE_URL`: your PostgreSQL connection string
   - `JWT_SECRET`: a unique random secret at least 32 characters long
   - `ADMIN_PASSWORD`: a strong initial admin password (12+ characters)
   - `NODE_ENV`: `production`
6. Deploy and wait until `/api/health` reports `{"ok":true,"database":"connected"}`.
7. Save the initial admin password securely. Sign in on the website and change it in the Security tab.

A `render.yaml` file is included as a deployment reference. Render may ask you to configure the environment values manually.

## 3. Connect GoDaddy domain
1. In Render, open the deployed service's **Settings / Custom Domains** and add `balajicommunications.in` and `www.balajicommunications.in` if you want both.
2. Render will display the exact DNS records required for your service. Copy those records exactly.
3. In GoDaddy, open **My Products → Domains → balajicommunications.in → DNS** and add/update only the records Render specifies.
4. Remove conflicting web A/CNAME records only if they conflict with the instructions from Render. Do not remove MX/TXT records used for email.
5. Wait for DNS verification and TLS/HTTPS certificate provisioning.

## Local build check
```bash
npm install
npm run build
```

To run locally, create `.env` from `.env.example` and fill in `DATABASE_URL`, `JWT_SECRET`, and `ADMIN_PASSWORD`. Start the API with `npm start` in one terminal and Vite with `npm run dev` in a second terminal. Vite proxies `/api` calls to the API on port 3000.
