import { NextRequest, NextResponse } from 'next/server'
import { Post } from 'core/domain/entity/post'
import { sleep } from '../utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    // 本来であればここにデータベースから取得する処理を記述する
    await sleep(3000)
    const filteredPosts = posts.filter((post) =>
      categoryId === null ? true : post.categoryId === Number(categoryId),
    )

    return NextResponse.json(
      { message: '投稿を取得しました。', posts: filteredPosts },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        message: '投稿の取得に失敗しました。',
        posts: [],
      },
      { status: 500 },
    )
  }
}

const posts: Post[] = [
  {
    categoryId: 1,
    content: 'Frontend Content 1',
    id: 1,
    title: 'Frontend Post 1',
  },
  {
    categoryId: 1,
    content: 'Frontend Content 2',
    id: 2,
    title: ' Frontend Post 2',
  },
  {
    categoryId: 2,
    content: 'Backend Content 3',
    id: 3,
    title: 'Backend Post 3',
  },
  {
    categoryId: 2,
    content: 'Backend Content 4',
    id: 4,
    title: 'Backend Post 4',
  },
  {
    categoryId: 3,
    content: 'Infrastructure Content 5',
    id: 5,
    title: 'Infrastructure Post 5',
  },
  {
    categoryId: 3,
    content: 'Infrastructure Content 6',
    id: 6,
    title: 'Infrastructure Post 6',
  },
]
