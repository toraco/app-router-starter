import { ReactNode } from 'react'
import Header from 'components/Sidebar'
import styles from './layout.module.scss'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.publicPage}>{children}</div>
      </main>
      <footer>Public Page Footer</footer>
    </>
  )
}
