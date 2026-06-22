import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/roadmap", label: "Roadmap" },
    { to: "/practice", label: "Practice" },
    { to: "/mocktest", label: "Mock Test" },
    { to: "/consistency", label: "Consistency" },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(0,0,0,0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,255,200,0.08)",
      padding: "0 40px",
      height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link to="/dashboard" style={{ textDecoration: "none" }}>
        <span className="mono neon-green neon-text" style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
          PrepWise
        </span>
      </Link>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} style={{
                textDecoration: "none",
                fontFamily: "Share Tech Mono, monospace",
                fontSize: 11,
                color: active ? "#00ffc8" : "rgba(255,255,255,0.3)",
                padding: "7px 16px",
                borderRadius: 4,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                border: active ? "1px solid rgba(0,255,200,0.2)" : "1px solid transparent",
                background: active ? "rgba(0,255,200,0.05)" : "transparent",
                textShadow: active ? "0 0 10px rgba(0,255,200,0.4)" : "none",
                transition: "all 0.2s",
              }}>
                {link.label}
              </Link>
            );
          })}

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.06)", margin: "0 12px" }} />

          <div style={{ width: 32, height: 32, borderRadius: 4, border: "1px solid rgba(0,255,200,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#00ffc8", background: "rgba(0,255,200,0.05)", marginRight: 10, textShadow: "0 0 10px rgba(0,255,200,0.5)" }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <button onClick={() => { logout(); navigate("/login"); }} className="btn-neon" style={{ fontSize: 11, padding: "6px 14px", borderRadius: 4, letterSpacing: 1 }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
