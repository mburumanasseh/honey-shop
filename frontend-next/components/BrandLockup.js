import Link from 'next/link'

/**
 * Icon + wordmark lockup (name is text beside the mark, not inside the image).
 */
export default function BrandLockup({ href = '/', className = '', light = false }) {
  return (
    <Link
      href={href}
      className={`brand-lockup${light ? ' brand-lockup--light' : ''} ${className}`.trim()}
      aria-label="Mercy Gold Honey home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand-mark.png"
        alt=""
        className="brand-lockup__mark"
        width={40}
        height={40}
      />
      <span className="brand-lockup__text">
        <strong>Mercy Gold</strong>
        <span>Honey</span>
      </span>
    </Link>
  )
}
