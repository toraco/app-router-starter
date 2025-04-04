import { NextResponse } from 'next/server'
import { notes } from 'constants/note'
import { Note } from 'core/domain/entity/note'

// GET /api/notes/[id] - 特定のノートを取得
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const note = notes.find((note) => note.id === id)

  if (!note) {
    return NextResponse.json({ error: 'ノートが見つかりません' }, { status: 404 })
  }

  return NextResponse.json(note)
}

// PUT /api/notes/[id] - 特定のノートを更新
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const body = await request.json()

    // 入力検証
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 })
    }

    // ノートを検索
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'ノートが見つかりません' }, { status: 404 })
    }

    // ノートを更新
    const updatedNote: Note = {
      ...notes[noteIndex],
      content: body.content || notes[noteIndex].content,
      title: body.title,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('ノート更新エラー:', error)
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 })
  }
}

// DELETE /api/notes/[id] - 特定のノートを削除
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    // ノートを検索
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'ノートが見つかりません' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('ノート削除エラー:', error)
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 })
  }
}
