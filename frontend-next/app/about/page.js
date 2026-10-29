import Link from 'next/link'

export const metadata = {
  title: 'Our Story',
  description:
    'Mercy Gold connects Kenyan farmers with buyers — a trusted marketplace for farm products, with clarity from order to delivery.',
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
            Behind every jar of honey, bottle of milk, tray of eggs, and basket
            of fresh produce is someone who worked hard to bring it to the
            table.
          </p>
        </div>
      </section>

      <section className="about-story__body">
        <div className="container about-story__narrow">
          <p>
            In Kenya, many farmers put their time, money, and energy into
            producing food that families depend on. Yet finding reliable buyers,
            getting fair value for their work, and receiving payment on time can
            still be a challenge. At the same time, buyers want fresh, quality
            farm products from people they can trust.
          </p>
          <p>
            Mercy Gold was created to help bring these two sides closer
            together.
          </p>
          <p>
            We believe buying farm products should feel simple and reassuring,
            and selling them should be worthwhile for the people who do the hard
            work. That is why we are building a marketplace where buyers can
            discover farm products in one place and farmers can reach more
            customers without having to do everything on their own.
          </p>

          <h2 className="about-story__h2">More than just a marketplace</h2>
          <p>
            At Mercy Gold, trust is not just a word we put on our website. It is
            something we want to build through every order.
          </p>
          <p>
            We aim to make the process clear for everyone. Farmers can list
            their products for review and approval, buyers can browse and place
            orders, and each order can be tracked through delivery. Our payment
            process is designed to provide clarity and accountability, so
            farmers know where their payments stand and buyers know what to
            expect.
          </p>
          <p>Because a successful transaction should leave both sides feeling confident.</p>

          <h2 className="about-story__h2">Rooted in Kenya. Growing with our farmers.</h2>
          <p>
            Our journey begins with products close to home, including natural
            honey, milk, eggs, and other farm essentials. But our vision reaches
            beyond any single product.
          </p>
          <p>
            We want to create more opportunities for Kenyan farmers to bring
            what they produce to the people who need it, while giving buyers a
            dependable place to find the things they use every day.
          </p>
          <p>
            We know trust takes time. It is earned through honest communication,
            consistent service, responsible handling of orders, and a willingness
            to do better whenever we can. That is the kind of business we want
            Mercy Gold to become.
          </p>

          <h2 className="about-story__h2">A better connection between farm and home</h2>
          <p>
            We are building Mercy Gold one step at a time, with a simple belief
            at the heart of it all: the people who grow our food deserve
            opportunities to thrive, and the people who buy it deserve an
            experience they can trust.
          </p>

          <p className="about-story__closing">
            <strong>Mercy Gold — Pure. Natural. Kenyan.</strong>
            <br />
            Connecting Kenyan farms to the homes, families, and businesses they
            serve.
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
