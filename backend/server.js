// backend/server.js (CommonJS)
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir)); // serve uploaded images

// Optional admin auth for uploads
const UPLOAD_SECRET = process.env.UPLOAD_SECRET || '';
function requireAdmin(req, res, next) {
  if (!UPLOAD_SECRET) return next();
  const provided = req.header('x-admin-key') || '';
  if (provided && provided === UPLOAD_SECRET) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// JSON fallback storage (when DB is unavailable)
const dataDir = path.join(__dirname, 'data');
const jsonDbPath = path.join(dataDir, 'images.json');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(jsonDbPath)) {
  fs.writeFileSync(jsonDbPath, '[]');
}

function readJsonDb() {
  try {
    return JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
  } catch (e) {
    console.error('Failed reading images.json', e);
    return [];
  }
}

function writeJsonDb(records) {
  try {
    fs.writeFileSync(jsonDbPath, JSON.stringify(records, null, 2));
  } catch (e) {
    console.error('Failed writing images.json', e);
  }
}

// DB connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'goldswain_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safeName);
  }
});
const upload = multer({ storage, limits: { fileSize: 12 * 1024 * 1024 } }); // 12MB limit

// Routes
app.get('/', (req, res) => res.json({ message: 'Goldswain backend is running' }));

// Upload route
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { category, title = '', description = '' } = req.body;
    if (!category) return res.status(400).json({ error: 'Category is required' });

    const imageUrl = `/uploads/${req.file.filename}`;

    const sql = `INSERT INTO images (category, title, description, image_url)
                 VALUES (?, ?, ?, ?)`;
    pool.query(sql, [category, title, description, imageUrl], (err, results) => {
      if (err) {
        console.warn('DB insert failed, falling back to JSON store:', err.message);
        const records = readJsonDb();
        const nextId = (records[records.length - 1]?.id || 0) + 1;
        const created_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const record = { id: nextId, category, title, description, image_url: imageUrl, created_at };
        records.push(record);
        writeJsonDb(records);
        const host = `${req.protocol}://${req.get('host')}`;
        return res.json({ success: true, id: nextId, imageUrl, full_url: host + imageUrl });
      }
      res.json({ success: true, id: results.insertId, imageUrl });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Fetch images by category
app.get('/api/images/:category', (req, res) => {
  const { category } = req.params;
  const sql = `SELECT id, category, title, description, image_url, created_at
               FROM images
               WHERE category = ? ORDER BY created_at DESC`;
  pool.query(sql, [category], (err, rows) => {
    if (err) {
      console.warn('DB select failed, using JSON store:', err.message);
      const all = readJsonDb();
      const filtered = all.filter(r => r.category === category).sort((a, b) => (new Date(b.created_at)) - (new Date(a.created_at)));
      const host = `${req.protocol}://${req.get('host')}`;
      return res.json(filtered.map(r => ({ ...r, full_url: host + r.image_url })));
    }
    const host = `${req.protocol}://${req.get('host')}`;
    const results = rows.map(r => ({ ...r, full_url: host + r.image_url }));
    res.json(results);
  });
});

// Fetch all categories or all images
app.get('/api/images', (req, res) => {
  const sql = `SELECT id, category, title, description, image_url, created_at FROM images ORDER BY created_at DESC`;
  pool.query(sql, (err, rows) => {
    if (err) {
      console.warn('DB select failed, using JSON store:', err.message);
      const all = readJsonDb();
      const host = `${req.protocol}://${req.get('host')}`;
      return res.json(all
        .sort((a, b) => (new Date(b.created_at)) - (new Date(a.created_at)))
        .map(r => ({ ...r, full_url: host + r.image_url }))
      );
    }
    const host = `${req.protocol}://${req.get('host')}`;
    const results = rows.map(r => ({ ...r, full_url: host + r.image_url }));
    res.json(results);
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
