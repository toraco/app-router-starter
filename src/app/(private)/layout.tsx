import { ReactNode } from 'react'
import Sidebar from 'components/Sidebar'
import CartMenu from 'components/Sidebar/_components/CartMenu'
import styles from './layout.module.scss'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  // 例えばここでクッキーからセッショントークンを取得して認証済かどうか確認する
  // const isAuthorized = await getAuth()
  // if (!isAuthorized) {
  //   redirect("/")
  // }
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>Private Page Header</div>
      </header>
      <main className={styles.main}>
        <div className={styles.privatePage}>{children}</div>
        <Sidebar>
          <CartMenu />
        </Sidebar>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>Private Page Footer</div>
      </footer>
    </>
  )
}
