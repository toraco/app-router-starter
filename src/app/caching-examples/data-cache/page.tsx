import Link from 'next/link'
import TimestampDisplay from '../_components/TimestampDisplay'
import { fetchTimestamp, fetchTimestampWithRevalidate } from '../_lib/fetchers'
import styles from './page.module.scss'

// force-cache オプションを使用したデータ取得（デフォルト）
async function getDefaultCachedData() {
  return await fetchTimestamp('force-cache')
}

// no-store オプションを使用したデータ取得（キャッシュなし）
async function getNonCachedData() {
  return await fetchTimestamp('no-store')
}

// 10秒間の再検証期間を持つデータ取得
async function getRevalidatedData() {
  return await fetchTimestampWithRevalidate(10)
}

export default async function DataCachePage() {
  // 3つの異なるキャッシュ戦略でデータを取得
  const defaultCachedResult = await getDefaultCachedData()
  const nonCachedResult = await getNonCachedData()
  const revalidatedResult = await getRevalidatedData()

  return (
    <div className={styles.container}>
      <h1>Data Cache (データキャッシュ)</h1>

      <div className={styles.explanation}>
        <p>
          Data Cacheは、<code>fetch</code>リクエストの結果をサーバー上にキャッシュする仕組みです。
          Request Memoizationとは異なり、レンダリングサイクルを超えて永続化されます。
        </p>
        <p>このページでは、3つの異なるキャッシュ戦略を使用してデータを取得しています：</p>
        <ol>
          <li>
            <code>force-cache</code> - デフォルトの動作。データを永続的にキャッシュします。
          </li>
          <li>
            <code>no-store</code> - キャッシュを使用せず、毎回新しいデータを取得します。
          </li>
          <li>
            <code>revalidate: 10</code> - 10秒ごとにキャッシュを再検証します。
          </li>
        </ol>
      </div>

      <div className={styles.results}>
        <div className={styles.resultCard}>
          <h3>force-cache（デフォルト）</h3>
          <p>
            データは永続的にキャッシュされます。ページをリロードしても同じデータが表示されます。
          </p>
          <TimestampDisplay
            data={defaultCachedResult.data}
            label="force-cache"
            fetchTime={defaultCachedResult.fetchTime}
          />
        </div>

        <div className={styles.resultCard}>
          <h3>no-store（キャッシュなし）</h3>
          <p>
            データはキャッシュされません。ページをリロードするたびに新しいデータが取得されます。
          </p>
          <TimestampDisplay
            data={nonCachedResult.data}
            label="no-store"
            fetchTime={nonCachedResult.fetchTime}
          />
        </div>

        <div className={styles.resultCard}>
          <h3>revalidate: 10（10秒ごとに再検証）</h3>
          <p>データは10秒間キャッシュされ、その後再検証されます。</p>
          <TimestampDisplay
            data={revalidatedResult.data}
            label="revalidate: 10"
            fetchTime={revalidatedResult.fetchTime}
          />
        </div>
      </div>

      <div className={styles.codeExample}>
        <h3>コード例</h3>
        <pre>
          {`// force-cache オプションを使用したデータ取得（デフォルト）
async function getDefaultCachedData() {
  return await fetchTimestamp('force-cache')
}

// no-store オプションを使用したデータ取得（キャッシュなし）
async function getNonCachedData() {
  return await fetchTimestamp('no-store')
}

// 10秒間の再検証期間を持つデータ取得
async function getRevalidatedData() {
  return await fetchTimestampWithRevalidate(10)
}`}
        </pre>

        <div className={styles.note}>
          <p>
            <strong>検証方法:</strong>
          </p>
          <ul>
            <li>ページをリロードして、各データの動作を確認してください。</li>
            <li>
              <code>force-cache</code>のデータは変わりません（キャッシュから取得）。
            </li>
            <li>
              <code>no-store</code>のデータは毎回変わります（新しいリクエスト）。
            </li>
            <li>
              <code>revalidate: 10</code>のデータは10秒後に変わります（時間ベースの再検証）。
            </li>
          </ul>
          <p>
            <Link href="/caching-examples/data-cache" className={styles.reloadButton}>
              ページをリロード
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
