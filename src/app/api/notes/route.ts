import { NextResponse } from 'next/server'
import { NoteData } from '../../server-actions-examples/_lib/actions'

// メモリ内のノートデータストア（実際のアプリではデータベースを使用）
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
    const newNote: NoteData = {
      content: body.content || '', createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      // 実際のアプリではUUIDなどを使用
      title: body.title,
      updatedAt: new Date().toISOString(),
    }

    // ノートを保存
    notes = [...notes, newNote]

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error('ノート作成エラー:', error)
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 })
  }
}
