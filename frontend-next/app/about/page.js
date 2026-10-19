import Link from 'next/link'

export const metadata = {
  title: 'About',
  description:
    'Our story — born from nature, inspired by the sweetness of life. Mercy Gold Honey, pure natural Kenyan honey.',
}

export default function AboutPage() {
  return (
    <div className="about-story">
      {/* Intro */}
      <section className="about-story__intro">
        <div className="container about-story__intro-inner">
          <span className="about-story__eyebrow">Our story</span>
          <h1 className="about-story__title">
            <span className="about-story__title-dark">Born from Nature.</span>
            <span className="about-story__title-gold">
              Inspired by the Sweetness of Life.
            </span>
          </h1>
          <div className="about-story__rule" aria-hidden />
          <p className="about-story__lede">
            It started with something sweet — honey.
          </p>
        </div>
      </section>

      {/* Opening image + caption */}
      <section className="about-story__media">
        <div className="container">
          <figure className="about-story__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/about-jar-board.jpg"
              alt="Jar of golden honey with honeycomb and wooden spoon"
            />
          </figure>
          <div className="about-story__caption">
            <h2>Mercy Gold Honey — Pure. Natural. Kenyan.</h2>
            <p>
              Nature&apos;s golden gift, bringing sweetness to your table and
              reminding us of the beauty behind every drop.
            </p>
          </div>
        </div>
      </section>

      {/* Dark brand band */}
      <section className="about-story__band">
        <div className="container about-story__band-inner">
          <div className="about-story__band-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mercy-gold-logo.jpg"
              alt=""
              className="about-story__band-logo"
            />
            <div>
              <strong>Mercy Gold</strong>
              <span>Honey</span>
            </div>
          </div>
          <p className="about-story__band-tagline">
            Nature&apos;s sweetest gift, straight from the hive.
          </p>
        </div>
      </section>

      {/* Narrative */}
      <section className="about-story__body">
        <div className="container about-story__prose">
          <p>
            We were fascinated by the little things that make it all possible:
            bees moving from flower to flower, pollination helping plants
            flourish, and landscapes bursting into bloom. And then there are the
            bees themselves — fiercely protective of their hives and the
            precious honey they work so hard to produce. There&apos;s something
            beautiful about that dedication. It reminds us that honey is not
            just a sweet treat; it&apos;s the result of an extraordinary natural
            process.
          </p>

          <blockquote className="about-story__quote">
            That is the inspiration behind Mercy Gold Honey.
          </blockquote>

          <p>
            We want to bring a little of that natural wonder into your everyday
            life. Whether you&apos;re drizzling honey over warm mandazi, stirring
            it into your favourite cup of tea, or enjoying a spoonful just
            because you can, we want every jar to remind you of the goodness that
            nature has to offer.
          </p>

          <p>
            For us, honey is a celebration of sweetness, the beauty of
            pollination, and the incredible world of the bees.
          </p>

          <p>
            But the more we looked at it, the more we realised that honey is
            about so much more than its taste. Behind every golden drop is a
            remarkable story of nature, hard work, and life working together.
          </p>
        </div>
      </section>

      {/* Bee photo */}
      <section className="about-story__media about-story__media--tight">
        <div className="container">
          <figure className="about-story__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/about-bee.jpg"
              alt="Honeybee collecting pollen on a white flower"
            />
          </figure>
        </div>
      </section>

      {/* Dipper photo */}
      <section className="about-story__media about-story__media--tight">
        <div className="container">
          <figure className="about-story__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/about-dipper.jpg"
              alt="Honey dripping from a wooden dipper into a glass jar"
            />
          </figure>
        </div>
      </section>

      {/* CTA */}
      <section className="about-story__cta">
        <div className="container">
          <p>Taste the story in every jar.</p>
          <div className="about-story__actions">
            <Link href="/shop" className="btn-primary">
              Shop our honey
            </Link>
            <Link href="/benefits" className="btn-secondary">
              Benefits of honey
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
