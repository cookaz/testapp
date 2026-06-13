const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { api: db } = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', authenticateToken, upload.single('photo'), (req, res) => {
  const { business_id, review_id } = req.body;
  const url = `/uploads/${req.file.filename}`;
  const info = db.prepare('INSERT INTO photos (user_id, business_id, review_id, url) VALUES (?, ?, ?, ?)').run(req.user.id, business_id, review_id, url);
  res.json({ id: info.lastInsertRowid, url });
});

router.get('/pending', authenticateToken, isAdmin, (req, res) => {
  const photos = db.prepare('SELECT * FROM photos WHERE approved = 0').all();
  res.json(photos);
});

router.post('/:id/approve', authenticateToken, isAdmin, (req, res) => {
  db.prepare('UPDATE photos SET approved = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
