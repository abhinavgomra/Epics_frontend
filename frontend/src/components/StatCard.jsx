export default function StatCard({ label, value, accent, icon }) {
  return (
    <div className="stat-card" style={{ "--stat-accent": accent }}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {icon && <span className="stat-card__icon" aria-hidden="true">{icon}</span>}
      </div>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}
