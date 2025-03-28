// タイムスタンプデータの型定義
export type TimestampData = {
  timestamp: string
  randomValue: number
  note: string
}

// タイムスタンプAPIのレスポンス型
export type TimestampResponse = {
  message: string
  data: TimestampData
}

// 基本的なタイムスタンプ取得関数
export async function fetchTimestamp(cacheOption?: RequestCache): Promise<{
  data: TimestampData
  fetchTime: number
}> {
  const startTime = performance.now()

  // キャッシュオプションを指定してフェッチ
  const res = await fetch('http://localhost:3000/api/timestamp', {
    cache: cacheOption,
  })

  if (!res.ok) {
    throw new Error('Failed to fetch timestamp')
  }

  const data = (await res.json()) as TimestampResponse
  const fetchTime = Math.round(performance.now() - startTime)

  return {
    data: data.data,
    fetchTime,
  }
}

// 時間ベースの再検証を使用するフェッチ関数
export async function fetchTimestampWithRevalidate(seconds: number): Promise<{
  data: TimestampData
  fetchTime: number
}> {
  const startTime = performance.now()

  const res = await fetch('http://localhost:3000/api/timestamp', {
    next: { revalidate: seconds },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch timestamp')
  }

  const data = (await res.json()) as TimestampResponse
  const fetchTime = Math.round(performance.now() - startTime)

  return {
    data: data.data,
    fetchTime,
  }
}

// タグ付きフェッチ関数（オンデマンド再検証用）
export async function fetchTimestampWithTag(tag: string): Promise<{
  data: TimestampData
  fetchTime: number
}> {
  const startTime = performance.now()

  const res = await fetch('http://localhost:3000/api/timestamp', {
    next: { tags: [tag] },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch timestamp')
  }

  const data = (await res.json()) as TimestampResponse
  const fetchTime = Math.round(performance.now() - startTime)

  return {
    data: data.data,
    fetchTime,
  }
}
