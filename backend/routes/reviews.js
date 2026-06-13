const express = require('express');
const router = express.Router();
const { api: db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', (req, res) => {
  const businessId = req.query.businessId;
  const { sort } = req.query;
  if (!businessId) return res.status(400).json({ error: 'businessId required' });

  let query = `
    SELECT r.*, u.name as user_name, u.avatar as user_avatar, rs.* 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    LEFT JOIN review_scores rs ON r.id = rs.review_id
    WHERE r.business_id = ?
  `;
  
  if (sort === 'highest') {
    query += ' ORDER BY r.star_rating DESC';
  } else if (sort === 'lowest') {
    query += ' ORDER BY r.star_rating ASC';
  } else if (sort === 'helpful') {
    query += ' ORDER BY r.helpful_count DESC';
  } else {
    query += ' ORDER BY r.created_at DESC';
  }

  const reviews = db.prepare(query).all(businessId);
  res.json(reviews);
});

router.post('/', authenticateToken, (req, res) => {
  const { business_id, star_rating, seat_type, felt_comfortable, felt_sturdy, staff_accommodating, tips, body_context, date_visited, scores } = req.body;

  const insertReview = db.transaction(() => {
    const info = db.prepare(`
      INSERT INTO reviews (user_id, business_id, star_rating, seat_type, felt_comfortable, felt_sturdy, staff_accommodating, tips, body_context, date_visited)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, business_id, star_rating, seat_type, felt_comfortable, felt_sturdy, staff_accommodating, tips, body_context, date_visited);

    const reviewId = info.lastInsertRowid;

    if (scores) {
      db.prepare(`
        INSERT INTO review_scores (review_id, chair_width_score, chair_sturdiness_score, booth_comfort_score, armrest_friendliness, table_spacing_score, movable_seating_score, would_go_again_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        reviewId,
        scores.chair_width_score,
        scores.chair_sturdiness_score,
        scores.booth_comfort_score,
        scores.armrest_friendliness,
        scores.table_spacing_score,
        scores.movable_seating_score,
        scores.would_go_again_score
      );
    }

    return reviewId;
  });

  const reviewId = insertReview();
  res.json({ id: reviewId });
});

router.put('/:id', authenticateToken, (req, res) => {
  const review = db.prepare('SELECT user_id FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.user_id !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);

  const { star_rating, tips, body_context } = req.body;
  db.prepare('UPDATE reviews SET star_rating = ?, tips = ?, body_context = ? WHERE id = ?').run(star_rating, tips, body_context, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const review = db.prepare('SELECT user_id FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.user_id !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);

  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.post('/:id/helpful', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.id;

  try {
    db.prepare('INSERT INTO helpful_votes (user_id, review_id) VALUES (?, ?)').run(userId, reviewId);
    db.prepare('UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?').run(reviewId);
    res.json({ success: true });
  } catch (err) {
    db.prepare('DELETE FROM helpful_votes WHERE user_id = ? AND review_id = ?').run(userId, reviewId);
    db.prepare('UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = ?').run(reviewId);
    res.json({ success: true, removed: true });
  }
});

module.exports = router;
