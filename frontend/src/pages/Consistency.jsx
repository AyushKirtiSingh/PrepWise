import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const NC = ({ children, accent = "#00ffc8", style = {} }) => (
  <div className="neon-card" style={{ "--accent": accent, padding: 24, ...style }}>{children}</div>
);

const Consistency = () => {
  const [activity, setActivity] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [actRes, notifRes] = await Promise.all([
        api.get("/consistency"),
        api.get("/consistency/notifications"),
      ]);
      setActivity(actRes.data);
      setNotifications(notifRes.data.notifications || []);
    } catch (err) { console.log(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const markRead = async (id) => {
    setMarking(id);
    try {
      await api.patch(`/consistency/notifications/${id}/read`);
      // update locally without refetch
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) { console.log(err); }
    setMarking(null);
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      try {
        await api.patch(`/consistency/notifications/${n._id}/read`);
      } catch (e) { console.log(e); }
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const notifStyle = (type) => ({
    warning: { bg: "rgba(255,215,0,0.04)", border: "rgba(255,215,0,0.15)", color: "#ffd700" },
    streak: { bg: "rgba(0,255,200,0.04)", border: "rgba(0,255,200,0.15)", color: "#00ffc8" },
    achievement: { bg: "rgba(167,139,250,0.04)", border: "rgba(167,139,250,0.15)", color: "#a78bfa" },
    reminder: { bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
  }[type] || { bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" });

  const heatmap = Array(28).fill(0).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split("T")[0];
    const log = activity?.last7Days?.find(l => l.date === dateStr);
    return { date: dateStr, active: log?.isActive || false };
  });

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", position: "relative", zIndex: 10 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(0,255,200,0.15)", borderTopColor: "#00ffc8", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p className="mono" style={{ fontSize: 10, color: "rgba(0,255,200,0.3)", letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="page-enter" style={{ maxWidth: 960, margin: "0 auto", padding: "40px 40px", position: "relative", zIndex: 10 }}>
      <div style={{ marginBottom: 40 }}>
        <p className="mono" style={{ fontSize: 11, color: "rgba(0,255,200,0.4)", letterSpacing: 3, marginBottom: 10 }}>// BEHAVIOR MONITOR</p>
        <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1, color: "white", marginBottom: 6 }}>
          Consistency <span className="neon-green neon-text">Tracker</span>
        </h1>
        <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
          DAILY ACTIVITY MONITORING · STREAK TRACKING · ALERTS
        </p>
      </div>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "CURRENT STREAK", value: `${activity?.currentStreak || 0}D`, accent: "#ff6b6b" },
          { label: "LONGEST STREAK", value: `${activity?.longestStreak || 0}D`, accent: "#a78bfa" },
          { label: "LAST ACTIVE", value: activity?.lastActiveDate || "N/A", accent: "#00ffc8" },
        ].map(s => (
          <NC key={s.label} accent={s.accent}>
            <p className="game-label" style={{ marginBottom: 10 }}>{s.label}</p>
            <p className="neon-text" style={{ fontSize: s.label === "LAST ACTIVE" ? 20 : 40, fontWeight: 700, letterSpacing: -1, color: s.accent, textShadow: `0 0 20px ${s.accent}60` }}>{s.value}</p>
          </NC>
        ))}
      </div>

      {/* heatmap */}
      <NC accent="#00ffc8" style={{ marginBottom: 16 }}>
        <p className="game-label" style={{ marginBottom: 16 }}>// ACTIVITY HEATMAP — LAST 28 DAYS</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(28,1fr)", gap: 4, marginBottom: 14 }}>
          {heatmap.map((d, i) => (
            <div key={i} title={`${d.date}: ${d.active ? "Active" : "Inactive"}`} style={{
              height: 22, borderRadius: 3,
              background: d.active ? "#00ffc8" : "rgba(255,255,255,0.04)",
              boxShadow: d.active ? "0 0 8px rgba(0,255,200,0.4)" : "none",
              transition: "all 0.2s", cursor: "pointer",
            }}
              onMouseEnter={e => { if (!d.active) e.target.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { if (!d.active) e.target.style.background = "rgba(255,255,255,0.04)"; }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: "rgba(255,255,255,0.04)" }} />
            <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>INACTIVE</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: "#00ffc8", boxShadow: "0 0 6px rgba(0,255,200,0.4)" }} />
            <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>ACTIVE</p>
          </div>
        </div>
      </NC>

      {/* recent activity */}
      <NC accent="#a78bfa" style={{ marginBottom: 16 }}>
        <p className="game-label" style={{ marginBottom: 16 }}>// RECENT ACTIVITY LOG</p>
        {!activity?.last7Days?.length ? (
          <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>
            NO ACTIVITY YET — SOLVE QUESTIONS OR TAKE A TEST TO START
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activity.last7Days.map((log, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: log.isActive ? "#00ffc8" : "#ff6b6b", boxShadow: log.isActive ? "0 0 6px #00ffc8" : "none", marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 12, color: "white", letterSpacing: 1 }}>{log.date}</span>
                    <span className="mono" style={{ fontSize: 11, color: "#ff6b6b" }}>🔥 {log.streak} DAY STREAK</span>
                  </div>
                  {log.activitiesDone.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {log.activitiesDone.map((a, j) => (
                        <span key={j} className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 2, letterSpacing: 0.5 }}>{a}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 0.5 }}>NO ACTIVITIES LOGGED</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </NC>

      {/* notifications */}
      <NC accent="#ffd700">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p className="game-label">// NOTIFICATIONS</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {unreadCount > 0 && (
              <>
                <span className="tag-neon-gold" style={{ fontSize: 10, padding: "3px 10px", borderRadius: 2, letterSpacing: 1 }}>
                  {unreadCount} UNREAD
                </span>
                <button onClick={markAllRead} className="btn-neon" style={{ fontSize: 10, padding: "4px 12px", borderRadius: 2, letterSpacing: 1 }}>
                  MARK ALL READ
                </button>
              </>
            )}
          </div>
        </div>
        {notifications.length === 0 ? (
          <p className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>NO NOTIFICATIONS YET</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notifications.map(n => {
              const s = notifStyle(n.type);
              return (
                <div key={n._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 16px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: 4, opacity: n.isRead ? 0.4 : 1, transition: "opacity 0.3s" }}>
                  <div style={{ flex: 1 }}>
                    <p className="mono" style={{ fontSize: 12, color: s.color, marginBottom: 4, letterSpacing: 0.5 }}>{n.message.toUpperCase()}</p>
                    <p className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
                      {new Date(n.createdAt).toLocaleDateString().toUpperCase()}
                    </p>
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markRead(n._id)} disabled={marking === n._id} className="btn-neon" style={{ fontSize: 9, padding: "4px 10px", borderRadius: 2, letterSpacing: 1, flexShrink: 0, marginLeft: 12, opacity: marking === n._id ? 0.5 : 1 }}>
                      {marking === n._id ? "..." : "READ"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </NC>
    </div>
  );
};

export default Consistency;
