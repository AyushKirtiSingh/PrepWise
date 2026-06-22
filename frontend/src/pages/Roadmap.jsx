import { useState, useEffect } from "react";
import api from "../utils/api";

const NC = ({ children, accent = "#00ffc8", style = {}, hover = true, onClick }) => (
  <div onClick={onClick} className="neon-card" style={{ "--accent": accent, padding: 24, cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completing, setCompleting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetch = async () => {
    try { const r = await api.get("/roadmap"); setRoadmap(r.data.roadmap); }
    catch { setRoadmap(null); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const generate = async () => {
    setGenerating(true);
    try { await api.post("/roadmap/generate"); await fetch(); }
    catch (e) { console.log(e); }
    setGenerating(false);
  };

  const complete = async (day) => {
    setCompleting(day);
    try {
      await api.patch(`/roadmap/complete/${day}`);
      await api.post("/consistency/log", { activity: `Completed Day ${day} of roadmap` });
      fetch();
    } catch (e) { console.log(e); }
    setCompleting(null);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", position: "relative", zIndex: 10 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(0,255,200,0.15)", borderTopColor: "#00ffc8", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px", boxShadow: "0 0 12px rgba(0,255,200,0.2)" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  const done = roadmap?.plan?.filter(p => p.isCompleted).length || 0;
  const total = roadmap?.totalDays || 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="page-enter" style={{ maxWidth: 960, margin: "0 auto", padding: "40px 40px", position: "relative", zIndex: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
        <div>
          <p className="mono" style={{ fontSize: 11, color: "rgba(0,255,200,0.4)", letterSpacing: 3, marginBottom: 10 }}>// LEARNING PATH</p>
          <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1, color: "white", marginBottom: 6 }}>Your <span className="neon-green neon-text">Roadmap</span></h1>
          <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>CLICK ANY DAY TO SEE RESOURCES AND LECTURES</p>
        </div>
        <button onClick={generate} disabled={generating} className="btn-neon" style={{ padding: "10px 20px", borderRadius: 4, fontSize: 13, letterSpacing: 1.5 }}>
          {generating ? "GENERATING..." : "↺ REGENERATE"}
        </button>
      </div>

      {!roadmap ? (
        <NC style={{ textAlign: "center", padding: 64 }}>
          <p className="mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 24 }}>NO ROADMAP FOUND. INITIALIZE YOUR PLAN.</p>
          <button onClick={generate} disabled={generating} className="btn-neon" style={{ padding: "12px 28px", borderRadius: 4, fontSize: 14, letterSpacing: 2 }}>
            {generating ? "GENERATING..." : "GENERATE ROADMAP →"}
          </button>
        </NC>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
            {[
              { label: "TOTAL DAYS", value: total, accent: "#00ffc8" },
              { label: "COMPLETED", value: done, accent: "#34d399" },
              { label: "REMAINING", value: total - done, accent: "#ffd700" },
              { label: "PROGRESS", value: `${pct}%`, accent: "#a78bfa" },
            ].map(s => (
              <NC key={s.label} accent={s.accent}>
                <p className="game-label" style={{ marginBottom: 10 }}>{s.label}</p>
                <p className="neon-text" style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1, color: s.accent, textShadow: `0 0 20px ${s.accent}60` }}>{s.value}</p>
              </NC>
            ))}
          </div>

          <NC accent="#00ffc8" hover={false} style={{ marginBottom: 20, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p className="game-label">MISSION PROGRESS</p>
              <p className="mono neon-green" style={{ fontSize: 11, letterSpacing: 1 }}>{pct}%</p>
            </div>
            <div className="neon-bar">
              <div className="neon-bar-fill" style={{ width: `${pct}%`, background: "#00ffc8", boxShadow: "0 0 10px rgba(0,255,200,0.4)" }} />
            </div>
          </NC>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roadmap.plan?.map(day => (
              <div key={day.day} style={{
                background: day.isCompleted ? "rgba(52,211,153,0.03)" : "rgba(255,255,255,0.015)",
                border: `1px solid ${expanded === day.day ? "rgba(0,255,200,0.3)" : day.isCompleted ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: 4, overflow: "hidden",
                boxShadow: expanded === day.day ? "0 0 20px rgba(0,255,200,0.05)" : "none",
                transition: "all 0.2s",
              }}>
                <div onClick={() => setExpanded(expanded === day.day ? null : day.day)} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, border: `1px solid ${day.isCompleted ? "rgba(52,211,153,0.4)" : "rgba(0,255,200,0.2)"}`, background: day.isCompleted ? "rgba(52,211,153,0.1)" : "rgba(0,255,200,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Share Tech Mono, monospace", fontSize: 13, fontWeight: 700, color: day.isCompleted ? "#34d399" : "#00ffc8", textShadow: `0 0 8px ${day.isCompleted ? "#34d399" : "#00ffc8"}`, flexShrink: 0 }}>
                    {day.isCompleted ? "✓" : String(day.day).padStart(2, "0")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: day.isCompleted ? "#34d399" : "white", letterSpacing: 0.3, marginBottom: 6 }}>DAY {day.day} — {day.topic.toUpperCase()}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {day.tasks.map((t, i) => (
                        <span key={i} className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "1px 8px", borderRadius: 2, letterSpacing: 0.5 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {day.resources && <span className="tag-neon-green" style={{ fontSize: 9, padding: "3px 8px", borderRadius: 2, letterSpacing: 1 }}>RESOURCES</span>}
                    <span className="mono" style={{ color: "rgba(255,255,255,0.2)", fontSize: 16, transition: "transform 0.2s", transform: expanded === day.day ? "rotate(180deg)" : "none", display: "inline-block" }}>⌃</span>
                  </div>
                </div>

                {expanded === day.day && (
                  <div className="page-enter" style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    {day.resources ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                        <div>
                          <p className="game-label" style={{ color: "rgba(239,68,68,0.5)", marginBottom: 12 }}>▶ YOUTUBE LECTURES</p>
                          {day.resources.youtube?.map((v, i) => (
                            <a key={i} href={v.url} target="_blank" rel="noreferrer" style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "rgba(239,68,68,0.03)", borderRadius: 4, marginBottom: 8, textDecoration: "none", border: "1px solid rgba(239,68,68,0.1)", transition: "border-color 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"}
                              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(239,68,68,0.1)"}>
                              <div style={{ width: 30, height: 30, background: "#ef4444", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 8px rgba(239,68,68,0.3)" }}>
                                <span style={{ color: "white", fontSize: 12 }}>▶</span>
                              </div>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 2 }}>{v.title}</p>
                                <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5 }}>{v.channel}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                        <div>
                          <p className="game-label" style={{ color: "rgba(0,255,200,0.5)", marginBottom: 12 }}>◈ PRACTICE PROBLEMS</p>
                          {day.resources.practice?.map((p, i) => (
                            <a key={i} href={p.url} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(0,255,200,0.02)", borderRadius: 4, marginBottom: 8, textDecoration: "none", border: "1px solid rgba(0,255,200,0.08)", transition: "border-color 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,200,0.25)"}
                              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,255,200,0.08)"}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{p.title}</p>
                              <span className="tag-neon-green" style={{ fontSize: 9, padding: "3px 8px", borderRadius: 2, flexShrink: 0, marginLeft: 8, letterSpacing: 1 }}>{p.source} ↗</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 16, letterSpacing: 1 }}>NO ADDITIONAL RESOURCES FOR THIS DAY</p>
                    )}
                    {!day.isCompleted && (
                      <button onClick={() => complete(day.day)} disabled={completing === day.day} className="btn-neon" style={{ marginTop: 14, padding: "8px 18px", borderRadius: 4, fontSize: 12, letterSpacing: 1.5 }}>
                        {completing === day.day ? "SAVING..." : "✓ MARK COMPLETE"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Roadmap;
