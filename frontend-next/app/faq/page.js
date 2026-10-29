import Link from 'next/link'
import {
  IconChat,
  IconLeaf,
  IconPhone,
  IconTruck,
  IconUser,
} from '../../components/Icons'

export const metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Mercy Gold marketplace, delivery, farmers, and payment.',
}

const FAQS = [
  {
    q: 'What is Mercy Gold?',
    a: 'Mercy Gold is a Kenyan farm products marketplace. We connect buyers with farmers for honey, milk, and other farm goods. We collect payment and pay farmers after delivery is confirmed.',
    icon: 'leaf',
  },
  {
    q: 'What can I buy?',
    a: 'Browse honey, milk, dairy, produce, and more from Mercy Gold and approved farmers. Categories on the shop page show what is available.',
    icon: 'leaf',
  },
  {
    q: 'Where do you deliver?',
    a: 'We arrange delivery across Kenya. Exact timing depends on your location and the product — we will confirm details when you order.',
    icon: 'truck',
  },
  {
    q: 'Do I need an account to order?',
    a: 'No. You can checkout as a guest. An account makes tracking orders and reordering easier.',
    icon: 'user',
  },
  {
    q: 'How do I pay?',
    a: 'Payment is collected by Mercy Gold (including M-Pesa where available). We hold funds and release them to the farmer after delivery is confirmed.',
    icon: 'phone',
  },
  {
    q: 'How can farmers sell on Mercy Gold?',
    a: 'Register at Sell on Mercy Gold, complete your farm profile, and list products. Listings go live after our approval. You get paid after the buyer receives the order.',
    icon: 'leaf',
  },
  {
    q: 'How can I contact you?',
    a: 'Use the WhatsApp button on the site or the contact options on Our Story.',
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
    case 'chat':
      return <IconChat {...p} />
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
            <p>Orders, delivery, payments, and selling on Mercy Gold.</p>
          </div>
        </div>
      </section>

      <section className="faq-v2__list">
        <div className="container">
          <div className="faq-v2__grid">
            {FAQS.map((item) => (
              <article key={item.q} className="faq-v2__card">
                <div className="faq-v2__icon">
                  <FaqIcon name={item.icon} />
                </div>
                <h2>{item.q}</h2>
                <p>{item.a}</p>
              </article>
            ))}
          </div>

          <div className="faq-v2__actions">
            <Link href="/shop" className="faq-v2__action">
              Shop products <span aria-hidden>→</span>
            </Link>
            <Link href="/sell/register" className="faq-v2__action">
              Register as a farmer <span aria-hidden>→</span>
            </Link>
            <Link href="/about" className="faq-v2__action">
              Our Story <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
