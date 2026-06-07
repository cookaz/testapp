import { Link } from "react-router-dom";

export default function BusinessModel() {
  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="back-btn">← Back to Home</Link>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            Plus Check for Businesses
          </h1>
          <p className="page-subtitle" style={{ maxWidth: 500, margin: "8px auto 0" }}>
            Reach more customers, showcase your inclusive seating, and grow your
            reputation with the plus-size community.
          </p>
        </div>

        {/* Value proposition */}
        <div className="section-card mb-lg">
          <div className="section-card-icon">📈</div>
          <div className="section-card-content">
            <h3>Why Join Plus Check?</h3>
            <p>
              The plus-size community spends over $200B annually on dining,
              entertainment, and services. Plus Check helps you attract and
              retain these customers by demonstrating your commitment to
              inclusive seating.
            </p>
          </div>
        </div>

        {/* Pricing plans */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
          Choose Your Plan
        </h2>

        <div className="business-model-grid">
          {/* Free plan */}
          <div className="card plan-card">
            <h3>Free Listing</h3>
            <div className="plan-price">
              $0<span>/mo</span>
            </div>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>
              Get started with a basic presence
            </p>
            <ul className="plan-features">
              <li>✓ Basic business page</li>
              <li>✓ Respond to reviews</li>
              <li>✓ Community seating tags</li>
            </ul>
            <Link to="/" className="btn btn-secondary btn-block">
              Get Started
            </Link>
          </div>

          {/* Verified (featured) */}
          <div className="card plan-card featured">
            <h3>Verified Business</h3>
            <div className="plan-price">
              $29<span>/mo</span>
            </div>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>
              Stand out with a verified badge
            </p>
            <ul className="plan-features">
              <li>✓ ✓ Verified checkmark badge</li>
              <li>✓ Add official measurements</li>
              <li>✓ Upload official photos</li>
              <li>✓ Priority in search results</li>
              <li>✓ Respond to all reviews</li>
            </ul>
            <Link to="/owner-preview" className="btn btn-primary btn-block">
              See Preview
            </Link>
          </div>

          {/* Premium */}
          <div className="card plan-card">
            <h3>Premium Analytics</h3>
            <div className="plan-price">
              $99<span>/mo</span>
            </div>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>
              Data-driven insights for your business
            </p>
            <ul className="plan-features">
              <li>✓ Everything in Verified</li>
              <li>✓ Seating sentiment analytics</li>
              <li>✓ Competitor comparison</li>
              <li>✓ Customer demographics</li>
              <li>✓ Featured in sponsored listings</li>
              <li>✓ Priority support</li>
            </ul>
            <Link to="/owner-preview" className="btn btn-primary btn-block">
              Learn More
            </Link>
          </div>

          {/* Sponsored */}
          <div className="card plan-card">
            <h3>Featured Listing</h3>
            <div className="plan-price">
              $199<span>/mo</span>
            </div>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>
              Maximum visibility in your area
            </p>
            <ul className="plan-features">
              <li>✓ Everything in Premium</li>
              <li>✓ Top placement in search results</li>
              <li>✓ Featured in city guides</li>
              <li>✓ Social media promotion</li>
              <li>✓ Dedicated account manager</li>
            </ul>
            <Link to="/owner-preview" className="btn btn-primary btn-block">
              Contact Us
            </Link>
          </div>
        </div>

        {/* How it works for businesses */}
        <div className="section">
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
            How It Works
          </h2>
          <div className="how-it-works">
            <div className="how-step">
              <div className="how-step-icon">🏢</div>
              <h3>Claim Your Page</h3>
              <p>Search for your business and claim your listing</p>
            </div>
            <div className="how-step">
              <div className="how-step-icon">📏</div>
              <h3>Add Details</h3>
              <p>Upload measurements, photos, and seating information</p>
            </div>
            <div className="how-step">
              <div className="how-step-icon">✓</div>
              <h3>Get Verified</h3>
              <p>Earn the verified badge and attract more customers</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="card mb-lg" style={{ background: "var(--bg-gray)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>❓ Frequently Asked Questions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <strong style={{ fontSize: "0.9rem" }}>How do I claim my business?</strong>
              <p className="text-sm text-muted">Search for your business, click "Claim this Business," and verify your ownership via email.</p>
            </div>
            <div>
              <strong style={{ fontSize: "0.9rem" }}>Can I respond to reviews?</strong>
              <p className="text-sm text-muted">Yes! Verified and Premium businesses can publicly respond to all reviews.</p>
            </div>
            <div>
              <strong style={{ fontSize: "0.9rem" }}>What measurements should I add?</strong>
              <p className="text-sm text-muted">Seat width, seat depth, armrest width, table height, and booth dimensions help customers plan ahead.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}