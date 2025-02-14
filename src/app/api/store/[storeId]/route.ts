import { NextRequest, NextResponse } from 'next/server'
import { Store } from 'core/domain/entity/store'
import { sleep } from '../../utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { storeId } = await params
    // 本来であればここにデータベースから店舗情報を取得する処理を記述する
    await sleep(1000)
    const store: Store = {
      address: '東京都千代田区神田須田町2-2-2',
      category: 'tech',
      id: storeId,
      name: 'toraco',
    }
    return NextResponse.json({ message: '店舗情報を取得しました。', store }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        message: '店舗情報の取得に失敗しました。',
        store: null,
      },
      { status: 500 },
    )
  }
}
