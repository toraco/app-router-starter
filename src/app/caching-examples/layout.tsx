import Link from 'next/link'
import { ReactNode } from 'react'
import styles from './layout.module.scss'

export default function CachingExamplesLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h1>Next.js App Router キャッシング例</h1>
        <ul>
          <li>
            <Link href="/caching-examples">ホーム</Link>
          </li>
          <li>
            <Link href="/caching-examples/request-memoization">Request Memoization</Link>
          </li>
          <li>
            <Link href="/caching-examples/data-cache">Data Cache</Link>
          </li>
          <li>
            <Link href="/caching-examples/route-cache">Full Route Cache</Link>
          </li>
          <li>
            <Link href="/caching-examples/router-cache">Router Cache</Link>
          </li>
        </ul>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
