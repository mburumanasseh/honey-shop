import '../../styles/sell/index.css'
import SellGate from '../../components/sell/SellGate'
import SellShellWrapper from '../../components/sell/SellShellWrapper'

export const metadata = {
  title: 'Sell on Mercy Gold',
  robots: { index: false, follow: false },
}

export default function SellLayout({ children }) {
  return (
    <SellGate>
      <SellShellWrapper>{children}</SellShellWrapper>
    </SellGate>
  )
}
