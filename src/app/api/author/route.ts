import { NextResponse } from 'next/server'
import { DUMMY_AUTHORS } from 'constants/author'
import { sleep } from '../utils'

export async function GET() {
  try {
    await sleep(3000)
    return NextResponse.json(
      { authors: DUMMY_AUTHORS, message: '筆者を取得しました。' },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        authors: [],
        message: '筆者の取得に失敗しました。',
      },
      { status: 500 },
    )
  }
}
