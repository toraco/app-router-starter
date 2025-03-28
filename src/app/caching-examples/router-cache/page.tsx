'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.scss'

export default function RouterCachePage() {
  const router = useRouter()
  const [refreshCount, setRefreshCount] = useState(0)

  // ページがマウントされたときにカウンターを増加
  useEffect(() => {
    setRefreshCount((prev) => prev + 1)
  }, [])

  // router.refresh() を使用してソフト更新を行う関数
  const handleSoftRefresh = () => {
    router.refresh()
  }

  return (
    <div className={styles.container}>
      <h1>Router Cache (ルーターキャッシュ)</h1>

      <div className={styles.explanation}>
        <p>
          Router Cacheは、クライアントサイドのブラウザメモリ内に保持される一時的なキャッシュです。
          ユーザーがアプリケーション内を移動する際の体験を向上させます。
        </p>
        <p>このキャッシュは以下の特徴を持ちます：</p>
        <ul>
          <li>クライアントサイドのみで機能</li>
          <li>ナビゲーション中のルート間でデータを共有</li>
          <li>セッション中のみ有効（ページのリロード時にクリア）</li>
          <li>プリフェッチされたルートも含む</li>
        </ul>
      </div>

      <div className={styles.counter}>
        <h3>このページの訪問回数: {refreshCount}</h3>
        <p>
          このカウンターは、ページがレンダリングされるたびに増加します。 Router
          Cacheの動作を確認するために使用できます。
        </p>
      </div>

      <div className={styles.testSection}>
        <h3>Router Cacheのテスト</h3>
        <p>以下の操作を試して、Router Cacheの動作を確認してください：</p>

        <div className={styles.testCard}>
          <h4>1. ソフト更新 (router.refresh)</h4>
          <p>
            <code>router.refresh()</code>を使用すると、Router Cacheを保持したまま、
            現在のルートのデータのみを再取得します。カウンターは増加します。
          </p>
          <button onClick={handleSoftRefresh} className={styles.button}>
            ソフト更新 (router.refresh)
          </button>
        </div>

        <div className={styles.testCard}>
          <h4>2. 別のページに移動して戻る</h4>
          <p>
            別のページに移動して「戻る」ボタンで戻ると、Router Cacheから
            このページが表示されます。カウンターは増加しません。
          </p>
          <Link href="/caching-examples" className={styles.button}>
            ホームページに移動
          </Link>
        </div>

        <div className={styles.testCard}>
          <h4>3. ハード更新 (ブラウザのリロード)</h4>
          <p>
            ブラウザのリロードボタンを使用するか、F5キーを押すと、 Router
            Cacheがクリアされ、ページが完全に再読み込みされます。カウンターはリセットされます。
          </p>
          <Link href="/caching-examples/router-cache" className={styles.button}>
            ページをリロード
          </Link>
        </div>
      </div>

      <div className={styles.codeExample}>
        <h3>コード例</h3>
        <pre>
          {`// クライアントコンポーネントでのRouter Cacheの使用
'use client'

import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()
  
  // ソフト更新 - Router Cacheを保持したまま現在のルートのデータを再取得
  const handleRefresh = () => {
    router.refresh()
  }
  
  // 別のルートに移動 - Router Cacheに現在のページが保存される
  const handleNavigate = () => {
    router.push('/other-page')
  }
  
  return (
    <div>
      <button onClick={handleRefresh}>ソフト更新</button>
      <button onClick={handleNavigate}>別のページに移動</button>
    </div>
  )
}`}
        </pre>
      </div>

      <div className={styles.note}>
        <h3>Router Cacheの重要なポイント</h3>
        <ul>
          <li>Router Cacheはブラウザのメモリ内にのみ存在し、ページのリロード時にクリアされます</li>
          <li>Next.jsは自動的にリンクをプリフェッチし、Router Cacheに保存します</li>
          <li>Router Cacheにより、ページ間のナビゲーションが高速になります</li>
          <li>
            <code>router.refresh()</code>を使用すると、Router
            Cacheを保持したまま現在のルートのデータのみを再取得できます
          </li>
          <li>
            動的ルートでも、Router
            Cacheは機能します（ただし、サーバーからの新しいデータは取得されます）
          </li>
        </ul>
      </div>
    </div>
  )
}
