import Link from 'next/link'
import TimestampDisplay from '../../_components/TimestampDisplay'
import { fetchTimestamp } from '../../_lib/fetchers'
import styles from './page.module.scss'

// このページは動的にレンダリングされ、キャッシュされません
export const dynamic = 'force-dynamic'

export default async function DynamicRoutePage() {
  // no-store オプションを使用してデータを取得（キャッシュなし）
  // このデータはリクエストごとに新しく取得されます
  const result = await fetchTimestamp('no-store')

  return (
    <div className={styles.container}>
      <h1>動的ルートの例</h1>

      <div className={styles.explanation}>
        <p>
          このページは<code>dynamic = &quot;force-dynamic&quot;</code>
          を使用して、動的にレンダリングされるように設定されています。 これにより、このページはFull
          Route Cacheに保存されず、リクエストごとに新しくレンダリングされます。
        </p>
        <p>動的ルートは以下の場合に使用します：</p>
        <ul>
          <li>ユーザー固有のコンテンツを表示する場合</li>
          <li>常に最新のデータが必要な場合</li>
          <li>
            リクエスト時の情報（クエリパラメータ、Cookieなど）に基づいてコンテンツを変更する場合
          </li>
        </ul>
      </div>

      <div className={styles.results}>
        <div className={styles.resultCard}>
          <h3>動的ルート（このページ）</h3>
          <p>
            このページとそのデータはキャッシュされません。ページをリロードするたびに新しいデータが表示されます。
          </p>
          <TimestampDisplay data={result.data} label="動的ルート" fetchTime={result.fetchTime} />
          <div className={styles.refreshNote}>
            <p>
              <strong>検証方法：</strong>{' '}
              ページをリロードして、タイムスタンプとランダム値が変わることを確認してください。
            </p>
            <Link href="/caching-examples/route-cache/dynamic" className={styles.reloadButton}>
              ページをリロード
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.codeExample}>
        <h3>コード例</h3>
        <pre>
          {`// 動的ルートの設定方法
export const dynamic = 'force-dynamic'

export default async function DynamicPage() {
  // no-store オプションを使用してデータを取得（キャッシュなし）
  const result = await fetchTimestamp('no-store')
  
  return <div>...</div>
}

// または、fetch に no-store を使用することでも動的ルートになります
export default async function DynamicPage() {
  const result = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  })
  
  return <div>...</div>
}

// または、動的関数を使用することでも動的ルートになります
export default async function DynamicPage({ searchParams }) {
  // searchParams, cookies(), headers() などの動的関数を使用
  
  return <div>...</div>
}`}
        </pre>
      </div>

      <div className={styles.navigation}>
        <Link href="/caching-examples/route-cache" className={styles.backButton}>
          静的ルートに戻る
        </Link>
      </div>
    </div>
  )
}
