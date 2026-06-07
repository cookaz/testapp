import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const topNavLinks = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
    { to: "/add-business", label: "Add Business" },
    { to: "/business-model", label: "For Businesses" },
  ];

  const bottomNavLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/search", label: "Search", icon: "🔍" },
    { to: "/add-business", label: "Add", icon: "➕" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <>
      {/* Top Navigation - Desktop */}
      <nav className="top-nav">
        <div className="top-nav-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">✓</span>
            <span>Plus Check</span>
          </Link>
          <div className="top-nav-links">
            {topNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={isActive(link.to) ? "active" : ""}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={isActive("/admin") ? "active" : ""}
              >
                Admin
              </Link>
            )}
            {user ? (
              <Link
                to="/profile"
                className={isActive("/profile") ? "active" : ""}
              >
                Profile
              </Link>
            ) : (
              <Link to="/login">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile */}
      <nav className="bottom-nav">
        {bottomNavLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={isActive(link.to) ? "active" : ""}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}