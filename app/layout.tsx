import 'styles/global.scss'
import { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  description: 'This site is a starter template for Next.js with App Router.',
  metadataBase: new URL('https://sacri.jp'),
  openGraph: {
    description: 'This site is a starter template for Next.js with App Router.',
    images: [],
    title: 'Next.js App Router Starter',
  },
  title: {
    default: 'Next.js App Router Starter',
    template: '%s | Next.js App Router Starter',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
