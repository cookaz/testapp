const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'pluscheck.db');
const db = new Database(dbPath);

const businesses = [
  { name: "Applebee's", city: 'Austin', state: 'TX', category: 'Restaurant', address: '123 Main St', zip: '78701', seating_notes: 'Booths are tight, chairs have arms, tables close together', seat_types: 'booths, chairs with arms', tags: ['Booths are tight', 'Chairs have arms'] },
  { name: 'AMC Barton Creek', city: 'Austin', state: 'TX', category: 'Movie Theater', address: '2901 Capital of Texas Hwy', zip: '78746', seating_notes: 'Seats are wide and sturdy, cup holders are tight', seat_types: 'theater seats', tags: ['Seats are wide', 'Sturdy chairs'] },
  { name: 'The Curl Studio', city: 'Austin', state: 'TX', category: 'Salon', address: '456 Oak Ln', zip: '78704', seating_notes: 'Salon chairs are wide, staff is accommodating', seat_types: 'salon chairs', tags: ['Salon chairs are wide', 'Staff is accommodating'] },
  { name: 'Austin Family Medicine', city: 'Austin', state: 'TX', category: 'Medical Office', address: '789 Health Blvd', zip: '78705', seating_notes: 'Waiting room chairs are armless, comfortable', seat_types: 'armless chairs', tags: ['Armless chairs', 'Comfortable'] },
  { name: 'Marriott Downtown', city: 'Austin', state: 'TX', category: 'Hotel', address: '304 E Cesar Chavez St', zip: '78701', seating_notes: 'Lobby seating is spacious, bar stools are tight', seat_types: 'lobby chairs, bar stools', tags: ['Spacious lobby', 'Bar stools are tight'] },
  { name: 'Blue Velvet Café', city: 'Austin', state: 'TX', category: 'Café', address: '101 Coffee Way', zip: '78702', seating_notes: 'Outdoor seating is best, chairs feel sturdy', seat_types: 'outdoor chairs, café chairs', tags: ['Outdoor seating', 'Sturdy chairs'] },
  { name: 'Southside Bar & Grill', city: 'Austin', state: 'TX', category: 'Bar', address: '202 South St', zip: '78704', seating_notes: 'Bar stools not plus-size friendly, booths are comfortable', seat_types: 'bar stools, booths', tags: ['Booths are comfortable', 'Bar stools not plus-size friendly'] },
  { name: 'Lakeview Event Venue', city: 'Austin', state: 'TX', category: 'Event Venue', address: '303 Lakeview Dr', zip: '78732', seating_notes: 'Movable seating, tables are spacious', seat_types: 'movable chairs', tags: ['Movable seating', 'Spacious tables'] },
  { name: 'First Community Church', city: 'Austin', state: 'TX', category: 'Church', address: '404 Grace Ln', zip: '78701', seating_notes: 'Pews are tight, waiting area has armless chairs', seat_types: 'pews, armless chairs', tags: ['Pews are tight', 'Armless chairs'] },
];

const seed = () => {
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const userPassword = bcrypt.hashSync('user123', 10);

  const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
  const adminId = insertUser.run('Admin User', 'admin@pluscheck.com', adminPassword, 'admin').lastInsertRowid;
  const userId = insertUser.run('Test User', 'user@pluscheck.com', userPassword, 'user').lastInsertRowid;

  const insertBusiness = db.prepare(`
    INSERT INTO businesses (name, address, city, state, zip, category, seating_notes, seat_types)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (user_id, business_id, star_rating, seat_type, felt_comfortable, felt_sturdy, staff_accommodating, tips, body_context, date_visited)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertScore = db.prepare(`
    INSERT INTO review_scores (review_id, chair_width_score, chair_sturdiness_score, booth_comfort_score, armrest_friendliness, table_spacing_score, movable_seating_score, would_go_again_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTag = db.prepare(`
    INSERT INTO seating_tags (business_id, tag)
    VALUES (?, ?)
  `);

  businesses.forEach((b) => {
    const businessId = insertBusiness.run(b.name, b.address, b.city, b.state, b.zip, b.category, b.seating_notes, b.seat_types).lastInsertRowid;
    
    if (b.tags) {
      b.tags.forEach(tag => {
        insertTag.run(businessId, tag);
      });
    }

    // Add 3 sample reviews for each business to ensure scores show up
    for (let i = 1; i <= 3; i++) {
      const reviewId = insertReview.run(
        userId,
        businessId,
        4 + (i % 2), // 4 or 5
        'Chairs',
        1, // yes
        1, // yes
        1, // yes
        'Great place, very comfortable seating!',
        'I usually prefer armless chairs.',
        '2023-10-0' + i
      ).lastInsertRowid;

      insertScore.run(
        reviewId,
        4 + (i % 2),
        4 + (i % 2),
        4 + (i % 2),
        4 + (i % 2),
        4 + (i % 2),
        4 + (i % 2),
        4 + (i % 2)
      );
    }
  });

  console.log('Seed data inserted.');
};

seed();
db.close();
