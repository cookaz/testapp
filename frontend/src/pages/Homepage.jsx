import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BusinessCard from "../components/BusinessCard";
import { businesses } from "../data/placeholder";

export default function Homepage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get popular businesses (those with most reviews)
  const popular = [...businesses]
    .sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0))
    .slice(0, 6);

  // Get recently reviewed
  const recentlyReviewed = [...businesses]
    .filter((b) => b.reviews && b.reviews.length > 0)
    .sort((a, b) => {
      const aLatest = a.reviews[0]?.created_at || "";
      const bLatest = b.reviews[0]?.created_at || "";
      return bLatest.localeCompare(aLatest);
    })
    .slice(0, 6);

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <h1>Know before you go.</h1>
        <p>
          Find plus-size friendly seating at restaurants, theaters, salons,
          venues, and local businesses.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search business, city, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="container">
        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <Link to="/add-business" className="btn btn-primary">
            ➕ Add a Business
          </Link>
          <Link to="/search" className="btn btn-secondary">
            ✍️ Browse All
          </Link>
        </div>

        {/* How it works */}
        <div className="section">
          <h2 className="section-title">How it works</h2>
          <div className="how-it-works">
            <div className="how-step">
              <div className="how-step-icon">🔍</div>
              <h3>Search</h3>
              <p>Find any business and see seating info before you go</p>
            </div>
            <div className="how-step">
              <div className="how-step-icon">✍️</div>
              <h3>Review</h3>
              <p>Share your experience to help the community</p>
            </div>
            <div className="how-step">
              <div className="how-step-icon">✓</div>
              <h3>Go Confidently</h3>
              <p>Know what to expect — no surprises, no anxiety</p>
            </div>
          </div>
        </div>

        {/* Popular businesses */}
        {popular.length > 0 && (
          <div className="section">
            <h2 className="section-title">
              <span>⭐ Popular Places</span>
              <Link to="/search" className="text-sm">
                View all
              </Link>
            </h2>
            <div className="business-grid">
              {popular.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          </div>
        )}

        {/* Recently reviewed */}
        {recentlyReviewed.length > 0 && (
          <div className="section">
            <h2 className="section-title">
              <span>🕐 Recently Reviewed</span>
              <Link to="/search" className="text-sm">
                View all
              </Link>
            </h2>
            <div className="business-grid">
              {recentlyReviewed.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          </div>
        )}

        {/* Stats / Footer */}
        <div
          className="section"
          style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}
        >
          <p>
            <strong>{businesses.length}</strong> businesses listed ·{" "}
            <strong>
              {businesses.reduce((sum, b) => sum + (b.reviews?.length || 0), 0)}
            </strong>{" "}
            community reviews
          </p>
          <p style={{ marginTop: 8 }}>
            Plus Check is a community-driven platform for finding inclusive
            seating.
          </p>
        </div>
      </div>
    </div>
  );
}