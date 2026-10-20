import Link from 'next/link'
import {
  IconCheck,
  IconHive,
  IconHoney,
  IconLeaf,
  IconPackage,
  IconTruck,
} from '../../components/Icons'

export const metadata = {
  title: 'Benefits of honey',
  description:
    'More than just something sweet — discover energy, everyday uses, and the journey from flower to jar with Mercy Gold Honey.',
}

const BENEFITS = [
  {
    title: 'A natural source of energy',
    body: 'Honey contains naturally occurring sugars that provide a quick source of energy. Add it to tea, porridge, yoghurt or enjoy it straight from the spoon.',
    icon: 'energy',
  },
  {
    title: 'Naturally delicious',
    body: 'Honey brings its own character to everything it touches. From delicate floral notes to rich, bold flavours, different honeys have different personalities.',
    icon: 'leaf',
  },
  {
    title: 'Perfect for your everyday moments',
    body: 'Morning tea. Warm mandazi. A bowl of porridge. Fresh bread. Use Mercy Gold as a natural sweetener whenever you want to add a little extra goodness to your day.',
    icon: 'cup',
  },
  {
    title: 'A gift from bees and flowers',
    body: 'Every jar tells a story. Bees travel from flower to flower collecting nectar, while pollination helps plants reproduce and thrive. It’s a beautiful partnership.',
    icon: 'hive',
  },
  {
    title: 'So many ways to enjoy it',
    body: 'From baking to marinades, salad dressings and yoghurt, honey adds depth of flavour that white sugar just can’t match.',
    icon: 'kitchen',
  },
  {
    title: 'A simple alternative to refined sugar',
    body: 'Looking to make small changes in your everyday meals? Honey can be used in place of some refined sugar in drinks and recipes.',
    icon: 'leaf',
  },
  {
    title: 'From the hive to your table',
    body: 'At Mercy Gold, we want you to experience honey as nature intended — with its natural colour, aroma, flavour and character. Our honey is sourced in Kenya and carefully selected so that every jar brings you closer to the hive.',
    icon: 'truck',
  },
  {
    title: 'Better than ultra-processed sugar',
    body: 'Swapping some table sugar for honey is a practical step toward more natural food choices for the whole family.',
    icon: 'check',
  },
]

const JOURNEY = [
  { label: 'From flower', detail: 'Nectar begins in bloom' },
  { label: 'To bee', detail: 'Collected with care' },
  { label: 'To hive', detail: 'Transformed by the colony' },
  { label: 'To jar', detail: 'Harvested for your table' },
  { label: 'To you', detail: 'Pure. Natural. Kenyan.' },
]

const VARIETIES = [
  'Light & floral',
  'Forest',
  'Wildflower',
  'Raw',
  'Comb honey',
]

function BenefitIcon({ name }) {
  const props = { size: 18 }
  switch (name) {
    case 'energy':
      return <IconHoney {...props} />
    case 'hive':
      return <IconHive {...props} />
    case 'truck':
      return <IconTruck {...props} />
    case 'check':
      return <IconCheck {...props} />
    case 'kitchen':
      return <IconPackage {...props} />
    case 'cup':
      return <IconLeaf {...props} />
    default:
      return <IconLeaf {...props} />
  }
}

export default function BenefitsPage() {
  return (
    <div className="benefits-v2">
      {/* Hero */}
      <section className="benefits-v2__hero">
        <div className="container benefits-v2__hero-inner">
          <div className="benefits-v2__hero-copy">
            <span className="benefits-v2__eyebrow">Why honey</span>
            <h1>
              More than just
              <span> something sweet.</span>
            </h1>
            <p>
              Honey has been enjoyed for generations — drizzled, stirred, spread,
              baked and enjoyed straight from the spoon.
            </p>
            <p>
              But what makes honey special isn’t just the sweetness. It’s the
              golden colour, the rich natural flavour, the aroma, and the
              incredible journey from flower to hive to your table.
            </p>
            <Link href="/shop" className="btn-primary benefits-v2__cta">
              Explore honey →
            </Link>
          </div>
          <div className="benefits-v2__hero-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/about-dipper.jpg"
              alt="Golden Mercy Gold honey in a glass jar"
            />
          </div>
        </div>
      </section>

      {/* Benefits grid + journey */}
      <section className="benefits-v2__main">
        <div className="container">
          <header className="benefits-v2__section-head">
            <span className="benefits-v2__eyebrow">The golden goodness</span>
            <h2>Good things come from nature.</h2>
            <p>Here’s why you’ll love having Mercy Gold Honey in your life.</p>
          </header>

          <div className="benefits-v2__layout">
            <div className="benefits-v2__grid">
              {BENEFITS.map((item) => (
                <article key={item.title} className="benefits-v2__card">
                  <span className="benefits-v2__card-icon" aria-hidden>
                    <BenefitIcon name={item.icon} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>

            <aside className="benefits-v2__journey">
              <div className="benefits-v2__journey-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about/about-bee.jpg"
                  alt="Honeybee on a flower"
                />
              </div>
              <span className="benefits-v2__eyebrow">The incredible journey</span>
              <ol className="benefits-v2__steps">
                {JOURNEY.map((step) => (
                  <li key={step.label}>
                    <strong>{step.label}</strong>
                    <span>{step.detail}</span>
                  </li>
                ))}
              </ol>
              <h3>Every jar tells a story.</h3>
              <p>
                Bees move from flower to flower collecting nectar, while
                pollination helps plants reproduce and thrive. That relationship
                between bees, flowers and the environment is part of what makes
                honey so special.
              </p>
              <p>
                You’re not just enjoying sweetness. You’re enjoying the result of
                an extraordinary natural process.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="benefits-v2__band">
        <div className="container benefits-v2__band-inner">
          <div className="benefits-v2__band-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/honeyjar.jpg" alt="Jar of Mercy Gold honey" />
          </div>
          <div className="benefits-v2__band-copy">
            <span className="benefits-v2__eyebrow">Find your favourite sweetness</span>
            <h2>
              From light and floral to rich and bold, there’s a Mercy Gold waiting
              for you.
            </h2>
            <Link href="/shop" className="btn-primary">
              Shop honey →
            </Link>
            <ul className="benefits-v2__varieties">
              {VARIETIES.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="benefits-v2__note">
        <div className="container">
          <p>
            <strong>Note:</strong> Honey is a food, not medicine. These points
            reflect common traditional and everyday uses. Infants under one year
            should not be given honey.
          </p>
        </div>
      </section>
    </div>
  )
}
