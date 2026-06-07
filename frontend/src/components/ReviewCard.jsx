import { useState } from "react";
import { reviewsAPI } from "../api";

export default function ReviewCard({ review, businessId, onReport }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [helpfulActive, setHelpfulActive] = useState(false);

  const handleHelpful = async () => {
    if (helpfulActive) return;
    try {
      await reviewsAPI.markHelpful(review.id);
      setHelpfulCount((c) => c + 1);
      setHelpfulActive(true);
    } catch {
      // Fallback: increment locally
      setHelpfulCount((c) => c + 1);
      setHelpfulActive(true);
    }
  };

  const handleReport = () => {
    const reason = prompt("Why are you reporting this review?");
    if (reason) {
      if (onReport) {
        onReport(review.id, reason);
      } else {
        reviewsAPI.report(review.id, reason).catch(() => {});
      }
      alert("Thank you. This review has been reported for moderation.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "stars" : "stars stars-empty"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="card review-card">
      <div className="review-header">
        <div className="review-user">
          <div className="review-avatar">
            {review.user_name ? review.user_name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <div className="review-user-name">
              {review.user_name || "Anonymous"}
            </div>
            <div className="review-date">
              {review.date_visited && `Visited ${formatDate(review.date_visited)}`}
              {review.date_visited && review.created_at && " · "}
              {review.created_at && `Reviewed ${formatDate(review.created_at)}`}
            </div>
          </div>
        </div>
        <div>
          <div className="stars">{renderStars(review.star_rating || 3)}</div>
        </div>
      </div>

      {review.body_context && (
        <div className="review-body-context">
          Context: {review.body_context}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <span className={`tag ${review.felt_comfortable === null || review.felt_comfortable === undefined ? "tag-gray" : review.felt_comfortable ? "tag-green" : "tag-amber"}`}>
          {review.felt_comfortable === null || review.felt_comfortable === undefined
            ? "Comfort: N/A"
            : review.felt_comfortable
            ? "✓ Comfortable"
            : "✗ Uncomfortable"}
        </span>
        <span className={`tag ${review.felt_sturdy === null || review.felt_sturdy === undefined ? "tag-gray" : review.felt_sturdy ? "tag-green" : "tag-amber"}`}>
          {review.felt_sturdy === null || review.felt_sturdy === undefined
            ? "Sturdy: N/A"
            : review.felt_sturdy
            ? "✓ Sturdy"
            : "✗ Not Sturdy"}
        </span>
        <span className={`tag ${review.staff_accommodating === null || review.staff_accommodating === undefined ? "tag-gray" : review.staff_accommodating ? "tag-green" : "tag-amber"}`}>
          {review.staff_accommodating === null || review.staff_accommodating === undefined
            ? "Staff: N/A"
            : review.staff_accommodating
            ? "✓ Staff great"
            : "✗ Staff unhelpful"}
        </span>
      </div>

      {review.tips && (
        <div className="review-tips">
          <div className="review-tips-label">💡 Tips</div>
          {review.tips}
        </div>
      )}

      <div className="review-actions">
        <button
          className={`review-helpful-btn ${helpfulActive ? "active" : ""}`}
          onClick={handleHelpful}
        >
          👍 Helpful ({helpfulCount})
        </button>
        <button className="report-btn" onClick={handleReport}>
          Report
        </button>
      </div>
    </div>
  );
}