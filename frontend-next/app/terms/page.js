import Link from 'next/link'

export const metadata = {
  title: 'Terms and Conditions',
  description:
    'Terms and Conditions and privacy notice for Mercy Gold marketplace (Kenya).',
}

export default function TermsPage() {
  return (
    <div className="container page terms-page">
      <span className="page-eyebrow">Legal</span>
      <h1>Terms and Conditions</h1>
      <p className="muted">
        Last updated: 29 October 2026 · Applies to Mercy Gold marketplace
        services in Kenya.
      </p>

      <div className="terms-page__body">
        <h2>1. Who we are</h2>
        <p>
          Mercy Gold operates an online marketplace that connects buyers with
          farmers and other sellers of farm products in Kenya. We act as an
          intermediary: we facilitate listing, ordering, payment collection, and
          coordination of delivery. We are not the producer of every product
          sold on the platform unless a listing is clearly marked as a Mercy
          Gold official product.
        </p>

        <h2>2. Accounts and roles</h2>
        <p>
          You may register as a <strong>customer</strong> (buyer) or as a{' '}
          <strong>farmer / seller</strong>. Seller accounts are subject to
          verification by Mercy Gold before you may list products or receive
          payouts. Providing false information, or using a seller account when
          you are only a buyer (or the reverse), may result in suspension or
          termination of your account.
        </p>

        <h2>3. Seller verification</h2>
        <p>
          When you apply as a farmer or seller, we may contact you using the
          details you provide to confirm that you are a legitimate supplier. We
          may request reasonable additional information. Listings remain pending
          until approved. We may refuse, suspend, or deactivate a seller account
          where we reasonably believe there is fraud, misrepresentation, or risk
          to buyers.
        </p>

        <h2>4. Orders, payment, and delivery</h2>
        <p>
          Buyers pay Mercy Gold (including via M-Pesa where available). We hold
          funds and aim to release payment to the seller after delivery is
          confirmed, subject to disputes, cancellations, and applicable law.
          Delivery timelines depend on location and product type and will be
          communicated as clearly as reasonably possible. Risk and title in
          goods pass according to the arrangements confirmed at order time and
          the Consumer Protection Act, 2012 where it applies.
        </p>

        <h2>5. Product quality and disputes</h2>
        <p>
          Sellers are responsible for the accuracy of their listings and the
          condition of goods they supply. Buyers should inspect goods on receipt
          where practical and report issues promptly. Mercy Gold may mediate in
          good faith but does not guarantee every third-party product. Nothing
          in these terms limits rights you cannot waive under Kenyan consumer
          law.
        </p>

        <h2>6. Personal data and privacy</h2>
        <p>
          We collect and process personal data (such as name, contact details,
          location, farm information, transaction history, and device or usage
          data) to:
        </p>
        <ul>
          <li>create and secure your account;</li>
          <li>verify sellers and prevent fraud;</li>
          <li>process orders, payments, and support requests;</li>
          <li>improve our services and platform safety;</li>
          <li>comply with legal obligations.</li>
        </ul>
        <p>
          Processing is carried out in line with the principles of the{' '}
          <strong>Data Protection Act, 2019</strong> (Kenya), including
          lawfulness, fairness, purpose limitation, and security. By creating an
          account and accepting these terms, you consent to this processing for
          the purposes above. You may request access to or correction of your
          personal data by contacting us. We retain data only as long as needed
          for these purposes or as required by law.
        </p>

        <h2>7. Acceptable use</h2>
        <p>
          You must not use the platform for unlawful activity, to sell unsafe or
          prohibited goods, to harass others, or to attempt to bypass security,
          verification, or payment controls.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by Kenyan law, Mercy Gold is not
          liable for indirect or consequential loss arising from use of the
          marketplace. We remain responsible for our own negligence and for
          obligations we cannot exclude by law.
        </p>

        <h2>9. Changes</h2>
        <p>
          We may update these terms. Continued use of the service after changes
          are posted constitutes acceptance of the updated terms, where
          permitted by law.
        </p>

        <h2>10. Contact</h2>
        <p>
          For questions about these terms or your data, use the WhatsApp contact
          on the site or the channels listed under{' '}
          <Link href="/about">Our Story</Link>.
        </p>

        <p className="muted">
          This summary is provided for transparency and does not replace advice
          from a qualified legal practitioner for your specific situation.
        </p>
      </div>

      <p>
        <Link href="/register">Create customer account</Link>
        {' · '}
        <Link href="/sell/register">Register as a farmer</Link>
      </p>
    </div>
  )
}
