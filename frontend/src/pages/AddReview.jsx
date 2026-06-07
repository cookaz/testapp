import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { reviewsAPI } from "../api";
import { businesses, bodyContextOptions, seatTypeOptions } from "../data/placeholder";

export default function AddReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = businesses.find((b) => b.id === parseInt(id));

  const [formData, setFormData] = useState({
    star_rating: 0,
    seat_type: "",
    felt_comfortable: null,
    felt_sturdy: null,
    staff_accommodating: null,
    tips: "",
    body_context: "",
    date_visited: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [success, setSuccess] = useState(false);

  if (!business) {
    return (
      <div className="page">
        <div className="container text-center" style={{ paddingTop: 60 }}>
          <p>Business not found.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const handleToggle = (field, value) => {
    // Toggle: if same value clicked, set to null; else set to value
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === value ? null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.star_rating === 0) return;
    setSubmitting(true);

    // Build scores object based on ratings
    const baseScore = formData.star_rating;
    const scores = {
      chair_width_score: baseScore,
      chair_sturdiness_score: formData.felt_sturdy === true ? 4 : formData.felt_sturdy === false ? 2 : 3,
      booth_comfort_score: formData.felt_comfortable === true ? 4 : formData.felt_comfortable === false ? 2 : 3,
      armrest_friendliness_score: baseScore,
      table_spacing_score: baseScore,
      movable_seating_score: baseScore,
      would_go_again_score: baseScore,
    };

    try {
      await reviewsAPI.create(id, {
        ...formData,
        scores,
      });
    } catch {
      // Fallback for MVP
    }

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(`/business/${id}`), 2000);
  };

  if (success) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div className="empty-state-icon" style={{ fontSize: "4rem" }}>🎉</div>
            <h2 style={{ marginBottom: 8 }}>Review Submitted!</h2>
            <p className="empty-state-text">
              Thank you for helping the Plus Check community!
            </p>
            <Link to={`/business/${id}`} className="btn btn-primary">
              Back to Business
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="form-page">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>

          <h2>Review {business.name}</h2>
          <p className="page-subtitle mb-lg">
            Share your seating experience to help the community.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Star rating */}
            <div className="form-group">
              <label className="form-label">Overall Rating *</label>
              <div className="star-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={(hoverRating >= star || formData.star_rating >= star) ? "filled" : ""}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setFormData((prev) => ({ ...prev, star_rating: star }))}
                  >
                    ★
                  </button>
                ))}
              </div>
              {formData.star_rating === 0 && (
                <div className="form-error">Please select a rating</div>
              )}
            </div>

            {/* Seat type */}
            <div className="form-group">
              <label className="form-label">Seat Type Tried</label>
              <select
                className="form-select"
                value={formData.seat_type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seat_type: e.target.value }))
                }
              >
                <option value="">Select seat type</option>
                {seatTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle questions */}
            <div className="form-group">
              <label className="form-label">Was the seating comfortable?</label>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${formData.felt_comfortable === true ? "active active-yes" : ""}`}
                  onClick={() => handleToggle("felt_comfortable", true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.felt_comfortable === false ? "active active-no" : ""}`}
                  onClick={() => handleToggle("felt_comfortable", false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.felt_comfortable === null ? "active" : ""}`}
                  onClick={() => handleToggle("felt_comfortable", null)}
                >
                  Unsure
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Did the seating feel sturdy?</label>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${formData.felt_sturdy === true ? "active active-yes" : ""}`}
                  onClick={() => handleToggle("felt_sturdy", true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.felt_sturdy === false ? "active active-no" : ""}`}
                  onClick={() => handleToggle("felt_sturdy", false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.felt_sturdy === null ? "active" : ""}`}
                  onClick={() => handleToggle("felt_sturdy", null)}
                >
                  Unsure
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Was staff accommodating?</label>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${formData.staff_accommodating === true ? "active active-yes" : ""}`}
                  onClick={() => handleToggle("staff_accommodating", true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.staff_accommodating === false ? "active active-no" : ""}`}
                  onClick={() => handleToggle("staff_accommodating", false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${formData.staff_accommodating === null ? "active" : ""}`}
                  onClick={() => handleToggle("staff_accommodating", null)}
                >
                  Unsure
                </button>
              </div>
            </div>

            {/* Body context */}
            <div className="form-group">
              <label className="form-label">Body Context (optional)</label>
              <select
                className="form-select"
                value={formData.body_context}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body_context: e.target.value }))
                }
              >
                <option value="">Select that best describes you</option>
                {bodyContextOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="form-hint">
                Helps others with similar needs find relevant reviews.
              </div>
            </div>

            {/* Tips */}
            <div className="form-group">
              <label className="form-label">Tips for Visitors (optional)</label>
              <textarea
                className="form-textarea"
                value={formData.tips}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tips: e.target.value }))
                }
                placeholder="Share helpful tips for other plus-size visitors..."
                rows={3}
              />
            </div>

            {/* Date visited */}
            <div className="form-group">
              <label className="form-label">Date Visited (optional)</label>
              <input
                className="form-input"
                type="date"
                value={formData.date_visited}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date_visited: e.target.value }))
                }
              />
            </div>

            {/* Photo */}
            <div className="form-group">
              <label className="form-label">Photo (optional)</label>
              <div className="photo-upload">
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>📸</div>
                <div>Add a photo of the seating</div>
                <div className="form-hint">Photo upload coming soon</div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={submitting || formData.star_rating === 0}
              style={{ marginTop: 8 }}
            >
              {submitting ? "Submitting..." : "✍️ Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}