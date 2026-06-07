import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import { businesses } from "../data/placeholder";

export default function BusinessProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [isFavorite, setIsFavorite] = useState(false);

  const business = businesses.find((b) => b.id === parseInt(id));

  if (!business) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">😕</div>
            <p className="empty-state-text">Business not found</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const { reviews, tags, name, category, city, state, address, seating_notes } = business;
  const reviewCount = reviews?.length || 0;
  const needsMoreReviews = reviewCount < 3;

  // Calculate scores
  const avgScores = useMemo(() => {
    if (reviewCount === 0) return null;
    const sums = {
      chair_width: 0, chair_sturdiness: 0, booth_comfort: 0,
      armrest_friendliness: 0, table_spacing: 0, movable_seating: 0, would_go_again: 0
    };
    reviews.forEach((r) => {
      const s = r.scores || {};
      sums.chair_width += s.chair_width_score || 3;
      sums.chair_sturdiness += s.chair_sturdiness_score || 3;
      sums.booth_comfort += s.booth_comfort_score || 3;
      sums.armrest_friendliness += s.armrest_friendliness_score || 3;
      sums.table_spacing += s.table_spacing_score || 3;
      sums.movable_seating += s.movable_seating_score || 3;
      sums.would_go_again += s.would_go_again_score || 3;
    });
    const avg = {};
    Object.keys(sums).forEach((key) => {
      avg[key] = (sums[key] / reviewCount).toFixed(1);
    });
    // Overall weighted
    avg.overall = (
      parseFloat(avg.chair_width) * 0.2 +
      parseFloat(avg.chair_sturdiness) * 0.15 +
      parseFloat(avg.booth_comfort) * 0.2 +
      parseFloat(avg.armrest_friendliness) * 0.15 +
      parseFloat(avg.table_spacing) * 0.1 +
      parseFloat(avg.movable_seating) * 0.1 +
      parseFloat(avg.would_go_again) * 0.1
    ).toFixed(1);
    return avg;
  }, [reviews, reviewCount]);

  // Sort reviews
  const sortedReviews = useMemo(() => {
    if (!reviews) return [];
    const sorted = [...reviews];
    if (sortBy === "newest") {
      sorted.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    } else if (sortBy === "highest") {
      sorted.sort((a, b) => (b.star_rating || 3) - (a.star_rating || 3));
    } else if (sortBy === "lowest") {
      sorted.sort((a, b) => (a.star_rating || 3) - (b.star_rating || 3));
    } else if (sortBy === "helpful") {
      sorted.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
    }
    return sorted;
  }, [reviews, sortBy]);

  const getScoreClass = (val) => {
    const num = parseFloat(val);
    if (num >= 4) return "good";
    if (num >= 3) return "ok";
    return "bad";
  };

  const scoreLabels = {
    chair_width: "Chair Width",
    chair_sturdiness: "Sturdiness",
    booth_comfort: "Booth Comfort",
    armrest_friendliness: "Armrests",
    table_spacing: "Table Spacing",
    movable_seating: "Movable Seating",
    would_go_again: "Would Go Again"
  };

  return (
    <div className="page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        {/* Header */}
        <div className="card mb-lg">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{name}</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{category}</p>
              <p style={{ fontSize: "0.85rem", marginTop: 4 }}>
                📍 {address}, {city}, {state}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              {avgScores ? (
                <div style={{ fontSize: "2rem", fontWeight: 800, color: `var(--${parseFloat(avgScores.overall) >= 4 ? "green" : parseFloat(avgScores.overall) >= 3 ? "amber" : "red"})` }}>
                  {avgScores.overall}
                  <span style={{ fontSize: "0.9rem", fontWeight: 400, display: "block", color: "var(--text-muted)" }}>out of 5</span>
                </div>
              ) : (
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  <span className="tag tag-gray">New</span>
                  <p style={{ marginTop: 4 }}>Be the first to review!</p>
                </div>
              )}
              {avgScores && (
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Favorite + Review buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <button
              className={`btn ${isFavorite ? "btn-primary" : "btn-secondary"} btn-sm`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? "♥ Saved" : "♡ Save"}
            </button>
            <Link to={`/business/${id}/review`} className="btn btn-primary btn-sm">
              ✍️ Write a Review
            </Link>
          </div>
        </div>

        {/* Seating notes */}
        {seating_notes && (
          <div className="card mb-md">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 8 }}>Seating Notes</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{seating_notes}</p>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-md">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 8 }}>Seating Tags</h3>
            <div>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={`tag ${tag.toLowerCase().includes("tight") || tag.toLowerCase().includes("narrow") || tag.toLowerCase().includes("flimsy") ? "tag-amber" : tag.toLowerCase().includes("sturdy") || tag.toLowerCase().includes("wide") || tag.toLowerCase().includes("spacious") || tag.toLowerCase().includes("comfortable") ? "tag-green" : ""}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Score breakdown */}
        {avgScores && (
          <div className="card mb-md">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 12 }}>
              Score Breakdown
              {needsMoreReviews && (
                <span className="tag tag-amber" style={{ marginLeft: 8, fontSize: "0.7rem" }}>
                  Needs {3 - reviewCount} more review{3 - reviewCount !== 1 ? "s" : ""}
                </span>
              )}
            </h3>
            <div className="score-breakdown">
              {Object.entries(scoreLabels).map(([key, label]) => (
                <div key={key} className="score-item">
                  <span className="score-item-label">{label}</span>
                  <span className={`score-item-value ${getScoreClass(avgScores[key])}`}>
                    {avgScores[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos placeholder */}
        <div className="card mb-md">
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 8 }}>Photos</h3>
          <div className="photo-gallery">
            {[1, 2, 3].map((i) => (
              <div key={i} className="photo-placeholder">
                📷 Photo {i}
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
            Photos coming soon — submit yours when you review!
          </p>
        </div>

        {/* Reviews section */}
        <div className="mb-lg">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>
              Reviews ({reviewCount})
            </h3>
            <div className="sort-controls" style={{ marginBottom: 0 }}>
              <button
                className={`sort-btn ${sortBy === "newest" ? "active" : ""}`}
                onClick={() => setSortBy("newest")}
              >
                Newest
              </button>
              <button
                className={`sort-btn ${sortBy === "highest" ? "active" : ""}`}
                onClick={() => setSortBy("highest")}
              >
                Highest
              </button>
              <button
                className={`sort-btn ${sortBy === "lowest" ? "active" : ""}`}
                onClick={() => setSortBy("lowest")}
              >
                Lowest
              </button>
              <button
                className={`sort-btn ${sortBy === "helpful" ? "active" : ""}`}
                onClick={() => setSortBy("helpful")}
              >
                Most Helpful
              </button>
            </div>
          </div>

          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                businessId={id}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✍️</div>
              <p className="empty-state-text">
                No reviews yet. Be the first to share your experience!
              </p>
              <Link to={`/business/${id}/review`} className="btn btn-primary">
                Write a Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}