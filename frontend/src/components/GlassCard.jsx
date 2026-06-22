const GlassCard = ({ children, style = {}, hover = true, onClick, accent = "#00ffc8" }) => (
  <div
    onClick={onClick}
    className={`neon-card ${hover ? "" : ""}`}
    style={{ "--accent": accent, padding: "24px", ...style }}
  >
    {children}
  </div>
);

export default GlassCard;
