import Link from 'next/link'

export const metadata = {
  title: 'Benefits of honey',
  description:
    'Discover the natural benefits of pure Kenyan honey — energy, immunity, cough relief, skin care, and more from Mercy Gold Honey.',
}

const BENEFITS = [
  {
    title: 'Natural energy',
    body: 'Honey provides quick, sustained energy from natural sugars and is a cleaner alternative to refined sugar in tea, porridge, and baking.',
  },
  {
    title: 'Soothes coughs & sore throats',
    body: 'A spoon of raw honey in warm water or tea is a time-tested way to ease irritation and calm a tickly throat.',
  },
  {
    title: 'Supports everyday wellness',
    body: 'Honey contains antioxidants and trace nutrients that support general wellbeing when enjoyed as part of a balanced diet.',
  },
  {
    title: 'Gentle on digestion',
    body: 'Many people prefer honey as a milder sweetener. Pure honey is easier to use in small amounts without heavy processing.',
  },
  {
    title: 'Skin & beauty rituals',
    body: 'Honey is widely used in simple face masks and hair treatments for its moisture-holding and soothing properties.',
  },
  {
    title: 'Kitchen staple',
    body: 'From marinades to yoghurt and baking, honey adds depth of flavour that white sugar cannot match — especially pure forest and wildflower varieties.',
  },
  {
    title: 'Direct from the hive',
    body: 'Mercy Gold Honey is naturally harvested Kenyan honey — pure, with no unnecessary additives — so you get the real taste of the hive.',
  },
  {
    title: 'Better than ultra-processed sugar',
    body: 'Swapping some table sugar for honey is a practical step toward more natural food choices for the whole family.',
  },
]

export default function BenefitsPage() {
  return (
    <div className="benefits-page">
      <div className="container">
        <header className="benefits-page__hero">
          <span className="page-eyebrow">Why honey</span>
          <h1>Benefits of pure honey</h1>
          <p>
            Honey has been valued for generations as food and comfort. Here is
            how pure Kenyan honey from Mercy Gold can fit into everyday life —
            for energy, wellness, and the table.
          </p>
        </header>

        <div className="benefits-grid">
          {BENEFITS.map((item) => (
            <article key={item.title} className="benefits-card">
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <aside className="benefits-note">
          <p>
            <strong>Note:</strong> Honey is a food, not medicine. These points
            reflect common traditional and everyday uses. Infants under one year
            should not be given honey. If you have specific health concerns,
            speak with a qualified professional.
          </p>
        </aside>

        <div className="benefits-actions">
          <Link href="/shop" className="btn-primary">
            Shop our honey
          </Link>
          <Link href="/about" className="btn-secondary">
            Our story
          </Link>
        </div>
      </div>
    </div>
  )
}
