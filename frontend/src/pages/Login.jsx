import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import ParticleBackground from "../components/ParticleBackground";
import BackgroundOrbs from "../components/BackgroundOrbs";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", position: "relative" }}>
      <BackgroundOrbs /><ParticleBackground />

      {/* left */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 60, position: "relative", zIndex: 10 }}>
        <div className="page-enter" style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 48 }}>
            <p className="mono neon-green neon-text" style={{ fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>// PrepWise</p>
            <h1 style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 1, color: "white", marginBottom: 12 }}>
              Welcome<br /><span className="neon-green neon-text">Back</span>
            </h1>
            <p className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>LOGIN TO CONTINUE YOUR MISSION</p>
          </div>

          {error && (
            <div style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 4, padding: "12px 16px", marginBottom: 20 }}>
              <p className="mono" style={{ color: "#ff6b6b", fontSize: 12, letterSpacing: 0.5 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: "EMAIL", name: "email", type: "email", placeholder: "user@example.com" },
              { label: "PASSWORD", name: "password", type: "password", placeholder: "••••••••" },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 20 }}>
                <label className="game-label" style={{ display: "block", marginBottom: 8 }}>{f.label}</label>
                <input className="input-neon" type={f.type} name={f.name} placeholder={f.placeholder}
                  value={form[f.name]} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} required />
              </div>
            ))}
            <button className="btn-neon" type="submit" disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 4, fontSize: 15, letterSpacing: 2, marginTop: 8 }}>
              {loading ? "AUTHENTICATING..." : "LOGIN →"}
            </button>
          </form>

          <p className="mono" style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
            NO ACCOUNT?{" "}
            <Link to="/register" style={{ color: "#00ffc8", textDecoration: "none" }}>REGISTER</Link>
          </p>
        </div>
      </div>

      {/* right */}
      <div style={{ flex: 1, borderLeft: "1px solid rgba(0,255,200,0.06)", display: "flex", alignItems: "center", justifyContent: "center", padding: 60, position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 360 }}>
          <p className="game-label" style={{ color: "rgba(0,255,200,0.4)", marginBottom: 32 }}>// SYSTEM CAPABILITIES</p>
          {[
            { icon: "◆", color: "#00ffc8", title: "Smart Eligibility Engine", desc: "Know exactly if you qualify before applying to any company" },
            { icon: "◈", color: "#a78bfa", title: "Adaptive Roadmap", desc: "Day-wise plan built around your exact skill gaps and level" },
            { icon: "◉", color: "#ffd700", title: "Company Mock Tests", desc: "Google, Amazon, Microsoft patterns with real DSA problems" },
            { icon: "◎", color: "#ff6b6b", title: "Consistency Tracker", desc: "Streaks, heatmaps and alerts to keep you disciplined" },
          ].map((f, i) => (
            <div key={i} className="neon-card" style={{ "--accent": f.color, padding: "18px 20px", marginBottom: 12, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 4, border: `1px solid ${f.color}30`, background: `${f.color}08`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, fontSize: 16, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "white", letterSpacing: 0.3, marginBottom: 4 }}>{f.title}</p>
                <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
