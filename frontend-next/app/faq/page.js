import Link from 'next/link'
import {
  IconCart,
  IconChat,
  IconCheck,
  IconHive,
  IconHoney,
  IconLeaf,
  IconPackage,
  IconPhone,
  IconTruck,
  IconUser,
} from '../../components/Icons'

export const metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Mercy Gold Honey, delivery, guest orders, and payment.',
}

const FAQS = [
  {
    q: 'Is your honey pure and natural?',
    a: 'Yes. Our honey is naturally harvested and selected for quality, aroma, and flavour — no shortcuts.',
    icon: 'hive',
  },
  {
    q: 'Do you deliver across Kenya?',
    a: 'Yes. Delivery fees depend on your town or area and are calculated at checkout.',
    icon: 'truck',
  },
  {
    q: 'Do I need an account to order?',
    a: 'No. You can place an order as a guest. Creating an account is optional and makes reordering easier.',
    icon: 'user',
  },
  {
    q: 'How do I pay?',
    a: 'You can place your order first. We will confirm payment details with you, including M-Pesa when available.',
    icon: 'phone',
  },
  {
    q: 'My honey looks solid — is it still good?',
    a: 'Yes. Natural honey can crystallize over time. Gently warm the jar in clean warm water to return it to a liquid state.',
    icon: 'honey',
  },
  {
    q: 'How can I contact you?',
    a: 'Use the WhatsApp button on the site or reach us through the contact details on Our Story page.',
    icon: 'chat',
  },
]

function FaqIcon({ name }) {
  const p = { size: 22 }
  switch (name) {
    case 'truck':
      return <IconTruck {...p} />
    case 'user':
      return <IconUser {...p} />
    case 'phone':
      return <IconPhone {...p} />
    case 'honey':
      return <IconHoney {...p} />
    case 'chat':
      return <IconChat {...p} />
    case 'hive':
      return <IconHive {...p} />
    default:
      return <IconLeaf {...p} />
  }
}

export default function FaqPage() {
  return (
    <div className="faq-v2">
      <section className="faq-v2__hero">
        <div className="container faq-v2__hero-inner">
          <div className="faq-v2__hero-copy">
            <span className="faq-v2__eyebrow">Help</span>
            <h1>Frequently asked questions</h1>
            <p>Quick answers about our honey, delivery, and ordering.</p>
            <div className="faq-v2__rule" aria-hidden />
          </div>
          <div className="faq-v2__hero-visual">
            <p className="faq-v2__script" aria-hidden>
              Real honey.
              <br />
              Real answers.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/faq/hero.jpg" alt="Jar of Mercy Gold honey with honeycomb" />
          </div>
        </div>
      </section>

      <section className="faq-v2__grid-wrap">
        <div className="container faq-v2__grid">
          {FAQS.map((item) => (
            <details key={item.q} className="faq-v2__card">
              <summary>
                <span className="faq-v2__icon" aria-hidden>
                  <FaqIcon name={item.icon} />
                </span>
                <span className="faq-v2__q">{item.q}</span>
                <span className="faq-v2__chev" aria-hidden />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="faq-v2__actions-band">
        <div className="container faq-v2__actions">
          <Link href="/shop" className="faq-v2__action">
            <span className="faq-v2__action-icon" aria-hidden>
              <IconCart size={22} />
            </span>
            <span>
              Shop honey <span aria-hidden>→</span>
            </span>
          </Link>
          <Link href="/benefits" className="faq-v2__action">
            <span className="faq-v2__action-icon" aria-hidden>
              <IconCheck size={22} />
            </span>
            <span>
              Benefits of honey <span aria-hidden>→</span>
            </span>
          </Link>
          <Link href="/about" className="faq-v2__action">
            <span className="faq-v2__action-icon" aria-hidden>
              <IconPackage size={22} />
            </span>
            <span>
              Our Story <span aria-hidden>→</span>
            </span>
          </Link>
          <p className="faq-v2__tagline">Pure. Natural. Kenyan.</p>
        </div>
      </section>
    </div>
  )
}
