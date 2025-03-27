import Link from 'next/link'
import styles from './page.module.scss'

export default function CachingExamplesHome() {
  return (
    <div className={styles.container}>
      <h1>Next.js App Router キャッシング例</h1>
      <p>
        このセクションでは、Next.js App
        Routerの4つの主要なキャッシングレイヤーについて実際の例を通して学びます。
      </p>

      <div className={styles.grid}>
        <Link href="/caching-examples/request-memoization" className={styles.card}>
          <h2>Request Memoization</h2>
          <p>
            単一のレンダリングパス内で同じリクエストが複数回行われた場合に、最初の結果を再利用する仕組み。
          </p>
        </Link>

        <Link href="/caching-examples/data-cache" className={styles.card}>
          <h2>Data Cache</h2>
          <p>
            fetchリクエストの結果をサーバー上にキャッシュする仕組み。レンダリングサイクルを超えて永続化されます。
          </p>
        </Link>

        <Link href="/caching-examples/route-cache" className={styles.card}>
          <h2>Full Route Cache</h2>
          <p>
            静的にレンダリングされたルートのHTMLとRSCペイロードをキャッシュします。従来のStatic Site
            Generation (SSG)に相当します。
          </p>
        </Link>

        <Link href="/caching-examples/router-cache" className={styles.card}>
          <h2>Router Cache</h2>
          <p>
            クライアントサイドのブラウザメモリ内に保持される一時的なキャッシュ。ユーザーがアプリケーション内を移動する際の体験を向上させます。
          </p>
        </Link>
      </div>
    </div>
  )
}
