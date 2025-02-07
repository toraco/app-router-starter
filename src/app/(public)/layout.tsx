import { ReactNode } from 'react'
import styles from './layout.module.scss'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>Public Page Header</header>
      <main className={styles.main}>
        <div className={styles.publicPage}>{children}</div>
      </main>
      <footer>Public Page Footer</footer>
    </>
  )
}
