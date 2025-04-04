import { NextResponse } from 'next/server'
import { notes } from 'constants/note'
import { Note } from 'core/domain/entity/note'

// GET /api/notes - すべてのノートを取得
export async function GET() {
  return NextResponse.json(notes)
}

// POST /api/notes - 新しいノートを作成
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 入力検証
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 })
    }

    // 新しいノートを作成
    const newNote: Note = {
      content: body.content || '',
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      // 実際のアプリではUUIDなどを使用
      title: body.title,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error('ノート作成エラー:', error)
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 })
  }
}
