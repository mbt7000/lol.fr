import './globals.css'
import type { Metadata } from 'next'
import { getLocale } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Alloul One',
  description: 'Unified Intelligence Platform',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  )
}
