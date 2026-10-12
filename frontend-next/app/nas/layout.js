import NasGate from '../../components/nas/NasGate'
import NasShell from '../../components/nas/NasShell'

export const metadata = {
  title: 'Console',
  robots: { index: false, follow: false },
}

export default function NasLayout({ children }) {
  return (
    <NasGate>
      <NasShell>{children}</NasShell>
    </NasGate>
  )
}
