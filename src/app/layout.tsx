import 'styles/global.scss'
import { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  description: 'YouTube「日本一わかりやすい App Router 入門」シリーズで解説する際のサンプルコード',
  openGraph: {
    description:
      'YouTube「日本一わかりやすい App Router 入門」シリーズで解説する際のサンプルコード',
    images: [],
    title: '日本一わかりやすい App Router 入門',
  },
  title: {
    default: '日本一わかりやすい App Router 入門',
    template: '%s | 日本一わかりやすい App Router 入門',
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
