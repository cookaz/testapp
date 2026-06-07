import { Link } from "react-router-dom";

export default function OwnerPreview() {
  return (
    <div className="page">
      {/* Hero */}
      <div className="owner-preview-hero">
        <h1>Claim Your Business Page</h1>
        <p>
          Showcase your seating, attract plus-size customers, and build trust
          with the community.
        </p>
      </div>

      <div className="container">
        {/* Preview of claimed business page */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>
            Preview: What Your Verified Page Looks Like
          </h2>

          <div className="card mb-lg">
            {/* Business header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1 style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                    Your Business Name
                  </h1>
                  <span
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      padding: "2px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    ✓ Verified
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Category · City, State
                </p>
                <p style={{ fontSize: "0.85rem", marginTop: 4 }}>📍 123 Main St</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--green)" }}>
                  4.2
                  <span style={{ fontSize: "0.9rem", fontWeight: 400, display: "block", color: "var(--text-muted)" }}>
                    Plus Check Score
                  </span>
                </div>
              </div>
            </div>

            {/* Verified badge explanation */}
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "var(--green-light)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ fontSize: "1.5rem" }}>✓</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Verified Business
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  This business has claimed their page and provided official
                  seating measurements and photos.
                </p>
              </div>
            </div>
          </div>

          {/* Official measurements */}
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>
            📏 Official Measurements
          </h2>
          <div className="card mb-lg">
            <div className="score-breakdown">
              <div className="score-item">
                <span className="score-item-label">Seat Width</span>
                <span className="score-item-value good">20 in</span>
              </div>
              <div className="score-item">
                <span className="score-item-label">Seat Depth</span>
                <span className="score-item-value good">18 in</span>
              </div>
              <div className="score-item">
                <span className="score-item-label">Armrest Width</span>
                <span className="score-item-value good">22 in</span>
              </div>
              <div className="score-item">
                <span className="score-item-label">Table Height</span>
                <span className="score-item-value good">30 in</span>
              </div>
              <div className="score-item">
                <span className="score-item-label">Booth Width</span>
                <span className="score-item-value ok">48 in</span>
              </div>
              <div className="score-item">
                <span className="score-item-label">Weight Capacity</span>
                <span className="score-item-value good">500 lbs</span>
              </div>
            </div>
            <p className="text-sm text-muted" style={{ marginTop: 8 }}>
              Measurements provided and verified by the business owner.
            </p>
          </div>

          {/* Official photos */}
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>
            📸 Official Photos
          </h2>
          <div className="card mb-lg">
            <div className="photo-gallery">
              <div className="photo-placeholder" style={{ aspectRatio: "4/3" }}>
                🪑 Seating Area
              </div>
              <div className="photo-placeholder" style={{ aspectRatio: "4/3" }}>
                🪑 Booth
              </div>
              <div className="photo-placeholder" style={{ aspectRatio: "4/3" }}>
                🪑 Entrance
              </div>
            </div>
            <p className="text-sm text-muted" style={{ marginTop: 8 }}>
              Upload official photos of your seating areas, entrance, and
              accessible features.
            </p>
          </div>

          {/* Claim process */}
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>
            How to Claim Your Business
          </h2>
          <div className="card" style={{ background: "var(--bg-gray)", marginBottom: 24 }}>
            <ul className="feature-checklist">
              <li>Search for your business on Plus Check</li>
              <li>Click "Claim this Business" on your page</li>
              <li>Verify your ownership via business email or phone</li>
              <li>Add official measurements and photos</li>
              <li>Publish and start attracting plus-size customers!</li>
            </ul>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "24px 0 48px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>
              Ready to Get Started?
            </h3>
            <p className="text-muted mb-lg">
              Join hundreds of businesses already reaching the plus-size
              community.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/search" className="btn btn-primary btn-lg">
                Find Your Business
              </Link>
              <Link to="/business-model" className="btn btn-secondary btn-lg">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}