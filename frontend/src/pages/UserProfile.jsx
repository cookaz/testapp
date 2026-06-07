import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { businesses } from "../data/placeholder";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("favorites");

  // Get user's reviews (from placeholder data, all reviews by user 1)
  const userReviews = businesses
    .flatMap((b) =>
      (b.reviews || [])
        .filter((r) => r.user_id === (user?.id || 1))
        .map((r) => ({ ...r, businessName: b.name, businessId: b.id }))
    );

  // Favorites are just bookmarked for now
  const [favorites, setFavorites] = useState(
    businesses.filter((b) => b.id === 1 || b.id === 3 || b.id === 5)
  );

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="page">
        <div className="container text-center" style={{ paddingTop: 60 }}>
          <div className="empty-state-icon" style={{ fontSize: "3rem" }}>👤</div>
          <h2>Not Signed In</h2>
          <p className="empty-state-text">
            Sign in to view your profile and saved favorites.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Profile header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
            {user.role === "admin" && (
              <span className="tag" style={{ marginTop: 4 }}>
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div className="card text-center">
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
              {userReviews.length}
            </div>
            <div className="text-sm text-muted">Reviews</div>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
              {favorites.length}
            </div>
            <div className="text-sm text-muted">Favorites</div>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>
              0
            </div>
            <div className="text-sm text-muted">Photos</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          <button
            className={`tab ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            ♥ Saved ({favorites.length})
          </button>
          <button
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            ✍️ Reviews ({userReviews.length})
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "favorites" && (
          <div>
            {favorites.length > 0 ? (
              <div className="business-grid">
                {favorites.map((biz) => (
                  <div key={biz.id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <Link to={`/business/${biz.id}`} style={{ fontWeight: 600, color: "var(--text)" }}>
                          {biz.name}
                        </Link>
                        <div className="text-sm text-muted">{biz.category}</div>
                        <div className="text-sm text-muted">{biz.city}, {biz.state}</div>
                      </div>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setFavorites((prev) =>
                          prev.filter((b) => b.id !== biz.id)
                        )}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">♥</div>
                <p className="empty-state-text">
                  No saved businesses yet. Browse and save places you want to visit!
                </p>
                <Link to="/search" className="btn btn-primary">Browse Businesses</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <div key={review.id} className="card mb-md">
                  <div className="review-header">
                    <div>
                      <Link
                        to={`/business/${review.businessId}`}
                        style={{ fontWeight: 600, color: "var(--text)" }}
                      >
                        {review.businessName}
                      </Link>
                      <div className="stars" style={{ display: "block", marginTop: 4 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= (review.star_rating || 3) ? "stars" : "stars stars-empty"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted">
                      {review.date_visited && `Visited ${review.date_visited}`}
                    </div>
                  </div>
                  {review.tips && (
                    <div style={{ marginTop: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {review.tips}
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <Link
                      to={`/business/${review.businessId}`}
                      className="btn btn-sm btn-ghost"
                    >
                      View Business
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">✍️</div>
                <p className="empty-state-text">
                  You haven't written any reviews yet.
                </p>
                <Link to="/search" className="btn btn-primary">
                  Find a Business to Review
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            onClick={handleLogout}
            className="btn btn-ghost"
            style={{ color: "var(--red)" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}