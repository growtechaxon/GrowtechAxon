const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Lead = require('./MODELS/Lead');
const Team = require('./MODELS/Team');
const OfferSetting = require('./MODELS/OfferSetting');
const Product = require('./MODELS/Product');
const app = express();
const PORT = Number(process.env.PORT || 5000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || '';
const UPLOAD_ROOT = path.join(__dirname, 'uploads');
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID);
const CLOUDINARY_CONFIGURED = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use('/uploads', express.static(UPLOAD_ROOT, { fallthrough: false, maxAge: '7d', immutable: true }));
app.use(cors({
  origin: FRONTEND_ORIGIN.split(',').map((value) => value.trim()).filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

const buckets = new Map();
function rateLimit({ windowMs = 60000, max = 60, keyFn = (req) => req.ip } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = keyFn(req);
    let bucket = buckets.get(key);
    if (!bucket || now - bucket.start >= windowMs) {
      bucket = { start: now, count: 0 };
      buckets.set(key, bucket);
    }
    if (++bucket.count > max) {
      res.setHeader('Retry-After', Math.ceil((bucket.start + windowMs - now) / 1000));
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }
    return next();
  };
}
app.use('/api', rateLimit({ max: 120 }));
const loginLimiter = rateLimit({ windowMs: 600000, max: 8, keyFn: (req) => `login:${req.ip}` });
const leadLimiter = rateLimit({ windowMs: 600000, max: 12, keyFn: (req) => `lead:${req.ip}` });

if (CLOUDINARY_CONFIGURED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      return callback(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.'));
    }
    return callback(null, true);
  }
});

const PLAN_CONFIG = {
  starter: { name: 'Starter Website', price: 0, service: 'Website Development', budget: '₹0' },
  business: { name: 'Business Website', price: 4999, service: 'Business Website Development', budget: '₹4,999' },
  software: { name: 'Software / App', price: 9999, service: 'Software / App Development', budget: '₹9,999' }
};
const text = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
const validUrl = (value) => {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};
const validId = (value) => mongoose.isValidObjectId(value);

function auth(req, res, next) {
  const header = req.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized access.' });
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET, {
      issuer: 'growtechaxon-api',
      audience: 'growtechaxon-admin'
    });
    if (decoded.role !== 'admin') throw new Error('Invalid role');
    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

function hasValidImageSignature(file) {
  if (!file || !Buffer.isBuffer(file.buffer) || file.buffer.length < 12) return false;
  const b = file.buffer;
  const isJpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const isPng = b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP';
  return (file.mimetype === 'image/jpeg' && isJpeg) || (file.mimetype === 'image/png' && isPng) || (file.mimetype === 'image/webp' && isWebp);
}

function parseImage(folder) {
  return [upload.single(folder === 'team' ? 'photo' : 'image'), (req, res, next) => {
    if (req.file && !hasValidImageSignature(req.file)) {
      return res.status(400).json({ success: false, message: 'The selected file is not a valid JPG, PNG, or WEBP image.' });
    }
    return next();
  }];
}

function uploadCloud(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: `growtechaxon/${folder}`,
      resource_type: 'image',
      unique_filename: true,
      overwrite: false
    }, (error, result) => {
      if (error) return reject(error);
      if (!result || !result.secure_url) return reject(new Error('Image storage did not return a secure URL.'));
      return resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}

async function storeImage(file, folder, req) {
  if (!file) return '';
  if (CLOUDINARY_CONFIGURED) return uploadCloud(file.buffer, folder);
  if (IS_PRODUCTION) {
    const error = new Error('Cloud image storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the hosting environment.');
    error.status = 503;
    throw error;
  }
  // Local fallback is for local development only; Render's ephemeral filesystem is never used as production storage.
  const safeFolder = folder === 'team' ? 'team' : 'projects';
  const directory = path.join(UPLOAD_ROOT, safeFolder);
  fs.mkdirSync(directory, { recursive: true });
  const extension = file.mimetype === 'image/jpeg' ? '.jpg' : file.mimetype === 'image/png' ? '.png' : '.webp';
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`;
  fs.writeFileSync(path.join(directory, filename), file.buffer, { flag: 'wx' });
  const forwardedProto = String(req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim();
  const protocol = forwardedProto || (req?.secure ? 'https' : 'http');
  const host = String(process.env.PUBLIC_API_URL || `${protocol}://${req?.get('host') || `localhost:${PORT}`}`).replace(/\/$/, '');
  return `${host}/uploads/${safeFolder}/${filename}`;
}

function handleError(res, label, error, fallback = 'Request could not be completed.') {
  console.error(`[${label}]`, error && (error.stack || error.message || error));
  const status = Number(error && error.status) || 500;
  return res.status(status).json({ success: false, message: status === 500 ? fallback : (error.message || fallback) });
}

app.get('/', (_req, res) => res.json({ success: true, service: 'GrowtechAxon API', status: 'running', api: '/api', health: '/api/health' }));
app.get('/api', (_req, res) => res.json({ success: true, service: 'GrowtechAxon API', status: 'running', health: '/api/health', message: 'API server is running. Use /api/* routes.' }));
app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok', service: 'GrowtechAxon API', time: new Date().toISOString(), database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.get('/api/test', (_req, res) => res.json({ success: true, message: 'GrowtechAxon API is working.' }));

async function getOfferSettings() {
  let settings = await OfferSetting.findOne({ key: 'public-offer' });
  if (!settings) settings = await OfferSetting.create({ key: 'public-offer' });
  return settings;
}
app.get('/api/offer-settings', async (_req, res) => {
  try {
    const settings = await getOfferSettings();
    res.set('Cache-Control', 'no-store');
    return res.json({ success: true, offer: {
      enabled: settings.enabled, title: settings.title, description: settings.description,
      durationDays: settings.durationDays, maxClients: settings.maxClients, terms: settings.terms
    } });
  } catch (error) {
    return handleError(res, 'offer-settings-read', error, 'Offer settings temporarily unavailable.');
  }
});
app.put('/api/admin/offer-settings', auth, async (req, res) => {
  try {
    const data = {
      enabled: req.body.enabled === true || String(req.body.enabled) === 'true',
      title: text(req.body.title, 120) || 'Get Your Website for Free!',
      description: text(req.body.description, 500),
      durationDays: Math.max(1, Math.min(365, Number(req.body.durationDays) || 30)),
      maxClients: Math.max(1, Math.min(10000, Number(req.body.maxClients) || 10)),
      terms: text(req.body.terms, 5000)
    };
    const settings = await OfferSetting.findOneAndUpdate({ key: 'public-offer' }, {
      $set: data, $setOnInsert: { key: 'public-offer' }
    }, { new: true, upsert: true, runValidators: true });
    return res.json({ success: true, message: 'Offer settings saved.', offer: settings });
  } catch (error) {
    return handleError(res, 'offer-settings-write', error, 'Unable to save offer settings.');
  }
});

app.post('/api/admin/login', loginLimiter, async (req, res) => {
  try {
    const username = text(req.body.username, 80);
    const password = String(req.body.password || '');
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required.' });
    const expectedUsername = String(process.env.ADMIN_USERNAME || '');
    const passwordHash = String(process.env.ADMIN_PASSWORD_HASH || '');
    const plainPassword = String(process.env.ADMIN_PASSWORD || '');
    if (JWT_SECRET.length < 32 || !expectedUsername || (!passwordHash && !plainPassword)) {
      return res.status(503).json({ success: false, message: 'Authentication is not configured securely.' });
    }
    const usernameMatches = username === expectedUsername;
    const passwordMatches = passwordHash ? await bcrypt.compare(password, passwordHash) : password === plainPassword;
    if (!usernameMatches || !passwordMatches) return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '2h', issuer: 'growtechaxon-api', audience: 'growtechaxon-admin' });
    return res.json({ success: true, message: 'Login successful.', token });
  } catch (error) {
    return handleError(res, 'admin-login', error, 'Login server error.');
  }
});

app.post('/api/leads', leadLimiter, async (req, res) => {
  try {
    const planId = text(req.body.planId, 40);
    if (planId && !Object.prototype.hasOwnProperty.call(PLAN_CONFIG, planId)) return res.status(400).json({ success: false, message: 'Invalid pricing plan selected.' });
    const plan = planId ? PLAN_CONFIG[planId] : null;
    const data = {
      name: text(req.body.name, 80), business: text(req.body.business, 120),
      email: text(req.body.email, 120).toLowerCase(), phone: text(req.body.phone, 20),
      city: text(req.body.city, 80), service: plan ? plan.service : text(req.body.service, 100),
      budget: plan ? plan.budget : text(req.body.budget, 80), message: text(req.body.message, 3000)
    };
    if (plan) Object.assign(data, { planId, planName: plan.name, planPrice: plan.price });
    if (!data.name || !validEmail(data.email) || !data.phone || !data.message) return res.status(400).json({ success: false, message: 'Name, valid email, phone and message are required.' });
    if (!/^[+\d\s().-]{7,20}$/.test(data.phone)) return res.status(400).json({ success: false, message: 'Please provide a valid phone number.' });
    const lead = await Lead.create(data);
    return res.status(201).json({ success: true, message: 'Enquiry received successfully.', lead: { id: lead._id, planId: lead.planId, planName: lead.planName, planPrice: lead.planPrice } });
  } catch (error) {
    return handleError(res, 'lead-create', error, 'Unable to save enquiry right now.');
  }
});
app.get('/api/leads', auth, async (_req, res) => {
  try { return res.json({ success: true, leads: await Lead.find().sort({ createdAt: -1 }).lean() }); }
  catch (error) { return handleError(res, 'leads-read', error, 'Unable to load leads.'); }
});
app.put('/api/leads/:id/status', auth, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid lead id.' });
    const status = text(req.body.status, 20);
    if (!['New', 'Contacted', 'Converted', 'Closed'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid lead status.' });
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    return res.json({ success: true, lead });
  } catch (error) { return handleError(res, 'lead-update', error, 'Unable to update lead.'); }
});
app.delete('/api/leads/:id', auth, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid lead id.' });
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    return res.json({ success: true, message: 'Lead deleted.' });
  } catch (error) { return handleError(res, 'lead-delete', error, 'Unable to delete lead.'); }
});

app.get('/api/team', async (_req, res) => {
  try {
    const team = await Team.find({ $or: [{ active: true }, { active: { $exists: false } }] }).sort({ isFounder: -1, displayOrder: 1, createdAt: 1 }).lean();
    res.set('Cache-Control', 'no-store');
    return res.json({ success: true, team });
  } catch (error) { return handleError(res, 'team-read-public', error, 'Unable to load team.'); }
});
app.get('/api/admin/team', auth, async (_req, res) => {
  try { return res.json({ success: true, team: await Team.find().sort({ isFounder: -1, displayOrder: 1, createdAt: 1 }).lean() }); }
  catch (error) { return handleError(res, 'team-read-admin', error, 'Unable to load team.'); }
});
app.post('/api/admin/team', auth, ...parseImage('team'), async (req, res) => {
  try {
    const name = text(req.body.name, 100);
    const designation = text(req.body.designation, 120);
    if (!name || !designation) return res.status(400).json({ success: false, message: 'Name and designation are required.' });
    const isFounder = String(req.body.isFounder) === 'true';
    const data = {
      name, designation, description: text(req.body.description, 1000),
      linkedin: validUrl(text(req.body.linkedin, 2048)), instagram: validUrl(text(req.body.instagram, 2048)),
      github: validUrl(text(req.body.github, 2048)), isFounder,
      displayOrder: Math.max(0, Number(req.body.displayOrder) || 0), active: String(req.body.active) !== 'false'
    };
    if (req.file) data.photo = await storeImage(req.file, 'team', req);
    if (isFounder) await Team.updateMany({}, { $set: { isFounder: false } });
    const team = await Team.create(data);
    return res.status(201).json({ success: true, message: 'Team member added successfully.', team });
  } catch (error) { return handleError(res, 'team-create', error, 'Unable to add team member.'); }
});
app.put('/api/admin/team/:id', auth, ...parseImage('team'), async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid team id.' });
    const old = await Team.findById(req.params.id);
    if (!old) return res.status(404).json({ success: false, message: 'Team member not found.' });
    const name = text(req.body.name, 100) || old.name;
    const designation = text(req.body.designation, 120) || old.designation;
    if (!name || !designation) return res.status(400).json({ success: false, message: 'Name and designation are required.' });
    const data = {
      name, designation,
      description: req.body.description === undefined ? old.description : text(req.body.description, 1000),
      linkedin: req.body.linkedin === undefined ? old.linkedin : validUrl(text(req.body.linkedin, 2048)),
      instagram: req.body.instagram === undefined ? old.instagram : validUrl(text(req.body.instagram, 2048)),
      github: req.body.github === undefined ? old.github : validUrl(text(req.body.github, 2048)),
      isFounder: req.body.isFounder === undefined ? old.isFounder : String(req.body.isFounder) === 'true',
      displayOrder: req.body.displayOrder === undefined ? old.displayOrder : Math.max(0, Number(req.body.displayOrder) || 0),
      active: req.body.active === undefined ? old.active : String(req.body.active) !== 'false',
      photo: old.photo || ''
    };
    if (req.file) data.photo = await storeImage(req.file, 'team', req);
    if (data.isFounder) await Team.updateMany({ _id: { $ne: req.params.id } }, { $set: { isFounder: false } });
    const team = await Team.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    return res.json({ success: true, message: 'Team member updated successfully.', team });
  } catch (error) { return handleError(res, 'team-update', error, 'Unable to update team member.'); }
});
app.delete('/api/admin/team/:id', auth, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid team id.' });
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team member not found.' });
    return res.json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error) { return handleError(res, 'team-delete', error, 'Unable to delete team member.'); }
});

// Project portfolio records are stored in the existing Product collection/model for compatibility.
app.get('/api/products', async (_req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    res.set('Cache-Control', 'no-store');
    return res.json({ success: true, products });
  } catch (error) { return handleError(res, 'products-read-public', error, 'Products are temporarily unavailable.'); }
});
app.get('/api/admin/products', auth, async (_req, res) => {
  try { return res.json({ success: true, products: await Product.find().sort({ displayOrder: 1, createdAt: -1 }).lean() }); }
  catch (error) { return handleError(res, 'products-read-admin', error, 'Unable to load products.'); }
});
function productData(body, existingImage = '') {
  const name = text(body.name, 120);
  const url = validUrl(text(body.url, 2048));
  if (!name || !url) { const error = new Error('Project name and a valid http(s) website URL are required.'); error.status = 400; throw error; }
  const suppliedImage = text(body.image, 2048);
  if (suppliedImage && !validUrl(suppliedImage)) { const error = new Error('Project image URL must use http(s).'); error.status = 400; throw error; }
  return {
    name, description: text(body.description, 1200), url,
    image: suppliedImage ? validUrl(suppliedImage) : existingImage,
    category: text(body.category, 80) || 'Website',
    displayOrder: Math.max(0, Number(body.displayOrder) || 0),
    active: body.active !== false && String(body.active) !== 'false'
  };
}
app.post('/api/admin/products', auth, ...parseImage('projects'), async (req, res) => {
  try {
    const data = productData(req.body);
    if (req.file) data.image = await storeImage(req.file, 'projects', req);
    const product = await Product.create(data);
    return res.status(201).json({ success: true, message: 'Project added successfully.', product });
  } catch (error) { return handleError(res, 'project-create', error, 'Unable to add project.'); }
});
app.put('/api/admin/products/:id', auth, ...parseImage('projects'), async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid project id.' });
    const old = await Product.findById(req.params.id);
    if (!old) return res.status(404).json({ success: false, message: 'Project not found.' });
    const data = productData(req.body, old.image || '');
    if (req.file) data.image = await storeImage(req.file, 'projects', req);
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    return res.json({ success: true, message: 'Project updated successfully.', product });
  } catch (error) { return handleError(res, 'project-update', error, 'Unable to update project.'); }
});
app.delete('/api/admin/products/:id', auth, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid project id.' });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) { return handleError(res, 'project-delete', error, 'Unable to delete project.'); }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE' ? 'Image size must be 5 MB or less.' : error.code === 'LIMIT_FILE_COUNT' ? 'Upload one image at a time.' : error.message;
    return res.status(400).json({ success: false, message });
  }
  if (error && /Only JPG|valid JPG|image/i.test(error.message || '')) {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error('[api-error]', error && (error.stack || error.message || error));
  return res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
});
app.use('/api', (_req, res) => res.status(404).json({ success: false, message: 'API route not found.' }));

(async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
      console.log('✓ MongoDB connected');
    } catch (error) {
      console.error('✗ MongoDB connection failed:', error.message);
    }
  } else {
    console.warn('! MONGODB_URI is not configured. Database-backed endpoints will not work.');
  }
  app.listen(PORT, () => console.log(`GrowtechAxon API running on http://localhost:${PORT}`));
})();
