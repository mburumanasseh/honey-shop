import { redirect } from 'next/navigation'

/** Honey benefits page removed — marketplace is wider than honey only. */
export default function BenefitsRedirect() {
  redirect('/shop')
}
