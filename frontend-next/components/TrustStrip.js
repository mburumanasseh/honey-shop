import {
  IconHive,
  IconLeaf,
  IconPhone,
  IconTruck,
} from './Icons'

const ITEMS = [
  {
    Icon: IconLeaf,
    label: '100% raw honey',
    detail: 'No additives. No shortcuts.',
  },
  {
    Icon: IconTruck,
    label: 'Delivery across Kenya',
    detail: 'Fresh and secure.',
  },
  {
    Icon: IconPhone,
    label: 'Pay with M-Pesa',
    detail: 'Safe and convenient.',
  },
  {
    Icon: IconHive,
    label: 'Direct from the hive',
    detail: 'Pure Kenyan honey.',
  },
]

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Why shop with us">
      <div className="container trust-strip__inner">
        {ITEMS.map(({ Icon, label, detail }) => (
          <div key={label} className="trust-strip__item">
            <span className="trust-strip__icon">
              <Icon size={20} />
            </span>
            <div className="trust-strip__copy">
              <span className="trust-strip__label">{label}</span>
              <span className="trust-strip__detail">{detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
