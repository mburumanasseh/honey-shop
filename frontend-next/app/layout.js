import './globals.css'
import Providers from '../components/Providers'
import PresenceHeartbeat from '../components/PresenceHeartbeat'
import StoreChrome from '../components/StoreChrome'

export const metadata = {
  title: {
    default: 'Mercy Gold',
    template: '%s | Mercy Gold',
  },
  description:
    'Mercy Gold marketplace — honey, milk, and farm products from Kenyan farmers. Secure checkout; farmers paid after delivery.',
  metadataBase: new URL('https://mercygold.co.ke'),
  icons: {
    icon: [
      { url: '/brand-icon.png', type: 'image/png', sizes: '256x256' },
      { url: '/brand-icon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/brand-icon-32.png',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <PresenceHeartbeat />
          <StoreChrome>{children}</StoreChrome>
        </Providers>
      </body>
    </html>
  )
}
