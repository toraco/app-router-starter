import Link from 'next/link'
import styles from './layout.module.scss'

export const metadata = {
  description: 'Next.js App RouterのServer Actionsの使用例',
  title: 'Server Actions Examples',
}

export default function ServerActionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <Link href="/server-actions-examples">Server Actions Examples</Link>
          </h1>
          <nav className={styles.nav}>
            <Link href="/server-actions-examples/basic-form" className={styles.navLink}>
              基本的なフォーム処理
            </Link>
            <Link href="/server-actions-examples/revalidation" className={styles.navLink}>
              データ更新と再検証
            </Link>
            <Link href="/server-actions-examples/optimistic-updates" className={styles.navLink}>
              Optimistic Updates
            </Link>
            <Link href="/server-actions-examples/validation" className={styles.navLink}>
              バリデーション
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>
            Next.js App RouterのServer Actionsの使用例 -
            <Link href="/" className={styles.footerLink}>
              ホームに戻る
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
