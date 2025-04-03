import { NextResponse } from 'next/server'
import { NoteData } from '../../../server-actions-examples/_lib/actions'

// メモリ内のノートデータストア（実際のアプリではデータベースを使用）
// 注意: 実際のアプリでは、このデータは親ルートと共有する必要があります
let notes: NoteData[] = [
  {
    content: 'App Routerは、Next.js 13から導入された新しいルーティングシステムです。',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    id: '1',
    title: 'Next.js App Routerについて', // 1日前
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    content:
      'Server Actionsは、クライアントコンポーネントからサーバー関数を直接呼び出せる機能です。',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    id: '2',
    title: 'Server Actionsの基本', // 12時間前
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
]

// GET /api/notes/[id] - 特定のノートを取得
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const note = notes.find((note) => note.id === id)

  if (!note) {
    return NextResponse.json({ error: 'ノートが見つかりません' }, { status: 404 })
  }

  return NextResponse.json(note)
}

// PUT /api/notes/[id] - 特定のノートを更新
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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
    const updatedNote: NoteData = {
      ...notes[noteIndex],
      content: body.content || notes[noteIndex].content,
      title: body.title,
      updatedAt: new Date().toISOString(),
    }

    // 更新したノートを保存
    notes = [...notes.slice(0, noteIndex), updatedNote, ...notes.slice(noteIndex + 1)]

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('ノート更新エラー:', error)
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 })
  }
}

// DELETE /api/notes/[id] - 特定のノートを削除
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // ノートを検索
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'ノートが見つかりません' }, { status: 404 })
    }

    // ノートを削除
    notes = [...notes.slice(0, noteIndex), ...notes.slice(noteIndex + 1)]

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('ノート削除エラー:', error)
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 })
  }
}
