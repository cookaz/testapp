import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Mock reports data
const mockReports = [
  { id: 1, review_id: 5, reason: "Body shaming language in review", status: "pending", reported_by: "User 2", created_at: "2024-02-15" },
  { id: 2, review_id: null, reason: "Inappropriate photo", status: "pending", reported_by: "User 3", created_at: "2024-02-14" },
  { id: 3, review_id: 2, reason: "Fake review - never visited", status: "pending", reported_by: "User 1", created_at: "2024-02-13" },
];

const mockPendingBusinesses = [
  { id: 10, name: "New Coffee Shop", city: "Austin", state: "TX", category: "Café", created_at: "2024-02-16" },
  { id: 11, name: "Downtown Diner", city: "Austin", state: "TX", category: "Restaurant", created_at: "2024-02-15" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState(mockReports);
  const [pendingBusinesses, setPendingBusinesses] = useState(mockPendingBusinesses);
  const [actionMsg, setActionMsg] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <div className="page">
        <div className="container text-center" style={{ paddingTop: 60 }}>
          <div className="empty-state-icon" style={{ fontSize: "3rem" }}>🔒</div>
          <h2>Access Denied</h2>
          <p className="empty-state-text">
            You need admin permissions to access this page.
          </p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const handleResolve = (reportId, action) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: action === "dismiss" ? "dismissed" : "resolved" } : r
      )
    );
    const actionLabel = action === "dismiss" ? "Dismissed" : "Removed & warned user";
    setActionMsg(`${actionLabel} report #${reportId}`);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const handleApproveBusiness = (bizId) => {
    setPendingBusinesses((prev) => prev.filter((b) => b.id !== bizId));
    setActionMsg(`Business #${bizId} approved`);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const handleRejectBusiness = (bizId) => {
    setPendingBusinesses((prev) => prev.filter((b) => b.id !== bizId));
    setActionMsg(`Business #${bizId} rejected`);
    setTimeout(() => setActionMsg(""), 3000);
  };

  const pendingReports = reports.filter((r) => r.status === "pending");
  const resolvedReports = reports.filter((r) => r.status !== "pending");

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Admin Dashboard</h1>
            <p className="text-sm text-muted">Manage reports, content, and businesses</p>
          </div>
          <Link to="/" className="btn btn-sm btn-ghost">← Home</Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          <div className="card text-center">
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--red)" }}>{pendingReports.length}</div>
            <div className="text-sm text-muted">Pending Reports</div>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--amber)" }}>{pendingBusinesses.length}</div>
            <div className="text-sm text-muted">New Businesses</div>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--green)" }}>{resolvedReports.length}</div>
            <div className="text-sm text-muted">Resolved</div>
          </div>
        </div>

        {/* Toast message */}
        {actionMsg && <div className="toast">{actionMsg}</div>}

        {/* Pending Reports */}
        <div className="admin-section">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 12 }}>
            📋 Reported Content ({pendingReports.length})
          </h2>
          {pendingReports.length > 0 ? (
            pendingReports.map((report) => (
              <div key={report.id} className="card admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="tag tag-amber">Report #{report.id}</span>
                  <span className="text-xs text-muted">{report.created_at}</span>
                </div>
                <p style={{ fontSize: "0.9rem", marginBottom: 4 }}>
                  <strong>Reason:</strong> {report.reason}
                </p>
                <p className="text-xs text-muted">
                  Reported by: {report.reported_by} · Review ID: {report.review_id || "N/A"}
                </p>
                <div className="admin-actions">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleResolve(report.id, "remove")}
                  >
                    Remove & Warn
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleResolve(report.id, "dismiss")}
                  >
                    Dismiss
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleResolve(report.id, "ban")}
                  >
                    Ban User
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
              ✅ No pending reports. All clear!
            </div>
          )}
        </div>

        {/* Resolved Reports */}
        {resolvedReports.length > 0 && (
          <div className="admin-section">
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 12 }}>
              ✅ Resolved ({resolvedReports.length})
            </h2>
            {resolvedReports.map((report) => (
              <div key={report.id} className="card admin-card resolved">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    <strong>Report #{report.id}</strong> — {report.reason}
                  </span>
                  <span className="text-xs text-muted">
                    {report.status === "resolved" ? "Resolved" : "Dismissed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pending Businesses */}
        <div className="admin-section">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 12 }}>
            🏢 New Businesses ({pendingBusinesses.length})
          </h2>
          {pendingBusinesses.length > 0 ? (
            pendingBusinesses.map((biz) => (
              <div key={biz.id} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{biz.name}</div>
                    <div className="text-sm text-muted">{biz.category} · {biz.city}, {biz.state}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleApproveBusiness(biz.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRejectBusiness(biz.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
              ✅ No pending businesses.
            </div>
          )}
        </div>

        {/* Moderation rules */}
        <div className="card" style={{ marginTop: 24, background: "var(--bg-gray)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>⚖️ Moderation Rules</h3>
          <ul className="checklist">
            <li>Harassment, body shaming, or offensive language</li>
            <li>Posting private personal information (doxxing)</li>
            <li>Mocking people's bodies or weight</li>
            <li>Fake or hateful reviews intended to harm a business</li>
          </ul>
        </div>
      </div>
    </div>
  );
}