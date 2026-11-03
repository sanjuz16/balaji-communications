import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const { Pool } = pg;
const required = ['DATABASE_URL', 'ADMIN_PASSWORD', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (process.env.ADMIN_PASSWORD.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters long.');
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});
const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '30kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false }));

const schema = `
CREATE TABLE IF NOT EXISTS admin_users (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS customer_requests (
  id TEXT PRIMARY KEY,
  mobile TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS customer_requests_created_at_idx ON customer_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS customer_requests_mobile_idx ON customer_requests (mobile);
`;
async function initializeDatabase() {
  await pool.query(schema);
  const existing = await pool.query('SELECT id FROM admin_users WHERE id = 1');
  if (!existing.rowCount) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await pool.query('INSERT INTO admin_users (id, password_hash) VALUES (1, $1)', [hash]);
  }
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    if (!token) throw new Error('Missing token');
    req.admin = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'balaji-communications' });
    next();
  } catch {
    res.status(401).json({ error: 'Admin session expired. Please log in again.' });
  }
}

function cleanRequest(input) {
  const allowed = [
    'customerName', 'mobile', 'serviceId', 'serviceName', 'isCreditCard', 'contactMethod',
    'ccServiceType', 'bankIssuer', 'lastFourDigits', 'safeCallbackOnly', 'description',
    'amountOrQty', 'preferredDateTime', 'uploadedFileName', 'status', 'createdAt', 'adminNote',
    'paymentStatus', 'paymentMethod', 'transactionRef', 'gatewayFeePaid'
  ];
  const output = {};
  for (const key of allowed) if (input[key] !== undefined) output[key] = input[key];
  if (!String(output.customerName || '').trim()) throw new Error('Customer name is required.');
  if (!/^\d{10}$/.test(String(output.mobile || ''))) throw new Error('A valid 10-digit mobile number is required.');
  if (!String(output.serviceName || '').trim()) throw new Error('Service name is required.');
  const text = JSON.stringify(output);
  if (text.length > 20000) throw new Error('Request is too large.');
  // Never accept or persist full card numbers, CVVs, PINs, OTPs, or bank passwords.
  if (/\b(?:\d[ -]*?){13,19}\b/.test(text) || /\b(?:cvv|cvc|otp|pin|password)\s*[:=]/i.test(text)) {
    throw new Error('Sensitive payment credentials or full card numbers must not be submitted.');
  }
  return output;
}

app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, database: 'connected' }); }
  catch { res.status(503).json({ ok: false, database: 'unavailable' }); }
});

app.post('/api/admin/login', async (req, res) => {
  const password = String(req.body?.password || '');
  const result = await pool.query('SELECT password_hash FROM admin_users WHERE id = 1');
  const valid = result.rowCount && await bcrypt.compare(password, result.rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: 'Incorrect admin password.' });
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h', issuer: 'balaji-communications' });
  res.json({ token, expiresIn: 28800 });
});

app.post('/api/admin/password', requireAdmin, async (req, res) => {
  const password = String(req.body?.newPassword || '');
  if (password.length < 12) return res.status(400).json({ error: 'New password must contain at least 12 characters.' });
  const hash = await bcrypt.hash(password, 12);
  await pool.query('UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = 1', [hash]);
  res.json({ ok: true });
});

app.post('/api/requests', async (req, res) => {
  try {
    const payload = cleanRequest(req.body || {});
    const id = `BSC-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
    payload.id = id;
    const result = await pool.query(
      'INSERT INTO customer_requests (id, mobile, status, payload) VALUES ($1, $2, $3, $4) RETURNING payload',
      [id, payload.mobile, payload.status || 'Pending', payload]
    );
    res.status(201).json({ request: result.rows[0].payload });
  } catch (error) { res.status(400).json({ error: error.message || 'Could not save request.' }); }
});

app.get('/api/requests', requireAdmin, async (_req, res) => {
  const result = await pool.query('SELECT payload FROM customer_requests ORDER BY created_at DESC LIMIT 500');
  res.json({ requests: result.rows.map((row) => row.payload) });
});

app.get('/api/track/:id', async (req, res) => {
  const id = String(req.params.id || '').toUpperCase();
  if (!/^BSC-\d{4}-[A-F0-9]{6}$/.test(id)) return res.status(404).json({ error: 'Request not found.' });
  const result = await pool.query('SELECT payload FROM customer_requests WHERE id = $1', [id]);
  if (!result.rowCount) return res.status(404).json({ error: 'Request not found.' });
  const request = result.rows[0].payload;
  // Public tracking deliberately returns status and service only, not personal details.
  res.json({ request: { id: request.id, serviceName: request.serviceName, status: request.status, createdAt: request.createdAt, preferredDateTime: request.preferredDateTime } });
});

app.patch('/api/requests/:id/status', requireAdmin, async (req, res) => {
  const status = String(req.body?.status || '');
  const allowed = ['Pending', 'In Progress', 'Completed', 'Rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid request status.' });
  const result = await pool.query(
    `UPDATE customer_requests SET status = $2, payload = jsonb_set(payload, '{status}', to_jsonb($2::text)), updated_at = NOW() WHERE id = $1 RETURNING payload`,
    [req.params.id, status]
  );
  if (!result.rowCount) return res.status(404).json({ error: 'Request not found.' });
  res.json({ request: result.rows[0].payload });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');
app.use(express.static(dist));
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = Number(process.env.PORT || 10000);
initializeDatabase().then(() => app.listen(port, '0.0.0.0', () => console.log(`Balaji Communications server listening on ${port}`)))
  .catch((error) => { console.error('Database initialization failed:', error.message); process.exit(1); });
