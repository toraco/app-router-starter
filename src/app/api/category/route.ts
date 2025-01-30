import { NextResponse } from 'next/server'
import { Category } from 'core/domain/entity/category'
import { sleep } from '../utils'

export async function GET() {
  try {
    await sleep(500)
    return NextResponse.json({ categories, message: 'カテゴリを取得しました。' }, { status: 200 })
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

const categories: Category[] = [
  {
    id: 1,
    name: 'Frontend',
  },
  {
    id: 2,
    name: 'Backend',
  },
  {
    id: 3,
    name: 'Infrastructure',
  },
]
