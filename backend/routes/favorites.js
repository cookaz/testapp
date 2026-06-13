const express = require('express');
const router = express.Router();
const { api: db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
  const favorites = db.prepare(`
    SELECT b.* 
    FROM businesses b 
    JOIN favorites f ON b.id = f.business_id 
    WHERE f.user_id = ?
  `).all(req.user.id);
  res.json(favorites);
});

router.post('/:businessId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const businessId = req.params.businessId;

  const favorite = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND business_id = ?').get(userId, businessId);
  if (favorite) {
    db.prepare('DELETE FROM favorites WHERE id = ?').run(favorite.id);
    res.json({ favorited: false });
  } else {
    db.prepare('INSERT INTO favorites (user_id, business_id) VALUES (?, ?)').run(userId, businessId);
    res.json({ favorited: true });
  }
});

module.exports = router;
