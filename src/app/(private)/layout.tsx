import { ReactNode } from 'react'
import styles from './layout.module.scss'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  // 例えばここでクッキーからセッショントークンを取得して認証済かどうか確認する
  // const isAuthorized = await getAuth()
  // if (!isAuthorized) {
  //   redirect("/")
  // }
  return (
    <>
      <header>Private Page Header</header>
      <main className={styles.main}>
        <div className={styles.privatePage}>{children}</div>
      </main>
      <footer>Private Page Footer</footer>
    </>
  )
}
