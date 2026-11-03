import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const INITIAL_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'ChangeMe-Now-123!');

if (!DATABASE_URL) console.warn('DATABASE_URL is missing. Configure a PostgreSQL database before starting the API.');
if (!JWT_SECRET && isProduction) throw new Error('JWT_SECRET is required in production.');
if (isProduction && (!INITIAL_ADMIN_PASSWORD || INITIAL_ADMIN_PASSWORD.length < 12)) {
  throw new Error('Set ADMIN_PASSWORD to a strong password of at least 12 characters in production.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : (DATABASE_URL && !/localhost|127\.0\.0\.1/.test(DATABASE_URL) ? { rejectUnauthorized: true } : false),
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));
app.use('/api/', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });
const submitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false });

function camel(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customer_name,
    mobile: row.mobile,
    serviceId: row.service_id,
    serviceName: row.service_name,
    isCreditCard: row.is_credit_card,
    contactMethod: row.contact_method,
    ccServiceType: row.cc_service_type,
    bankIssuer: row.bank_issuer,
    safeCallbackOnly: row.safe_callback_only,
    description: row.description,
    amountOrQty: row.amount_or_qty,
    preferredDateTime: row.preferred_datetime,
    uploadedFileName: row.uploaded_filename,
    status: row.status,
    createdAt: new Date(row.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
    adminNote: row.admin_note,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    transactionRef: row.transaction_ref,
    gatewayFeePaid: Number(row.gateway_fee_paid || 0)
  };
}

async function initializeDatabase() {
  if (!DATABASE_URL) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id TEXT PRIMARY KEY,
      customer_name VARCHAR(120) NOT NULL,
      mobile VARCHAR(10) NOT NULL,
      service_id VARCHAR(100) NOT NULL,
      service_name VARCHAR(180) NOT NULL,
      is_credit_card BOOLEAN NOT NULL DEFAULT FALSE,
      contact_method VARCHAR(60) NOT NULL DEFAULT 'Phone Call',
      cc_service_type VARCHAR(120) NOT NULL DEFAULT '',
      bank_issuer VARCHAR(80) NOT NULL DEFAULT '',
      safe_callback_only BOOLEAN NOT NULL DEFAULT FALSE,
      description TEXT NOT NULL DEFAULT '',
      amount_or_qty VARCHAR(120) NOT NULL DEFAULT '',
      preferred_datetime VARCHAR(120) NOT NULL DEFAULT '',
      uploaded_filename VARCHAR(180) NOT NULL DEFAULT '',
      status VARCHAR(40) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      admin_note TEXT NOT NULL DEFAULT '',
      payment_status VARCHAR(120) NOT NULL DEFAULT 'Pending Payment',
      payment_method VARCHAR(120) NOT NULL DEFAULT 'Unselected',
      transaction_ref VARCHAR(160) NOT NULL DEFAULT 'N/A',
      gateway_fee_paid NUMERIC(10,2) NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS service_requests_mobile_created_idx ON service_requests (mobile, created_at DESC);
    CREATE TABLE IF NOT EXISTS app_settings (
      key VARCHAR(80) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  const existing = await pool.query("SELECT value FROM app_settings WHERE key = 'admin_password_hash'");
  if (existing.rowCount === 0) {
    const hash = await bcrypt.hash(INITIAL_ADMIN_PASSWORD, 12);
    await pool.query("INSERT INTO app_settings (key, value) VALUES ('admin_password_hash', $1)", [hash]);
  }
}

function requireDatabase(req, res, next) {
  if (!DATABASE_URL) return res.status(503).json({ error: 'Website database is not configured yet. Please contact the shop.' });
  next();
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Admin login required.' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET || 'local-development-only-secret-change-this');
    next();
  } catch {
    return res.status(401).json({ error: 'Admin session expired. Please sign in again.' });
  }
}

app.get('/api/health', requireDatabase, async (req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, database: 'connected' }); }
  catch { res.status(503).json({ ok: false, error: 'Database connection failed.' }); }
});

app.post('/api/requests', submitLimiter, requireDatabase, async (req, res) => {
  try {
    const b = req.body || {};
    const customerName = String(b.customerName || '').trim().slice(0, 120);
    const mobile = String(b.mobile || '').replace(/\D/g, '');
    const serviceId = String(b.serviceId || '').trim().slice(0, 100);
    const serviceName = String(b.serviceName || '').trim().slice(0, 180);
    const description = String(b.description || '').trim().slice(0, 1500);
    const amountOrQty = String(b.amountOrQty || '').trim().slice(0, 120);
    if (customerName.length < 2) return res.status(400).json({ error: 'Please enter your full name.' });
    if (!/^\d{10}$/.test(mobile)) return res.status(400).json({ error: 'Enter a valid 10-digit mobile number.' });
    if (!serviceId || !serviceName) return res.status(400).json({ error: 'Please select a service.' });
    if (/\d{12,19}/.test(description.replace(/[ -]/g, ''))) return res.status(400).json({ error: 'Do not submit card numbers or other sensitive financial identifiers in notes.' });

    const id = `BSC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}${crypto.randomInt(10, 99)}`;
    const isCreditCard = Boolean(b.isCreditCard);
    const paymentMethod = String(b.paymentMethod || 'Pay at Shop Counter').slice(0, 120);
    const isPayAtCounter = paymentMethod.toLowerCase().includes('pay at shop') || String(b.transactionRef || '') === 'PAY-AT-SHOP';
    const safePaymentStatus = isCreditCard ? 'Payment arranged through official desk; not paid online' : (isPayAtCounter ? 'Pay at Counter - Not Yet Paid' : 'Pending Payment Verification');
    const safeAdminNote = isPayAtCounter ? 'Customer plans to pay at the shop counter. Payment is not yet recorded as received.' : 'Request received. Any payment reference must be independently verified by the shop.';
    const row = await pool.query(`
      INSERT INTO service_requests (
        id, customer_name, mobile, service_id, service_name, is_credit_card, contact_method,
        cc_service_type, bank_issuer, safe_callback_only, description, amount_or_qty,
        preferred_datetime, uploaded_filename, status, admin_note, payment_status,
        payment_method, transaction_ref, gateway_fee_paid
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'Pending',$15,$16,$17,$18,0)
      RETURNING *`, [
      id, customerName, mobile, serviceId, serviceName, isCreditCard,
      String(b.contactMethod || 'Phone Call').slice(0, 60), String(b.ccServiceType || '').slice(0, 120),
      // Do not persist card numbers, CVV, PIN, OTP, account numbers, or card last-four digits.
      String(b.isCreditCard ? '' : (b.bankIssuer || '')).slice(0, 80), Boolean(b.safeCallbackOnly), description,
      amountOrQty, String(b.preferredDateTime || '').slice(0, 120), String(b.uploadedFileName || '').slice(0, 180),
      safeAdminNote,
      safePaymentStatus,
      String(b.paymentMethod || 'Unselected').slice(0, 120),
      String(b.transactionRef || 'N/A').slice(0, 160)
    ]);
    res.status(201).json({ request: camel(row.rows[0]) });
  } catch (error) {
    console.error('Create request failed:', error.message);
    res.status(500).json({ error: 'Could not save your request right now. Please try again.' });
  }
});

app.get('/api/requests/track', publicLimiter, requireDatabase, async (req, res) => {
  const id = String(req.query.id || '').trim().toUpperCase().slice(0, 40);
  const mobile = String(req.query.mobile || '').replace(/\D/g, '');
  if (!id || !/^\d{10}$/.test(mobile)) return res.status(400).json({ error: 'Enter the request ID and registered mobile number.' });
  try {
    const result = await pool.query('SELECT * FROM service_requests WHERE id = $1 AND mobile = $2 LIMIT 1', [id, mobile]);
    if (!result.rowCount) return res.status(404).json({ error: 'No request matches both details. Please check and try again.' });
    const r = camel(result.rows[0]);
    // Return only customer-safe tracking fields.
    res.json({ request: { id: r.id, customerName: r.customerName, serviceName: r.serviceName, amountOrQty: r.amountOrQty, status: r.status, createdAt: r.createdAt, preferredDateTime: r.preferredDateTime, paymentStatus: r.paymentStatus, adminNote: r.adminNote } });
  } catch (error) {
    console.error('Tracking failed:', error.message);
    res.status(500).json({ error: 'Could not check request status right now.' });
  }
});

app.post('/api/admin/login', publicLimiter, requireDatabase, async (req, res) => {
  const password = String(req.body?.password || '');
  if (!password || password.length > 200) return res.status(400).json({ error: 'Enter your admin password.' });
  try {
    const result = await pool.query("SELECT value FROM app_settings WHERE key = 'admin_password_hash'");
    if (!result.rowCount || !(await bcrypt.compare(password, result.rows[0].value))) {
      return res.status(401).json({ error: 'Incorrect admin password.' });
    }
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET || 'local-development-only-secret-change-this', { expiresIn: '12h' });
    res.json({ token });
  } catch (error) {
    console.error('Admin login failed:', error.message);
    res.status(500).json({ error: 'Could not sign in right now.' });
  }
});

app.get('/api/admin/requests', requireDatabase, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM service_requests ORDER BY created_at DESC LIMIT 1000');
    res.json({ requests: result.rows.map(camel) });
  } catch (error) {
    console.error('Load requests failed:', error.message);
    res.status(500).json({ error: 'Could not load requests.' });
  }
});

app.patch('/api/admin/requests/:id', requireDatabase, requireAdmin, async (req, res) => {
  const status = String(req.body?.status || '');
  const allowed = ['Pending', 'In Progress', 'Ready / Completed'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid request status.' });
  try {
    const result = await pool.query('UPDATE service_requests SET status = $1 WHERE id = $2 RETURNING *', [status, String(req.params.id).slice(0, 40)]);
    if (!result.rowCount) return res.status(404).json({ error: 'Request not found.' });
    res.json({ request: camel(result.rows[0]) });
  } catch (error) {
    console.error('Update status failed:', error.message);
    res.status(500).json({ error: 'Could not update request status.' });
  }
});

app.post('/api/admin/password', requireDatabase, requireAdmin, async (req, res) => {
  const newPassword = String(req.body?.newPassword || '');
  if (newPassword.length < 12 || newPassword.length > 200) return res.status(400).json({ error: 'Use a password between 12 and 200 characters.' });
  try {
    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query("UPDATE app_settings SET value = $1, updated_at = NOW() WHERE key = 'admin_password_hash'", [hash]);
    res.json({ ok: true });
  } catch (error) {
    console.error('Password update failed:', error.message);
    res.status(500).json({ error: 'Could not update the admin password.' });
  }
});

// Serve the built React app from the same domain as the API.
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, { index: false, maxAge: isProduction ? '1h' : 0 }));
app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => { if (err) next(err); });
});

await initializeDatabase();
app.listen(PORT, () => console.log(`Balaji Stationery website server listening on port ${PORT}`));
