export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/cart',
        '/checkout',
        '/login',
        '/register',
        '/account',
        '/orders',
        '/profile',
        '/nas',
        '/nas/',
      ],
    },
    sitemap: 'https://mercygold.co.ke/sitemap.xml',
  }
}
