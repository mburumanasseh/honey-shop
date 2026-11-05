import {
  IconHive,
  IconLeaf,
  IconPhone,
  IconTruck,
} from './Icons'

const ITEMS = [
  { Icon: IconLeaf, label: '100% raw honey' },
  { Icon: IconTruck, label: 'Delivery across Kenya' },
  { Icon: IconPhone, label: 'Pay with M-Pesa' },
  { Icon: IconHive, label: 'Direct from the hive' },
]

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Why shop with us">
      <div className="container trust-strip__inner">
        {ITEMS.map(({ Icon, label }) => (
          <div key={label} className="trust-strip__item">
            <span className="trust-strip__icon">
              <Icon size={18} />
            </span>
            <span className="trust-strip__label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
