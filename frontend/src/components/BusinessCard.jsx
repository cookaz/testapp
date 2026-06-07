import { Link } from "react-router-dom";

export default function BusinessCard({ business }) {
  const { name, city, state, category, tags, reviews, id } = business;

  // Calculate scores from reviews
  const reviewCount = reviews?.length || 0;
  let avgScore = null;

  if (reviewCount >= 1) {
    const totalScore = reviews.reduce((sum, r) => {
      const s = r.scores || {};
      const score =
        (s.chair_width_score || 3) * 0.2 +
        (s.chair_sturdiness_score || 3) * 0.15 +
        (s.booth_comfort_score || 3) * 0.2 +
        (s.armrest_friendliness || 3) * 0.15 +
        (s.table_spacing_score || 3) * 0.1 +
        (s.movable_seating_score || 3) * 0.1 +
        (s.would_go_again_score || 3) * 0.1;
      return sum + score;
    }, 0);
    avgScore = (totalScore / reviewCount).toFixed(1);
  }

  const getScoreClass = (score) => {
    const num = parseFloat(score);
    if (num >= 4) return "score-high";
    if (num >= 3) return "score-mid";
    return "score-low";
  };

  const getCheckSize = () => {
    if (reviewCount >= 10) return "checkmark-lg";
    if (reviewCount >= 3) return "checkmark-md";
    return "checkmark-sm";
  };

  return (
    <Link to={`/business/${id}`} className="card card-clickable business-card">
      <div className="business-card-top">
        <div>
          <div className="business-card-name">{name}</div>
          <div className="business-card-category">{category}</div>
          <div className="business-card-location">
            <span>📍</span> {city}, {state}
          </div>
        </div>
        <div>
          {avgScore ? (
            <div className={`score-badge ${getScoreClass(avgScore)}`}>
              <span
                className={`checkmark-badge ${getCheckSize()}`}
                style={{ background: parseFloat(avgScore) >= 4 ? "#4CAF50" : parseFloat(avgScore) >= 3 ? "#FF9800" : "#E53935", color: "white", width: 28, height: 28, fontSize: "0.8rem" }}
              >
                ✓
              </span>
              <span>{avgScore}</span>
            </div>
          ) : (
            <span className="tag tag-gray">New</span>
          )}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="business-card-tags">
          {tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className={`tag ${tag.toLowerCase().includes("tight") || tag.toLowerCase().includes("narrow") || tag.toLowerCase().includes("flimsy") ? "tag-amber" : "tag-green"}`}
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="tag tag-gray">+{tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="business-card-footer">
        <span>
          {reviewCount === 0
            ? "No reviews yet"
            : `${reviewCount} review${reviewCount !== 1 ? "s" : ""}`}
        </span>
        <span className="btn btn-sm btn-secondary">View Details</span>
      </div>
    </Link>
  );
}