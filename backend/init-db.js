const { initDb, api: db } = require('./db');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'pluscheck.db');

(async () => {
  // Delete existing database if it exists (for fresh start during development)
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  await initDb();

  db.exec(`
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  category TEXT,
  seating_notes TEXT,
  seat_types TEXT,
  photo_url TEXT,
  verified INTEGER DEFAULT 0,
  owner_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  business_id INTEGER NOT NULL,
  star_rating INTEGER CHECK(star_rating BETWEEN 1 AND 5),
  seat_type TEXT,
  felt_comfortable INTEGER CHECK(felt_comfortable IN (0, 1, 2)), -- 0=no, 1=yes, 2=unsure
  felt_sturdy INTEGER CHECK(felt_sturdy IN (0, 1, 2)),
  staff_accommodating INTEGER CHECK(staff_accommodating IN (0, 1, 2)),
  tips TEXT,
  body_context TEXT,
  date_visited TEXT,
  photo_url TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE review_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL UNIQUE,
  chair_width_score INTEGER CHECK(chair_width_score BETWEEN 1 AND 5),
  chair_sturdiness_score INTEGER CHECK(chair_sturdiness_score BETWEEN 1 AND 5),
  booth_comfort_score INTEGER CHECK(booth_comfort_score BETWEEN 1 AND 5),
  armrest_friendliness INTEGER CHECK(armrest_friendliness BETWEEN 1 AND 5),
  table_spacing_score INTEGER CHECK(table_spacing_score BETWEEN 1 AND 5),
  movable_seating_score INTEGER CHECK(movable_seating_score BETWEEN 1 AND 5),
  would_go_again_score INTEGER CHECK(would_go_again_score BETWEEN 1 AND 5),
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  business_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  UNIQUE(user_id, business_id)
);

CREATE TABLE helpful_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (review_id) REFERENCES reviews(id),
  UNIQUE(user_id, review_id)
);

CREATE TABLE seating_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER,
  business_id INTEGER,
  user_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  approved INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES reviews(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reported_by_user_id INTEGER NOT NULL,
  review_id INTEGER,
  photo_id INTEGER,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'resolved', 'dismissed')),
  resolved_by_admin_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reported_by_user_id) REFERENCES users(id),
  FOREIGN KEY (review_id) REFERENCES reviews(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id),
  FOREIGN KEY (resolved_by_admin_id) REFERENCES users(id)
);

CREATE TABLE business_claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
  `);

  console.log('Database initialized.');
  db.close();
})();
