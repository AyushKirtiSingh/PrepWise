const BackgroundOrbs = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
    {/* grid */}
    <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
    {/* orbs */}
    <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "rgba(167,139,250,0.05)", filter: "blur(120px)", top: -150, left: -150, animation: "orbFloat 12s ease-in-out infinite" }} />
    <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(96,165,250,0.04)", filter: "blur(100px)", bottom: -100, right: -100, animation: "orbFloat 15s ease-in-out infinite reverse" }} />
    <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(52,211,153,0.03)", filter: "blur(80px)", top: "40%", left: "45%", animation: "orbFloat 10s ease-in-out infinite 3s" }} />
    <style>{`
      @keyframes orbFloat {
        0%,100% { transform: translate(0,0); }
        33% { transform: translate(25px,-20px); }
        66% { transform: translate(-15px,25px); }
      }
    `}</style>
  </div>
);

export default BackgroundOrbs;
