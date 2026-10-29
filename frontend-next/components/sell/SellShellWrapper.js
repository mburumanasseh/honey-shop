'use client'

import { usePathname } from 'next/navigation'
import SellShell from './SellShell'

const PUBLIC_PATHS = ['/sell/login', '/sell/register']

export default function SellShellWrapper({ children }) {
  const pathname = usePathname() || ''
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  if (isPublic) return children
  return <SellShell>{children}</SellShell>
}
