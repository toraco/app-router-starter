'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

// タイムスタンプデータの型定義
export type NoteData = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

// ノート作成用の型
export type CreateNoteInput = {
  title: string
  content: string
}

// ノート更新用の型
export type UpdateNoteInput = {
  id: string
  title: string
  content: string
}

// 操作結果の型
export type ActionResult<T = unknown> = {
  success: boolean
  error?: string
  data?: T
}

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

// すべてのノートを取得する関数
export async function getNotes(): Promise<NoteData[]> {
  // 実際のアプリではデータベースからデータを取得
  return [...notes]
}

// IDでノートを取得する関数
export async function getNote(id: string): Promise<NoteData | null> {
  // 実際のアプリではデータベースからデータを取得
  const note = notes.find((note) => note.id === id)
  return note || null
}

// ノートを作成するServer Action
export async function createNote(input: CreateNoteInput): Promise<ActionResult<NoteData>> {
  try {
    // 入力検証
    if (!input.title.trim()) {
      return { error: 'タイトルは必須です', success: false }
    }

    // 新しいノートを作成
    const newNote: NoteData = {
      content: input.content, createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      // 実際のアプリではUUIDなどを使用
      title: input.title,
      updatedAt: new Date().toISOString(),
    }

    // ノートを保存（実際のアプリではデータベースに保存）
    notes = [...notes, newNote]

    // キャッシュを再検証
    revalidateTag('notes')

    return { data: newNote, success: true }
  } catch (error) {
    console.error('ノート作成エラー:', error)
    return { error: '不明なエラーが発生しました', success: false }
  }
}

// ノートを更新するServer Action
export async function updateNote(input: UpdateNoteInput): Promise<ActionResult<NoteData>> {
  try {
    // 入力検証
    if (!input.id) {
      return { error: 'ノートIDは必須です', success: false }
    }
    if (!input.title.trim()) {
      return { error: 'タイトルは必須です', success: false }
    }

    // ノートを検索
    const noteIndex = notes.findIndex((note) => note.id === input.id)
    if (noteIndex === -1) {
      return { error: 'ノートが見つかりません', success: false }
    }

    // ノートを更新
    const updatedNote: NoteData = {
      ...notes[noteIndex],
      content: input.content,
      title: input.title,
      updatedAt: new Date().toISOString(),
    }

    // 更新したノートを保存
    notes = [...notes.slice(0, noteIndex), updatedNote, ...notes.slice(noteIndex + 1)]

    // キャッシュを再検証
    revalidateTag('notes')
    revalidateTag(`note-${input.id}`)

    return { data: updatedNote, success: true }
  } catch (error) {
    console.error('ノート更新エラー:', error)
    return { error: '不明なエラーが発生しました', success: false }
  }
}

// ノートを削除するServer Action
export async function deleteNote(id: string): Promise<ActionResult<void>> {
  try {
    // 入力検証
    if (!id) {
      return { error: 'ノートIDは必須です', success: false }
    }

    // ノートを検索
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) {
      return { error: 'ノートが見つかりません', success: false }
    }

    // ノートを削除
    notes = [...notes.slice(0, noteIndex), ...notes.slice(noteIndex + 1)]

    // キャッシュを再検証
    revalidateTag('notes')
    revalidatePath('/server-actions-examples/notes')

    return { success: true }
  } catch (error) {
    console.error('ノート削除エラー:', error)
    return { error: '不明なエラーが発生しました', success: false }
  }
}

// タグ付きのノート取得関数（キャッシュ制御用）
export async function getNotesWithTag(): Promise<NoteData[]> {
  // タグ付きでノートを取得
  return await fetch('http://localhost:3000/api/notes', {
    next: { tags: ['notes'] },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch notes')
    }
    return res.json()
  })
}

// IDとタグ付きのノート取得関数（キャッシュ制御用）
export async function getNoteWithTag(id: string): Promise<NoteData | null> {
  // タグ付きで特定のノートを取得
  return await fetch(`http://localhost:3000/api/notes/${id}`, {
    next: { tags: ['notes', `note-${id}`] },
  }).then((res) => {
    if (!res.ok) {
      return null
    }
    return res.json()
  })
}
