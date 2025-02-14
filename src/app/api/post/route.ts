import { NextRequest, NextResponse } from 'next/server'
import { DUMMY_POSTS } from 'constants/post'
import { sleep } from '../utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    // 本来であればここにデータベースから取得する処理を記述する
    await sleep(1000)
    const filteredPosts = DUMMY_POSTS.filter((post) =>
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
