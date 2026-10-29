import Link from 'next/link'

export const metadata = {
  title: 'Our Story',
  description:
    'Mercy Gold connects Kenyan farmers with buyers — secure checkout, delivery across Kenya, farmers paid after delivery.',
}

export default function AboutPage() {
  return (
    <div className="about-story">
      <section className="about-story__hero">
        <div className="container about-story__hero-inner">
          <span className="page-eyebrow">Our Story</span>
          <h1>
            Built for farmers.
            <br />
            Trusted by buyers.
          </h1>
          <p className="about-story__lead">
            Mercy Gold started with a simple idea: good farm food should reach
            more tables, and the people who grow it should be paid fairly and
            safely.
          </p>
        </div>
      </section>

      <section className="about-story__body">
        <div className="container about-story__narrow">
          <p>
            Kenya is full of farmers producing excellent honey, milk, eggs,
            produce, and more. What often stands in the way is trust —
            buyers want quality and reliable delivery; farmers want to know
            they will actually get paid.
          </p>
          <p>
            That is the gap Mercy Gold fills. We are the middleman who makes
            the marketplace work: buyers order and pay through us; we confirm
            delivery; then we release payment to the farmer.
          </p>
          <p>
            We still care deeply about natural, carefully produced food —
            especially honey and milk — but Mercy Gold is not a single-product
            shop. It is a platform for Kenyan farm products, with room to grow
            into dairy, produce, and whatever else our approved farmers list.
          </p>
          <p>
            For buyers, that means one place to shop with clear categories and
            secured checkout. For farmers, it means a simple way to list
            products, get approved, fulfil orders, and get paid after the
            customer receives their goods.
          </p>
          <p className="about-story__closing">
            <strong>Mercy Gold</strong> — Pure. Natural. Kenyan.
            <br />
            Farm products, secured end to end.
          </p>
        </div>
      </section>

      <section className="about-story__cta">
        <div className="container about-story__cta-inner">
          <Link href="/shop" className="btn-primary">
            Shop products
          </Link>
          <Link href="/sell/register" className="btn-secondary">
            Register as a farmer
          </Link>
          <Link href="/faq" className="btn-secondary">
            FAQs
          </Link>
        </div>
      </section>
    </div>
  )
}
