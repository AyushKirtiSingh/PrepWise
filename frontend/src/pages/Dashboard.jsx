import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import BackgroundOrbs from "../components/BackgroundOrbs";
import ParticleBackground from "../components/ParticleBackground";

const NeonCard = ({ children, accent = "#00ffc8", style = {}, hover = true }) => (
  <div className="neon-card" style={{ "--accent": accent, padding: 28, ...style }}>
    {children}
  </div>
);

const StatCard = ({ label, value, sub, accent = "#00ffc8", barWidth = 0 }) => (
  <NeonCard accent={accent}>
    <p className="game-label" style={{ marginBottom: 12 }}>{label}</p>
    <p className="neon-text" style={{ fontSize: 44, fontWeight: 700, letterSpacing: -2, lineHeight: 1, color: accent, textShadow: `0 0 20px ${accent}60`, marginBottom: 6 }}>{value}</p>
    {sub && <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5 }}>{sub}</p>}
    {barWidth > 0 && (
      <div className="neon-bar">
        <div className="neon-bar-fill" style={{ width: `${barWidth}%`, background: accent, boxShadow: `0 0 8px ${accent}80` }} />
      </div>
    )}
  </NeonCard>
);

const NeonTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="neon-card" style={{ "--accent": "#00ffc8", padding: "8px 14px" }}>
      <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 3, letterSpacing: 1 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: "#00ffc8" }}>{payload[0].value}%</p>
    </div>
  );
  return null;
};

const Loader = ({ text = "LOADING SYSTEM..." }) => (
  <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
    <BackgroundOrbs /><ParticleBackground />
    <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
      <div style={{ width: 40, height: 40, border: "2px solid rgba(0,255,200,0.15)", borderTopColor: "#00ffc8", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px", boxShadow: "0 0 12px rgba(0,255,200,0.2)" }} />
      <p className="mono" style={{ fontSize: 11, color: "rgba(0,255,200,0.4)", letterSpacing: 2 }}>{text}</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  </div>
);

const Dashboard = () => {
  const { isNewUser, setIsNewUser } = useAuth();
  const [data, setData] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [initMessage, setInitMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        // auto generate roadmap for new users
        if (isNewUser) {
          setGeneratingRoadmap(true);
          setInitMessage("INITIALIZING YOUR ROADMAP...");
          try {
            await api.post("/roadmap/generate");
          } catch (e) {
            console.log("Roadmap generation error:", e.message);
          }
          setIsNewUser(false);
          setGeneratingRoadmap(false);
          setInitMessage("");
        }

        const [dashRes, testRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/mocktest"),
        ]);
        setData(dashRes.data);
        setTests(testRes.data.tests || []);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (generatingRoadmap) return <Loader text={initMessage} />;
  if (loading) return <Loader text="LOADING DASHBOARD..." />;
  if (!data) return <Loader text="ERROR LOADING DATA..." />;

  const testChartData = tests.slice().reverse().map((t, i) => ({ name: `T${i + 1}`, accuracy: t.accuracy }));
  const topicData = data.skillInsights.topicAnalysis.map(t => ({
    name: t.topic.toUpperCase().substring(0, 6),
    accuracy: t.accuracy,
    fill: t.accuracy >= 80 ? "#00ffc8" : t.accuracy >= 50 ? "#ffd700" : "#ff6b6b",
  }));
  const heatmap = Array(28).fill(0).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split("T")[0] === data.consistencyStats.lastActive ? 1 : 0;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
      <BackgroundOrbs /><ParticleBackground />
      <div className="page-enter" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px", position: "relative", zIndex: 10 }}>

        {/* header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(0,255,200,0.15)", padding: "6px 18px", borderRadius: 2, marginBottom: 20, background: "rgba(0,255,200,0.03)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffc8", boxShadow: "0 0 8px #00ffc8", animation: "blink 1.5s infinite" }} />
            <p className="mono" style={{ fontSize: 11, color: "rgba(0,255,200,0.6)", letterSpacing: 2 }}>
              TARGET: {data.user.targetRole} @ {data.user.targetCompany} · {data.user.degree}
            </p>
          </div>
          <h1 style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2, lineHeight: 0.95, marginBottom: 12 }}>
            <span style={{ color: "white" }}>Welcome back,</span><br />
            <span className="neon-green neon-text">{data.user.name}</span>
          </h1>
          <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 2 }}>
            // STREAK: {data.consistencyStats.currentStreak} DAYS · READINESS: {data.readinessScore}% · TESTS: {data.testStats.totalTests}
          </p>
        </div>

        {/* hero */}
        <NeonCard accent="#00ffc8" hover={false} style={{ marginBottom: 20, padding: "36px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <p className="game-label" style={{ marginBottom: 12 }}>OVERALL READINESS SCORE</p>
              <p style={{ fontSize: 88, fontWeight: 700, letterSpacing: -4, lineHeight: 1, color: "#00ffc8", textShadow: "0 0 40px rgba(0,255,200,0.4)", marginBottom: 12 }}>
                {data.readinessScore}<span style={{ fontSize: 32, color: "rgba(0,255,200,0.4)" }}>%</span>
              </p>
              <p className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: 1, marginBottom: 16 }}>
                {data.readinessMessage.toUpperCase()}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="tag-neon-green" style={{ fontSize: 10, padding: "4px 12px", borderRadius: 2, letterSpacing: 1 }}>
                  {data.testStats.latestLevel.toUpperCase()}
                </span>
                <span className="tag-neon-purple" style={{ fontSize: 10, padding: "4px 12px", borderRadius: 2, letterSpacing: 1 }}>
                  {data.testStats.trend.toUpperCase()} TREND
                </span>
              </div>
            </div>
            <div>
              <p className="game-label" style={{ marginBottom: 12, textAlign: "right" }}>ROADMAP PROGRESS</p>
              <NeonCard accent="#a78bfa" hover={false} style={{ padding: "24px 28px", minWidth: 200 }}>
                <p className="game-label" style={{ marginBottom: 8 }}>DAYS COMPLETED</p>
                <p style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, color: "#a78bfa", textShadow: "0 0 20px rgba(167,139,250,0.4)" }}>
                  {data.roadmapProgress.completedDays}
                  <span style={{ fontSize: 18, color: "rgba(255,255,255,0.2)" }}>/{data.roadmapProgress.totalDays}</span>
                </p>
                <div className="neon-bar">
                  <div className="neon-bar-fill" style={{ width: `${data.roadmapProgress.progressPercent}%`, background: "#a78bfa", boxShadow: "0 0 8px rgba(167,139,250,0.5)" }} />
                </div>
                <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8, letterSpacing: 1 }}>
                  {data.roadmapProgress.progressPercent}% COMPLETE
                </p>
              </NeonCard>
            </div>
          </div>
        </NeonCard>

        {/* stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
          <StatCard label="QUESTIONS SOLVED" value={data.practiceStats.totalSolved} sub={`${data.practiceStats.accuracy}% ACCURACY`} accent="#00ffc8" barWidth={data.practiceStats.accuracy} />
          <StatCard label="TESTS TAKEN" value={data.testStats.totalTests} sub={`LATEST: ${data.testStats.latestAccuracy}%`} accent="#a78bfa" barWidth={data.testStats.latestAccuracy} />
          <StatCard label="CURRENT STREAK" value={`${data.consistencyStats.currentStreak}D`} sub="🔥 KEEP IT GOING" accent="#ff6b6b" barWidth={Math.min(data.consistencyStats.currentStreak * 7, 100)} />
          <StatCard label="TREND" value={data.testStats.trend.toUpperCase()} sub="BASED ON LAST 2 TESTS" accent="#ffd700" barWidth={60} />
        </div>

        {/* charts row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
          <NeonCard accent="#00ffc8">
            <p className="game-label" style={{ marginBottom: 20 }}>// TEST ACCURACY OVER TIME</p>
            {testChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={testChartData}>
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "Share Tech Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "Share Tech Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<NeonTooltip />} />
                  <Line type="monotone" dataKey="accuracy" stroke="#00ffc8" strokeWidth={2} dot={{ fill: "#00ffc8", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>NO DATA YET — TAKE A TEST</p>
              </div>
            )}
          </NeonCard>

          <NeonCard accent="#ffd700">
            <p className="game-label" style={{ marginBottom: 20 }}>// TOPIC PERFORMANCE</p>
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={topicData} barSize={18}>
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontFamily: "Share Tech Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontFamily: "Share Tech Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<NeonTooltip />} />
                  <Bar dataKey="accuracy" radius={[2, 2, 0, 0]}>
                    {topicData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>NO DATA YET — START PRACTICING</p>
              </div>
            )}
          </NeonCard>

          <NeonCard accent="#ff6b6b">
            <p className="game-label" style={{ marginBottom: 20 }}>// ACTIVITY · 28 DAYS</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(14,1fr)", gap: 3, marginBottom: 20 }}>
              {heatmap.map((v, i) => (
                <div key={i} style={{ height: 16, borderRadius: 2, background: v ? "#00ffc8" : "rgba(255,255,255,0.04)", boxShadow: v ? "0 0 6px rgba(0,255,200,0.4)" : "none" }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <p className="game-label" style={{ marginBottom: 6 }}>STREAK</p>
                <p className="neon-red neon-text" style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>{data.consistencyStats.currentStreak}D</p>
              </div>
              <div>
                <p className="game-label" style={{ marginBottom: 6 }}>LAST ACTIVE</p>
                <p className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                  {data.consistencyStats.lastActive || "NOT YET"}
                </p>
              </div>
            </div>
          </NeonCard>
        </div>

        {/* skill insights + feedback */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <NeonCard accent="#a78bfa">
            <p className="game-label" style={{ marginBottom: 20 }}>// SKILL MATRIX</p>
            <div style={{ marginBottom: 20 }}>
              <p className="game-label" style={{ color: "rgba(0,255,200,0.4)", marginBottom: 10 }}>STRONG TOPICS</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.skillInsights.strongTopics.length > 0
                  ? data.skillInsights.strongTopics.map(t => (
                    <span key={t} className="tag-neon-green" style={{ fontSize: 11, padding: "4px 12px", borderRadius: 2, letterSpacing: 1 }}>{t.toUpperCase()}</span>
                  ))
                  : <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>NONE YET — START PRACTICING</p>}
              </div>
            </div>
            <div>
              <p className="game-label" style={{ color: "rgba(255,107,107,0.4)", marginBottom: 10 }}>WEAK TOPICS</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.skillInsights.weakTopics.length > 0
                  ? data.skillInsights.weakTopics.map(t => (
                    <span key={t} className="tag-neon-red" style={{ fontSize: 11, padding: "4px 12px", borderRadius: 2, letterSpacing: 1 }}>{t.toUpperCase()}</span>
                  ))
                  : <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>NONE YET — TAKE A MOCK TEST</p>}
              </div>
            </div>
          </NeonCard>

          <NeonCard accent="#ffd700">
            <p className="game-label" style={{ marginBottom: 20 }}>// LAST TEST FEEDBACK</p>
            {data.testStats.latestFeedback
              ? data.testStats.latestFeedback.split(" | ").map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.includes("Excellent") || f.includes("Improved") ? "#00ffc8" : f.includes("Focus") ? "#ff6b6b" : "#ffd700", boxShadow: f.includes("Excellent") ? "0 0 6px #00ffc8" : "none", marginTop: 5, flexShrink: 0 }} />
                  <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, letterSpacing: 0.5 }}>{f.toUpperCase()}</p>
                </div>
              ))
              : <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>TAKE A MOCK TEST TO GET FEEDBACK</p>}
          </NeonCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
