const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Helper to calculate Plus Check Score
const calculatePlusCheckScore = (reviewScores) => {
  if (!reviewScores || reviewScores.length === 0) return null;

  let totalWeight = 0;
  let weightedSum = 0;

  const weights = {
    chair_width_score: 0.20,
    chair_sturdiness_score: 0.15,
    booth_comfort_score: 0.20,
    armrest_friendliness: 0.15,
    table_spacing_score: 0.10,
    movable_seating_score: 0.10,
    would_go_again_score: 0.10
  };

  const averages = {};
  Object.keys(weights).forEach(key => {
    const scores = reviewScores.map(rs => rs[key]).filter(s => s !== null && s !== undefined);
    if (scores.length > 0) {
      averages[key] = scores.reduce((a, b) => a + b, 0) / scores.length;
      weightedSum += averages[key] * weights[key];
      totalWeight += weights[key];
    }
  });

  if (totalWeight === 0) return null;
  return {
    overall: (weightedSum / totalWeight).toFixed(1),
    averages
  };
};

router.get('/', (req, res) => {
  const { q, city, state, category } = req.query;
  let query = 'SELECT b.*, (SELECT COUNT(*) FROM reviews WHERE business_id = b.id) as review_count FROM businesses b WHERE 1=1';
  const params = [];

  if (q) {
    query += ' AND (b.name LIKE ? OR b.seating_notes LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (city) {
    query += ' AND b.city = ?';
    params.push(city);
  }
  if (state) {
    query += ' AND b.state = ?';
    params.push(state);
  }
  if (category) {
    query += ' AND b.category = ?';
    params.push(category);
  }

  const businesses = db.prepare(query).all(...params);
  
  const businessesWithScores = businesses.map(b => {
    const scores = db.prepare('SELECT rs.* FROM review_scores rs JOIN reviews r ON rs.review_id = r.id WHERE r.business_id = ?').all(b.id);
    const scoreData = calculatePlusCheckScore(scores);
    return {
      ...b,
      plus_check_score: b.review_count >= 3 ? scoreData?.overall : null,
      individual_scores: scoreData?.averages
    };
  });

  res.json(businessesWithScores);
});

router.get('/:id', (req, res) => {
  const business = db.prepare('SELECT b.*, (SELECT COUNT(*) FROM reviews WHERE business_id = b.id) as review_count FROM businesses b WHERE id = ?').get(req.params.id);
  if (!business) return res.status(404).json({ error: 'Business not found' });

  const scores = db.prepare('SELECT rs.* FROM review_scores rs JOIN reviews r ON rs.review_id = r.id WHERE r.business_id = ?').all(business.id);
  const scoreData = calculatePlusCheckScore(scores);
  
  business.plus_check_score = business.review_count >= 3 ? scoreData?.overall : null;
  business.individual_scores = scoreData?.averages;

  res.json(business);
});

router.get('/:id/tags', (req, res) => {
  const tags = db.prepare('SELECT tag FROM seating_tags WHERE business_id = ?').all(req.params.id);
  res.json(tags.map(t => t.tag));
});

router.post('/', authenticateToken, (req, res) => {
  const { name, address, city, state, zip, category, seating_notes, seat_types } = req.body;
  const info = db.prepare(`
    INSERT INTO businesses (name, address, city, state, zip, category, seating_notes, seat_types)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, address, city, state, zip, category, seating_notes, seat_types);
  res.json({ id: info.lastInsertRowid });
});

module.exports = router;
