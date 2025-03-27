import Link from 'next/link'
import TimestampDisplay from '../_components/TimestampDisplay'
import { fetchTimestamp } from '../_lib/fetchers'
import styles from './page.module.scss'

// このページはデフォルトで静的にレンダリングされ、Full Route Cacheに保存されます
export default async function RouteCachePage() {
  // force-cache オプションを使用してデータを取得（デフォルト）
  // このデータはビルド時またはISRの場合は初回リクエスト時にキャッシュされます
  const result = await fetchTimestamp('force-cache')

  return (
    <div className={styles.container}>
      <h1>Full Route Cache (フルルートキャッシュ)</h1>

      <div className={styles.explanation}>
        <p>
          Full Route Cacheは、静的にレンダリングされたルートのHTMLとRSC（React Server
          Component）ペイロードをキャッシュします。 従来のStatic Site Generation (SSG)に相当します。
        </p>
        <p>
          このページはデフォルトで静的にレンダリングされ、Full Route Cacheに保存されます。
          これは、このページが<code>no-store</code>
          オプションを使用していないか、動的関数（cookies、headers、searchParamsなど）を使用していないためです。
        </p>
      </div>

      <div className={styles.results}>
        <div className={styles.resultCard}>
          <h3>静的ルート（このページ）</h3>
          <p>
            このページとそのデータはキャッシュされています。ページをリロードしても同じデータが表示されます。
          </p>
          <TimestampDisplay data={result.data} label="静的ルート" fetchTime={result.fetchTime} />
        </div>
      </div>

      <div className={styles.comparison}>
        <h3>静的ルートと動的ルートの比較</h3>
        <div className={styles.comparisonTable}>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonHeader}>静的ルート（このページ）</div>
            <div className={styles.comparisonHeader}>動的ルート</div>
          </div>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonCell}>
              <ul>
                <li>ビルド時またはISRの場合は初回リクエスト時にレンダリング</li>
                <li>HTMLとRSCペイロードがキャッシュされる</li>
                <li>高速な応答時間</li>
                <li>サーバー負荷が少ない</li>
                <li>データが古くなる可能性がある</li>
              </ul>
            </div>
            <div className={styles.comparisonCell}>
              <ul>
                <li>リクエスト時にレンダリング</li>
                <li>キャッシュされない</li>
                <li>応答時間が遅くなる可能性がある</li>
                <li>サーバー負荷が高い</li>
                <li>常に最新のデータ</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.links}>
          <Link href="/caching-examples/route-cache/dynamic" className={styles.button}>
            動的ルートの例を見る
          </Link>
        </div>
      </div>

      <div className={styles.codeExample}>
        <h3>コード例</h3>
        <pre>
          {`// 静的ルート（デフォルト）
// このページはビルド時またはISRの場合は初回リクエスト時にレンダリングされ、キャッシュされます
export default async function StaticPage() {
  const result = await fetchTimestamp('force-cache')
  return <div>...</div>
}

// 動的ルート
// このページはリクエスト時に毎回レンダリングされ、キャッシュされません
export const dynamic = 'force-dynamic' // または no-store を使用
export default async function DynamicPage() {
  const result = await fetchTimestamp('no-store')
  return <div>...</div>
}

// 時間ベースの再検証を持つ静的ルート
export const revalidate = 60 // 60秒ごとに再検証
export default async function ISRPage() {
  const result = await fetchTimestamp('force-cache')
  return <div>...</div>
}`}
        </pre>
      </div>
    </div>
  )
}
