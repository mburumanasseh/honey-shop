function StatCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__icon">
          {icon}
        </span>

        <span className="stat-card__title">
          {title}
        </span>
      </div>

      <strong className="stat-card__value">
        {value}
      </strong>

      <p className="stat-card__description">
        {description}
      </p>
    </article>
  )
}

export default StatCard