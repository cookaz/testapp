const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/reports', authenticateToken, isAdmin, (req, res) => {
  const reports = db.prepare('SELECT * FROM reports WHERE status = "pending"').all();
  res.json(reports);
});

router.post('/reports/:id/resolve', authenticateToken, isAdmin, (req, res) => {
  const { status } = req.body; // resolved or dismissed
  db.prepare('UPDATE reports SET status = ?, resolved_by_admin_id = ? WHERE id = ?').run(status, req.user.id, req.params.id);
  res.json({ success: true });
});

router.get('/reported-content', authenticateToken, isAdmin, (req, res) => {
    const reviews = db.prepare('SELECT r.* FROM reviews r JOIN reports rep ON r.id = rep.review_id WHERE rep.status = "pending"').all();
    const photos = db.prepare('SELECT p.* FROM photos p JOIN reports rep ON p.id = rep.photo_id WHERE rep.status = "pending"').all();
    res.json({ reviews, photos });
});

router.get('/pending-businesses', authenticateToken, isAdmin, (req, res) => {
  const businesses = db.prepare('SELECT * FROM businesses WHERE verified = 0').all();
  res.json(businesses);
});

module.exports = router;
