import { Link } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import BackgroundOrbs from "../components/BackgroundOrbs";

const NotFound = () => (
  <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
    <BackgroundOrbs /><ParticleBackground />
    <div className="page-enter" style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
      <p className="mono neon-green neon-text" style={{ fontSize: 11, letterSpacing: 4, marginBottom: 16 }}>// ERROR 404</p>
      <h1 style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, color: "white", lineHeight: 1, marginBottom: 12 }}>
        4<span className="neon-green neon-text">0</span>4
      </h1>
      <p className="mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", letterSpacing: 2, marginBottom: 32 }}>PAGE NOT FOUND — MISSION ABORTED</p>
      <Link to="/dashboard" style={{ textDecoration: "none" }}>
        <button className="btn-neon" style={{ padding: "12px 28px", borderRadius: 4, fontSize: 13, letterSpacing: 2 }}>
          ← RETURN TO BASE
        </button>
      </Link>
    </div>
  </div>
);

export default NotFound;
