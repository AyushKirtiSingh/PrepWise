import { useState, useEffect } from "react";
import api from "../utils/api";

const TOPICS = ["all", "DSA", "DBMS", "OS", "System Design"];
const DIFFS = ["all", "easy", "medium", "hard"];

const NC = ({ children, accent = "#00ffc8", style = {} }) => (
  <div className="neon-card" style={{ "--accent": accent, padding: 24, ...style }}>{children}</div>
);

const Practice = () => {
  const [mode, setMode] = useState("stats");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [topic, setTopic] = useState("all");
  const [diff, setDiff] = useState("all");
  const [records, setRecords] = useState(null);
  const [topicAnalysis, setTopicAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const fetchStats = async () => {
    try {
      const [r, t] = await Promise.all([api.get("/practice"), api.get("/practice/topics")]);
      setRecords(r.data); setTopicAnalysis(t.data.topicAnalysis || []);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const start = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/practice/questions?topic=${topic}&difficulty=${diff}`);
      setQuestions(r.data.questions); setCurrent(0); setSelected(null); setResult(null);
      setScore({ correct: 0, wrong: 0 }); setStartTime(Date.now()); setMode("quiz");
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const answer = async (idx) => {
    if (selected !== null) return;
    setSelected(idx); setSubmitting(true);
    const time = Math.round((Date.now() - startTime) / 1000);
    try {
      const r = await api.post("/practice/submit", { questionId: questions[current].id, userAnswerIndex: idx, topic: questions[current].topic, type: questions[current].type, difficulty: questions[current].difficulty, timeTaken: time });
      setResult(r.data);
      if (r.data.isCorrect) setScore(s => ({ ...s, correct: s.correct + 1 }));
      else setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    } catch (e) { console.log(e); }
    setSubmitting(false);
  };

  const next = () => {
    if (current + 1 >= questions.length) { fetchStats(); setMode("done"); }
    else { setCurrent(c => c + 1); setSelected(null); setResult(null); setStartTime(Date.now()); }
  };

  const sc = (s) => s === "strong" ? "#00ffc8" : s === "average" ? "#ffd700" : "#ff6b6b";

  if (mode === "quiz" && questions.length > 0) {
    const q = questions[current];
    return (
      <div className="page-enter" style={{ maxWidth: 780, margin: "0 auto", padding: "40px 40px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <p className="mono" style={{ fontSize: 11, color: "rgba(0,255,200,0.4)", letterSpacing: 2, marginBottom: 6 }}>// PRACTICE SESSION</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "white" }}>QUESTION {current + 1}<span className="mono" style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}> / {questions.length}</span></p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <span className="tag-neon-green" style={{ fontSize: 12, padding: "6px 14px", borderRadius: 2, letterSpacing: 1 }}>✓ {score.correct}</span>
            <span className="tag-neon-red" style={{ fontSize: 12, padding: "6px 14px", borderRadius: 2, letterSpacing: 1 }}>✗ {score.wrong}</span>
          </div>
        </div>

        <div className="neon-bar" style={{ marginBottom: 28 }}>
          <div className="neon-bar-fill" style={{ width: `${((current + 1) / questions.length) * 100}%`, background: "#00ffc8", boxShadow: "0 0 8px rgba(0,255,200,0.4)" }} />
        </div>

        <NC accent="#00ffc8" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span className="tag-neon-green" style={{ fontSize: 9, padding: "3px 10px", borderRadius: 2, letterSpacing: 1 }}>{q.topic}</span>
            <span style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 9, padding: "3px 10px", borderRadius: 2, fontFamily: "Share Tech Mono, monospace", letterSpacing: 1 }}>{q.type.toUpperCase()}</span>
            <span style={{ background: q.difficulty === "hard" ? "rgba(255,107,107,0.06)" : q.difficulty === "medium" ? "rgba(255,215,0,0.06)" : "rgba(0,255,200,0.06)", color: q.difficulty === "hard" ? "#ff6b6b" : q.difficulty === "medium" ? "#ffd700" : "#00ffc8", border: `1px solid ${q.difficulty === "hard" ? "rgba(255,107,107,0.2)" : q.difficulty === "medium" ? "rgba(255,215,0,0.2)" : "rgba(0,255,200,0.2)"}`, fontSize: 9, padding: "3px 10px", borderRadius: 2, fontFamily: "Share Tech Mono, monospace", letterSpacing: 1 }}>{q.difficulty.toUpperCase()}</span>
          </div>

          <p style={{ fontSize: 18, fontWeight: 600, color: "white", lineHeight: 1.5, marginBottom: 12, letterSpacing: 0.2 }}>{q.question}</p>

          {q.description && (
            <div style={{ background: "rgba(0,255,200,0.02)", border: "1px solid rgba(0,255,200,0.08)", borderRadius: 4, padding: "12px 16px", marginBottom: 16 }}>
              <p className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{q.description}</p>
              {q.leetcode && (
                <a href={q.leetcode} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, fontSize: 11, color: "#ffd700", textDecoration: "none", background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.2)", padding: "4px 12px", borderRadius: 2, fontFamily: "Share Tech Mono, monospace", letterSpacing: 1 }}>
                  SOLVE ON LEETCODE ↗
                </a>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, i) => {
              let bg = "rgba(255,255,255,0.02)", border = "rgba(255,255,255,0.06)", color = "rgba(255,255,255,0.5)";
              if (selected !== null) {
                if (result?.isCorrect && i === selected) { bg = "rgba(0,255,200,0.06)"; border = "rgba(0,255,200,0.3)"; color = "#00ffc8"; }
                else if (!result?.isCorrect && i === selected) { bg = "rgba(255,107,107,0.06)"; border = "rgba(255,107,107,0.3)"; color = "#ff6b6b"; }
              }
              return (
                <button key={i} onClick={() => answer(i)} disabled={selected !== null || submitting} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 4, padding: "12px 16px", textAlign: "left", fontSize: 14, fontWeight: 600, color, cursor: selected !== null ? "default" : "pointer", transition: "all 0.15s", display: "flex", gap: 12, alignItems: "center", fontFamily: "Rajdhani, sans-serif", letterSpacing: 0.3 }}>
                  <span className="mono" style={{ width: 24, height: 24, borderRadius: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>
                    {["A","B","C","D"][i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {result && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: result.isCorrect ? "rgba(0,255,200,0.04)" : "rgba(255,107,107,0.04)", border: `1px solid ${result.isCorrect ? "rgba(0,255,200,0.2)" : "rgba(255,107,107,0.2)"}`, borderRadius: 4 }}>
              <p className="mono" style={{ fontSize: 12, color: result.isCorrect ? "#00ffc8" : "#ff6b6b", letterSpacing: 0.5 }}>{result.explanation.toUpperCase()}</p>
            </div>
          )}
        </NC>

        {result && (
          <button onClick={next} className="btn-neon" style={{ width: "100%", padding: 14, borderRadius: 4, fontSize: 14, letterSpacing: 2 }}>
            {current + 1 >= questions.length ? "VIEW RESULTS →" : "NEXT QUESTION →"}
          </button>
        )}
      </div>
    );
  }

  if (mode === "done") return (
    <div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", padding: "40px 40px", position: "relative", zIndex: 10 }}>
      <NC style={{ textAlign: "center", padding: 56 }}>
        <p className="mono neon-green neon-text" style={{ fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>// SESSION COMPLETE</p>
        <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, color: "white", marginBottom: 28 }}>
          {Math.round((score.correct / questions.length) * 100)}% <span className="neon-green">ACCURACY</span>
        </h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 32 }}>
          <NC accent="#00ffc8" style={{ padding: "20px 32px" }}>
            <p className="game-label" style={{ marginBottom: 8 }}>CORRECT</p>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#00ffc8", textShadow: "0 0 15px rgba(0,255,200,0.4)" }}>{score.correct}</p>
          </NC>
          <NC accent="#ff6b6b" style={{ padding: "20px 32px" }}>
            <p className="game-label" style={{ marginBottom: 8 }}>WRONG</p>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#ff6b6b", textShadow: "0 0 15px rgba(255,107,107,0.4)" }}>{score.wrong}</p>
          </NC>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={start} className="btn-neon" style={{ flex: 1, padding: 12, borderRadius: 4, fontSize: 13, letterSpacing: 1.5 }}>PRACTICE AGAIN →</button>
          <button onClick={() => setMode("stats")} style={{ flex: 1, padding: 12, borderRadius: 4, fontSize: 13, letterSpacing: 1.5, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>VIEW STATS</button>
        </div>
      </NC>
    </div>
  );

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px", position: "relative", zIndex: 10 }}>
      <div style={{ marginBottom: 40 }}>
        <p className="mono" style={{ fontSize: 11, color: "rgba(0,255,200,0.4)", letterSpacing: 3, marginBottom: 10 }}>// TRAINING MODULE</p>
        <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1, color: "white", marginBottom: 6 }}>Practice <span className="neon-green neon-text">Arena</span></h1>
        <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>ANSWER REAL MCQs AND DSA PROBLEMS · TRACK PERFORMANCE</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "TOTAL SOLVED", value: records?.total || 0, accent: "#00ffc8" },
          { label: "CORRECT", value: records?.correct || 0, accent: "#34d399" },
          { label: "WRONG", value: records?.wrong || 0, accent: "#ff6b6b" },
          { label: "ACCURACY", value: `${records?.accuracy || 0}%`, accent: "#a78bfa" },
        ].map(s => (
          <NC key={s.label} accent={s.accent}>
            <p className="game-label" style={{ marginBottom: 10 }}>{s.label}</p>
            <p className="neon-text" style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1, color: s.accent, textShadow: `0 0 20px ${s.accent}60` }}>{s.value}</p>
          </NC>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <NC accent="#00ffc8">
          <p className="game-label" style={{ marginBottom: 20 }}>// CONFIGURE SESSION</p>
          <div style={{ marginBottom: 16 }}>
            <p className="game-label" style={{ marginBottom: 10 }}>SELECT TOPIC</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TOPICS.map(t => (
                <button key={t} onClick={() => setTopic(t)} className="mono" style={{ padding: "6px 14px", borderRadius: 2, border: `1px solid ${topic === t ? "rgba(0,255,200,0.4)" : "rgba(255,255,255,0.06)"}`, background: topic === t ? "rgba(0,255,200,0.06)" : "transparent", color: topic === t ? "#00ffc8" : "rgba(255,255,255,0.3)", fontSize: 10, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.15s", textShadow: topic === t ? "0 0 8px rgba(0,255,200,0.4)" : "none" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <p className="game-label" style={{ marginBottom: 10 }}>DIFFICULTY</p>
            <div style={{ display: "flex", gap: 6 }}>
              {DIFFS.map(d => (
                <button key={d} onClick={() => setDiff(d)} className="mono" style={{ padding: "6px 14px", borderRadius: 2, border: `1px solid ${diff === d ? "rgba(0,255,200,0.4)" : "rgba(255,255,255,0.06)"}`, background: diff === d ? "rgba(0,255,200,0.06)" : "transparent", color: diff === d ? "#00ffc8" : "rgba(255,255,255,0.3)", fontSize: 10, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.15s" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={start} disabled={loading} className="btn-neon" style={{ width: "100%", padding: 14, borderRadius: 4, fontSize: 14, letterSpacing: 2 }}>
            START PRACTICE →
          </button>
          <div style={{ marginTop: 16, padding: 14, background: "rgba(255,255,255,0.02)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="game-label" style={{ marginBottom: 10 }}>EXTERNAL PLATFORMS</p>
            {[
              { name: "LEETCODE", url: "https://leetcode.com", color: "#ffd700" },
              { name: "GFG", url: "https://geeksforgeeks.org", color: "#00ffc8" },
              { name: "HACKERRANK", url: "https://hackerrank.com", color: "#a78bfa" },
              { name: "INTERVIEWBIT", url: "https://interviewbit.com", color: "#34d399" },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", margin: "3px 4px", padding: "3px 10px", background: "rgba(255,255,255,0.03)", color: s.color, borderRadius: 2, fontSize: 10, textDecoration: "none", border: `1px solid ${s.color}20`, fontFamily: "Share Tech Mono, monospace", letterSpacing: 1 }}>
                {s.name} ↗
              </a>
            ))}
          </div>
        </NC>

        <NC accent="#a78bfa">
          <p className="game-label" style={{ marginBottom: 20 }}>// TOPIC PERFORMANCE</p>
          {topicAnalysis.length === 0 ? (
            <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>NO RECORDS YET. START PRACTICING!</p>
          ) : (
            <div>
              {topicAnalysis.map(t => (
                <div key={t.topic} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "white", letterSpacing: 0.3 }}>{t.topic}</p>
                      <span className="mono" style={{ fontSize: 9, padding: "2px 8px", borderRadius: 2, letterSpacing: 1, background: `${sc(t.status)}10`, color: sc(t.status), border: `1px solid ${sc(t.status)}30` }}>{t.status.toUpperCase()}</span>
                    </div>
                    <p className="mono neon-text" style={{ fontSize: 13, fontWeight: 700, color: sc(t.status), textShadow: `0 0 8px ${sc(t.status)}60` }}>{t.accuracy}%</p>
                  </div>
                  <div className="neon-bar">
                    <div className="neon-bar-fill" style={{ width: `${t.accuracy}%`, background: sc(t.status), boxShadow: `0 0 8px ${sc(t.status)}60` }} />
                  </div>
                  <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4, letterSpacing: 0.5 }}>{t.correct}/{t.total} CORRECT</p>
                </div>
              ))}
            </div>
          )}
        </NC>
      </div>

      {records?.records?.length > 0 && (
        <NC accent="#ffd700">
          <p className="game-label" style={{ marginBottom: 16 }}>// RECENT HISTORY</p>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {["QUESTION ID","TOPIC","RESULT","DIFFICULTY","TIME"].map(h => (
                <p key={h} className="game-label">{h}</p>
              ))}
            </div>
            {records.records.slice(0, 8).map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 0.5 }}>{r.questionId}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{r.topic}</p>
                <span className="mono" style={{ fontSize: 10, padding: "2px 8px", borderRadius: 2, letterSpacing: 1, background: r.isCorrect ? "rgba(0,255,200,0.06)" : "rgba(255,107,107,0.06)", color: r.isCorrect ? "#00ffc8" : "#ff6b6b", border: `1px solid ${r.isCorrect ? "rgba(0,255,200,0.2)" : "rgba(255,107,107,0.2)"}`, display: "inline-block", width: "fit-content" }}>{r.isCorrect ? "CORRECT" : "WRONG"}</span>
                <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 0.5 }}>{r.difficulty.toUpperCase()}</p>
                <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{r.timeTaken}S</p>
              </div>
            ))}
          </div>
        </NC>
      )}
    </div>
  );
};

export default Practice;
