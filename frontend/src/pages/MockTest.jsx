import { useState, useEffect, useRef } from "react";
import api from "../utils/api";

const MockTest = () => {
  const [phase, setPhase] = useState("idle");
  const [pattern, setPattern] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patternRes, historyRes] = await Promise.all([
          api.get("/mocktest/pattern"),
          api.get("/mocktest"),
        ]);
        setPattern(patternRes.data);
        setQuestions(patternRes.data.questions);
        setTimeLeft(patternRes.data.duration);
        setHistory(historyRes.data.tests || []);
      } catch (err) { console.log(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const startTest = async () => {
    // fetch fresh questions every time
    try {
      const res = await api.get("/mocktest/pattern");
      setPattern(res.data);
      setQuestions(res.data.questions);
      setTimeLeft(res.data.duration);
      setAnswers({});
      setResult(null);
      setPhase("active");
    } catch (err) { console.log(err); }
  };

  const handleAnswer = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setPhase("submitting");
    setSubmitting(true);

    const timeTaken = pattern.duration - timeLeft;

    const answersPayload = questions.map((q, i) => {
      const userAnswer = answers[i];
      // find correct answer from question bank
      const correctAnswer = q.answer !== undefined ? q.answer : -1;
      return {
        questionId: q.id,
        topic: q.topic,
        type: q.type,
        userAnswerIndex: userAnswer !== undefined ? userAnswer : -1,
        isCorrect: userAnswer === correctAnswer,
      };
    });

    try {
      const res = await api.post("/mocktest/submit", {
        answers: answersPayload,
        timeTaken,
        company: pattern.company,
      });
      await api.post("/consistency/log", { activity: `Completed ${pattern.company} mock test` });
      setResult(res.data.result);
      setHistory(prev => [res.data.result, ...prev]);
      setPhase("result");
    } catch (err) { console.log(err); }
    setSubmitting(false);
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const timePercent = pattern ? (timeLeft / pattern.duration) * 100 : 100;
  const timerColor = timePercent > 50 ? "#7c6af7" : timePercent > 20 ? "#f59e0b" : "#ef4444";

  const Card = ({ children, style = {} }) => (
    <div style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: "12px", padding: "18px 20px", ...style }}>
      {children}
    </div>
  );

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid #2a2a35", borderTopColor: "#7c6af7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ─── ACTIVE TEST ───────────────────────────────────
  if (phase === "active") return (
    <div className="page-transition" style={{ maxWidth: "860px", margin: "0 auto", padding: "20px" }}>
      {/* sticky header */}
      <div style={{ position: "sticky", top: "56px", zIndex: 50, background: "#0f0f13", paddingBottom: "12px", paddingTop: "8px" }}>
        <div style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: "12px", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#f0f0f5" }}>{pattern?.company} Mock Test</p>
            <p style={{ fontSize: "12px", color: "#555" }}>{Object.keys(answers).length}/{questions.length} answered</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* progress dots */}
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "200px" }}>
              {questions.map((_, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: answers[i] !== undefined ? "#7c6af7" : "#2a2a35", transition: "background 0.2s" }}/>
              ))}
            </div>
            {/* timer */}
            <div style={{ background: "#1e1e28", border: `1px solid ${timerColor}`, borderRadius: "8px", padding: "8px 14px", minWidth: "90px", textAlign: "center" }}>
              <p style={{ fontSize: "20px", fontWeight: "700", color: timerColor, fontFamily: "monospace" }}>{formatTime(timeLeft)}</p>
            </div>
            <button onClick={handleSubmit} disabled={submitting} style={{ background: "#7c6af7", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "500" }}>
              Submit
            </button>
          </div>
        </div>
        {/* timer bar */}
        <div style={{ height: "3px", background: "#2a2a35", borderRadius: "0 0 4px 4px", marginTop: "2px" }}>
          <div style={{ height: "100%", background: timerColor, width: `${timePercent}%`, transition: "width 1s linear, background 0.5s", borderRadius: "0 0 4px 4px" }}/>
        </div>
      </div>

      {/* questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
        {questions.map((q, i) => (
          <Card key={i} style={{ border: `1px solid ${answers[i] !== undefined ? "#7c6af7" : "#2a2a35"}` }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: answers[i] !== undefined ? "#1e1e38" : "#1e1e28", border: `1px solid ${answers[i] !== undefined ? "#7c6af7" : "#2a2a35"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: answers[i] !== undefined ? "#7c6af7" : "#555", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <span style={{ background: "#1e1e38", color: "#7c6af7", border: "1px solid #2a2a50", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{q.topic}</span>
                  <span style={{ background: "#1e1e28", color: "#666", border: "1px solid #2a2a35", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{q.type}</span>
                  <span style={{ background: q.difficulty === "hard" ? "#2a0d0d" : q.difficulty === "medium" ? "#2a1f0a" : "#0d2218", color: q.difficulty === "hard" ? "#f87171" : q.difficulty === "medium" ? "#f59e0b" : "#4ade80", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{q.difficulty}</span>
                </div>

                <p style={{ fontSize: "14px", color: "#f0f0f5", lineHeight: "1.6", marginBottom: "8px", fontWeight: "500" }}>{q.question}</p>

                {q.description && (
                  <div style={{ background: "#1e1e28", border: "1px solid #2a2a35", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px" }}>
                    <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6" }}>{q.description}</p>
                    {q.leetcode && (
                      <a href={q.leetcode} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "8px", fontSize: "12px", color: "#f59e0b", textDecoration: "none", background: "#2a1f0a", border: "1px solid #4a3a1a", padding: "3px 10px", borderRadius: "4px" }}>
                        Solve on LeetCode ↗
                      </a>
                    )}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {q.options.map((opt, j) => (
                    <button key={j} onClick={() => handleAnswer(i, j)} style={{
                      background: answers[i] === j ? "#1e1e38" : "#1e1e28",
                      border: `1px solid ${answers[i] === j ? "#7c6af7" : "#2a2a35"}`,
                      borderRadius: "8px", padding: "9px 12px", textAlign: "left",
                      fontSize: "13px", color: answers[i] === j ? "#7c6af7" : "#888",
                      cursor: "pointer", transition: "all 0.15s", display: "flex", gap: "8px", alignItems: "center",
                    }}>
                      <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: answers[i] === j ? "#7c6af7" : "#2a2a35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: answers[i] === j ? "white" : "#555", flexShrink: 0 }}>
                        {["A","B","C","D"][j]}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={submitting} style={{ width: "100%", marginTop: "20px", background: "#7c6af7", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "15px", cursor: "pointer", fontWeight: "500" }}>
        {submitting ? "Submitting..." : "Submit test →"}
      </button>
    </div>
  );

  // ─── RESULT ────────────────────────────────────────
  if (phase === "result" && result) return (
    <div className="page-transition" style={{ maxWidth: "860px", margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#f0f0f5", marginBottom: "4px" }}>Test Result</h1>
          <p style={{ fontSize: "13px", color: "#555" }}>{result.company} pattern · {result.totalQuestions} questions</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={startTest} style={{ background: "#7c6af7", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "500" }}>
            Retake test →
          </button>
          <button onClick={() => setPhase("idle")} style={{ background: "transparent", color: "#888", border: "1px solid #2a2a35", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
            View history
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Score", value: `${result.score}/${result.totalQuestions}`, accent: "#7c6af7" },
          { label: "Accuracy", value: `${result.accuracy}%`, accent: result.accuracy >= 70 ? "#4ade80" : result.accuracy >= 50 ? "#f59e0b" : "#ef4444" },
          { label: "Level", value: result.level, accent: "#7c6af7" },
          { label: "Readiness", value: `${result.readinessScore}%`, accent: "#22c55e" },
        ].map(s => (
          <Card key={s.label}>
            <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "24px", fontWeight: "600", color: s.accent }}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Card>
          <p style={{ fontSize: "13px", fontWeight: "500", color: "#888", marginBottom: "14px" }}>Topic breakdown</p>
          {result.topicBreakdown.map(t => {
            const acc = Math.round((t.correct / t.total) * 100);
            const color = acc >= 70 ? "#4ade80" : acc >= 50 ? "#f59e0b" : "#ef4444";
            return (
              <div key={t.topic} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "13px", color: "#e2e2e8" }}>{t.topic}</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color }}>{acc}%</span>
                </div>
                <div style={{ height: "4px", background: "#2a2a35", borderRadius: "2px" }}>
                  <div style={{ height: "100%", background: color, borderRadius: "2px", width: `${acc}%` }}/>
                </div>
                <p style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>{t.correct}/{t.total} correct</p>
              </div>
            );
          })}
        </Card>

        <Card>
          <p style={{ fontSize: "13px", fontWeight: "500", color: "#888", marginBottom: "14px" }}>Feedback</p>
          {result.feedback.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", padding: "8px 0", borderBottom: "1px solid #1e1e28" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: f.includes("Excellent") ? "#4ade80" : f.includes("Focus") ? "#ef4444" : f.includes("Improved") ? "#22c55e" : "#f59e0b", marginTop: "5px", flexShrink: 0 }}/>
              <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.4" }}>{f}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  // ─── IDLE / HOME ───────────────────────────────────
  return (
    <div className="page-transition" style={{ maxWidth: "980px", margin: "0 auto", padding: "28px 20px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#f0f0f5", marginBottom: "4px" }}>Mock Test</h1>
      <p style={{ fontSize: "13px", color: "#555", marginBottom: "24px" }}>Company-specific pattern · Auto-detected from your profile</p>

      {pattern && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{ background: "#16161d", border: "1px solid #2a2a50", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#1e1e38", border: "1px solid #2a2a50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  {pattern.company === "Google" ? "G" : pattern.company === "Amazon" ? "A" : "M"}
                </div>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#f0f0f5" }}>{pattern.company} Pattern</p>
                  <p style={{ fontSize: "12px", color: "#555" }}>{pattern.totalQuestions} questions · {Math.floor(pattern.duration / 60)} minutes</p>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6", marginBottom: "16px" }}>{pattern.description}</p>
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", color: "#555", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.6px" }}>Tips for {pattern.company}</p>
                {pattern.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ color: "#7c6af7", fontSize: "12px", marginTop: "1px" }}>◆</span>
                    <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.4" }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={startTest} style={{ background: "#7c6af7", color: "white", border: "none", padding: "12px 28px", borderRadius: "8px", fontSize: "15px", cursor: "pointer", fontWeight: "500", width: "100%" }}>
              Start {pattern.company} test →
            </button>
          </div>

          <Card>
            <p style={{ fontSize: "13px", fontWeight: "500", color: "#888", marginBottom: "14px" }}>Question pattern breakdown</p>
            {[
              { topic: "DSA Coding", count: questions.filter(q => q.topic === "DSA" && q.type === "coding").length, color: "#7c6af7" },
              { topic: "DSA MCQ", count: questions.filter(q => q.topic === "DSA" && q.type === "MCQ").length, color: "#6366f1" },
              { topic: "System Design", count: questions.filter(q => q.topic === "System Design").length, color: "#22c55e" },
              { topic: "OS", count: questions.filter(q => q.topic === "OS").length, color: "#f59e0b" },
              { topic: "DBMS", count: questions.filter(q => q.topic === "DBMS").length, color: "#ef4444" },
            ].filter(p => p.count > 0).map(p => (
              <div key={p.topic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e1e28" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }}/>
                  <span style={{ fontSize: "13px", color: "#888" }}>{p.topic}</span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: p.color }}>{p.count} questions</span>
              </div>
            ))}
            <div style={{ marginTop: "14px", padding: "12px", background: "#1e1e28", borderRadius: "8px" }}>
              <p style={{ fontSize: "12px", color: "#555", marginBottom: "6px" }}>Timer resets each test</p>
              <p style={{ fontSize: "12px", color: "#555" }}>Questions are randomized every attempt</p>
            </div>
          </Card>
        </div>
      )}

      {history.length > 0 && (
        <Card>
          <p style={{ fontSize: "13px", fontWeight: "500", color: "#888", marginBottom: "14px" }}>Test history</p>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "8px 12px", borderBottom: "1px solid #2a2a35" }}>
              {["Test", "Score", "Accuracy", "Level", "Readiness"].map(h => (
                <p key={h} style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</p>
              ))}
            </div>
            {history.slice(0, 8).map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "10px 12px", borderBottom: "1px solid #1e1e28" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e1e28"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <p style={{ fontSize: "13px", color: "#888" }}>Test {history.length - i}</p>
                <p style={{ fontSize: "13px", color: "#e2e2e8" }}>{t.score}/{t.totalQuestions}</p>
                <p style={{ fontSize: "13px", color: t.accuracy >= 70 ? "#4ade80" : t.accuracy >= 50 ? "#f59e0b" : "#ef4444" }}>{t.accuracy}%</p>
                <p style={{ fontSize: "13px", color: "#888" }}>{t.level}</p>
                <p style={{ fontSize: "13px", color: "#7c6af7" }}>{t.readinessScore}%</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MockTest;
