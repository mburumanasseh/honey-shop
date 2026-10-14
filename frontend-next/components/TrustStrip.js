const ITEMS = [
  { icon: '🌿', label: '100% raw honey' },
  { icon: '🚚', label: 'Delivery across Kenya' },
  { icon: '📱', label: 'Pay with M-Pesa' },
  { icon: '🐝', label: 'Direct from the hive' },
]

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Why shop with us">
      <div className="container trust-strip__inner">
        {ITEMS.map((item) => (
          <div key={item.label} className="trust-strip__item">
            <span className="trust-strip__icon" aria-hidden>
              {item.icon}
            </span>
            <span className="trust-strip__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
