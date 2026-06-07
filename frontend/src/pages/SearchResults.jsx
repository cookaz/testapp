import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import BusinessCard from "../components/BusinessCard";
import { businesses, categories } from "../data/placeholder";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");

  const filtered = useMemo(() => {
    let results = [...businesses];

    // Filter by search query
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.state.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.seating_notes?.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q)) ||
          b.address?.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter((b) => b.category === selectedCategory);
    }

    // Sort
    if (sortBy === "rating") {
      results.sort((a, b) => {
        const aScore = a.reviews?.length
          ? a.reviews.reduce((s, r) => s + (r.star_rating || 3), 0) /
            a.reviews.length
          : 0;
        const bScore = b.reviews?.length
          ? b.reviews.reduce((s, r) => s + (r.star_rating || 3), 0) /
            b.reviews.length
          : 0;
        return bScore - aScore;
      });
    } else if (sortBy === "reviews") {
      results.sort(
        (a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)
      );
    }

    return results;
  }, [query, selectedCategory, sortBy]);

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="back-btn">
          ← Back to Home
        </Link>

        <h1 className="page-title" style={{ textAlign: "center" }}>
          {query
            ? `Results for "${query}"`
            : "Browse All Businesses"}
        </h1>
        <p className="page-subtitle text-center mb-lg">
          {filtered.length} business{filtered.length !== 1 ? "es" : ""} found
        </p>

        {/* Filters */}
        <div className="search-filters">
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="filter-row">
              <button
                className={`filter-chip ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => setSelectedCategory("All")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">Sort by</label>
            <div className="sort-controls">
              <button
                className={`sort-btn ${sortBy === "relevance" ? "active" : ""}`}
                onClick={() => setSortBy("relevance")}
              >
                Relevance
              </button>
              <button
                className={`sort-btn ${sortBy === "rating" ? "active" : ""}`}
                onClick={() => setSortBy("rating")}
              >
                Highest Rated
              </button>
              <button
                className={`sort-btn ${sortBy === "reviews" ? "active" : ""}`}
                onClick={() => setSortBy("reviews")}
              >
                Most Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="map-placeholder mb-lg">
          <span>
            <span className="map-icon">🗺️</span>
            Map view coming soon
          </span>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="business-grid">
            {filtered.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-text">
              No businesses found matching your search.
            </p>
            <Link to="/add-business" className="btn btn-primary">
              Add this business
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}