import { NextResponse } from 'next/server'
import { DUMMY_CATEGORIES } from 'constants/category'
import { sleep } from '../utils'

export async function GET() {
  try {
    await sleep(500)
    return NextResponse.json(
      { categories: DUMMY_CATEGORIES, message: 'カテゴリを取得しました。' },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        message: 'カテゴリの取得に失敗しました。',
        posts: [],
      },
      { status: 500 },
    )
  }
}
