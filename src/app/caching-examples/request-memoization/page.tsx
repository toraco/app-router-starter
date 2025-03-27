import TimestampDisplay from '../_components/TimestampDisplay'
import { fetchTimestamp } from '../_lib/fetchers'
import styles from './page.module.scss'

// 同じデータを3回取得する関数
// Request Memoizationにより、実際のネットワークリクエストは1回だけになる
async function getMultipleTimestamps() {
  console.log('getMultipleTimestamps 関数が呼ばれました')

  // 3回同じデータを取得
  const [result1, result2, result3] = await Promise.all([
    fetchTimestamp('force-cache'),
    fetchTimestamp('force-cache'),
    fetchTimestamp('force-cache'),
  ])

  return {
    result1,
    result2,
    result3,
  }
}

export default async function RequestMemoizationPage() {
  const { result1, result2, result3 } = await getMultipleTimestamps()

  return (
    <div className={styles.container}>
      <h1>Request Memoization (リクエストメモ化)</h1>

      <div className={styles.explanation}>
        <p>
          Request Memoizationは、<strong>単一のレンダリングパス内</strong>
          で同じリクエストが複数回行われた場合に、 最初の結果を再利用する仕組みです。
        </p>
        <p>
          このページでは、同じAPIエンドポイントに対して3回の<code>fetch</code>
          リクエストを行っていますが、 実際のネットワークリクエストは1回だけ発生します。
        </p>
        <p>
          これは、サーバーコンソールログで確認できます。APIエンドポイントには1秒の遅延がありますが、
          3つのリクエストの合計時間は約1秒です（3秒ではありません）。
        </p>
      </div>

      <div className={styles.results}>
        <TimestampDisplay data={result1.data} label="リクエスト 1" fetchTime={result1.fetchTime} />

        <TimestampDisplay data={result2.data} label="リクエスト 2" fetchTime={result2.fetchTime} />

        <TimestampDisplay data={result3.data} label="リクエスト 3" fetchTime={result3.fetchTime} />
      </div>

      <div className={styles.codeExample}>
        <h3>コード例</h3>
        <pre>
          {`// 同じデータを3回取得する関数
// Request Memoizationにより、実際のネットワークリクエストは1回だけになる
async function getMultipleTimestamps() {
  // 3回同じデータを取得
  const [result1, result2, result3] = await Promise.all([
    fetchTimestamp('force-cache'),
    fetchTimestamp('force-cache'),
    fetchTimestamp('force-cache'),
  ])
  
  return {
    result1,
    result2,
    result3,
  }
}`}
        </pre>

        <div className={styles.note}>
          <p>
            <strong>重要なポイント:</strong>
          </p>
          <ul>
            <li>Request Memoizationは単一のレンダリングパス内でのみ有効です</li>
            <li>サーバーのメモリ内で一時的に保持されます</li>
            <li>ページのリロードや別のルートへの移動後は、新しいリクエストが発生します</li>
            <li>React Server Componentsのレンダリング最適化の一部です</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
