import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import ParticleBackground from "../components/ParticleBackground";
import BackgroundOrbs from "../components/BackgroundOrbs";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    degree: "BTech", background: "technical",
    skills: "", careerGoal: "",
    targetCompany: "Google", targetRole: "SWE",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills
          .replace(/ and /gi, ",")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
      };
      const res = await api.post("/auth/register", payload);
      register(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <BackgroundOrbs /><ParticleBackground />

      <div className="page-enter neon-card" style={{ width: "100%", maxWidth: 520, padding: "48px", position: "relative", zIndex: 10, "--accent": "#00ffc8" }}>
        <p className="mono neon-green" style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>// PrepWise</p>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, color: "white", marginBottom: 6 }}>
          Create <span className="neon-green neon-text">Account</span>
        </h1>
        <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 1, marginBottom: 32 }}>
          SET UP YOUR PROFILE AND START YOUR MISSION
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 2,
              background: step >= s ? "#00ffc8" : "rgba(255,255,255,0.06)",
              boxShadow: step >= s ? "0 0 8px rgba(0,255,200,0.4)" : "none",
              transition: "all 0.3s", borderRadius: 1,
            }} />
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 4, padding: "12px 16px", marginBottom: 20 }}>
            <p className="mono" style={{ color: "#ff6b6b", fontSize: 12 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          {step === 1 && (
            <div className="page-enter">
              <p className="game-label" style={{ color: "rgba(0,255,200,0.5)", marginBottom: 20 }}>STEP 01 — IDENTITY</p>

              <div style={{ marginBottom: 18 }}>
                <label className="game-label" style={{ display: "block", marginBottom: 8 }}>FULL NAME</label>
                <input className="input-neon" type="text" name="name" placeholder="your name"
                  value={form.name} onChange={handleChange} autoComplete="off" required />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="game-label" style={{ display: "block", marginBottom: 8 }}>EMAIL ADDRESS</label>
                <input className="input-neon" type="email" name="email" placeholder="user@example.com"
                  value={form.email} onChange={handleChange} autoComplete="off" required />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="game-label" style={{ display: "block", marginBottom: 8 }}>PASSWORD</label>
                <input className="input-neon" type="password" name="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange} autoComplete="new-password" required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                <div>
                  <label className="game-label" style={{ display: "block", marginBottom: 8 }}>DEGREE</label>
                  <select className="select-neon" name="degree" value={form.degree} onChange={handleChange}>
                    {["BTech","BCA","BCom","BSc","MCA","MBA","Other"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="game-label" style={{ display: "block", marginBottom: 8 }}>BACKGROUND</label>
                  <select className="select-neon" name="background" value={form.background} onChange={handleChange}>
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                </div>
              </div>

              <button type="button" className="btn-neon" onClick={() => {
                if (!form.name || !form.email || !form.password) {
                  setError("Please fill all fields before continuing");
                  return;
                }
                setError("");
                setStep(2);
              }} style={{ width: "100%", padding: 14, borderRadius: 4, fontSize: 14, letterSpacing: 2 }}>
                CONTINUE →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="page-enter">
              <p className="game-label" style={{ color: "rgba(0,255,200,0.5)", marginBottom: 20 }}>STEP 02 — MISSION BRIEF</p>

              <div style={{ marginBottom: 18 }}>
                <label className="game-label" style={{ display: "block", marginBottom: 8 }}>CURRENT SKILLS</label>
                <input className="input-neon" type="text" name="skills"
                  placeholder="Python, Java, SQL (comma separated)"
                  value={form.skills} onChange={handleChange} autoComplete="off" />
                <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 6, letterSpacing: 0.5 }}>
                  SEPARATE WITH COMMAS — e.g. Python, Java, SQL
                </p>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="game-label" style={{ display: "block", marginBottom: 8 }}>CAREER GOAL</label>
                <input className="input-neon" type="text" name="careerGoal"
                  placeholder="Software Engineer"
                  value={form.careerGoal} onChange={handleChange} autoComplete="off" required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <label className="game-label" style={{ display: "block", marginBottom: 8 }}>TARGET COMPANY</label>
                  <select className="select-neon" name="targetCompany" value={form.targetCompany} onChange={handleChange}>
                    {["Google","Amazon","Microsoft"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="game-label" style={{ display: "block", marginBottom: 8 }}>TARGET ROLE</label>
                  <select className="select-neon" name="targetRole" value={form.targetRole} onChange={handleChange}>
                    {["SWE","Data Analyst"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => { setError(""); setStep(1); }} style={{
                  flex: 1, padding: 14, borderRadius: 4, fontSize: 13, letterSpacing: 1.5,
                  background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.4)", cursor: "pointer",
                  fontFamily: "Rajdhani, sans-serif", fontWeight: 700,
                }}>← BACK</button>
                <button type="submit" className="btn-neon" disabled={loading} style={{ flex: 2, padding: 14, borderRadius: 4, fontSize: 14, letterSpacing: 2 }}>
                  {loading ? "INITIALIZING..." : "LAUNCH →"}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mono" style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>
          ALREADY REGISTERED?{" "}
          <Link to="/login" style={{ color: "#00ffc8", textDecoration: "none" }}>LOGIN</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
