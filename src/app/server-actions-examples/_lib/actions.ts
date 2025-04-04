'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { Note } from 'core/domain/entity/note'

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

// すべてのノートを取得する関数
export async function getNotes(): Promise<Note[]> {
  const res = await fetch('http://localhost:3000/api/notes', {
    next: { tags: ['notes'] },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch notes')
  }
  return res.json()
}

// IDでノートを取得する関数
export async function getNote(id: string): Promise<Note | null> {
  const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
    next: { tags: ['notes', `note-${id}`] },
  })
  if (!res.ok) {
    throw new Error('Failed to fetch notes')
  }
  return res.json()
}

// ノートを作成するServer Action
export async function createNote(input: CreateNoteInput): Promise<ActionResult<Note>> {
  try {
    // 入力検証
    if (!input.title.trim()) {
      return { error: 'タイトルは必須です', success: false }
    }

    // 新しいノートを作成
    const newNote: Note = {
      content: input.content,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      // 実際のアプリではUUIDなどを使用
      title: input.title,
      updatedAt: new Date().toISOString(),
    }

    const res = await fetch('http://localhost:3000/api/notes', {
      body: JSON.stringify(newNote),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      next: { tags: ['notes'] },
    })
    if (!res.ok) {
      return { error: 'ノートの作成に失敗しました', success: false }
    }

    // キャッシュを再検証
    revalidateTag('notes')

    return { data: newNote, success: true }
  } catch (error) {
    console.error('ノート作成エラー:', error)
    return { error: '不明なエラーが発生しました', success: false }
  }
}

// ノートを更新するServer Action
export async function updateNote(input: UpdateNoteInput): Promise<ActionResult<Note>> {
  try {
    // 入力検証
    if (!input.id) {
      return { error: 'ノートIDは必須です', success: false }
    }
    if (!input.title.trim()) {
      return { error: 'タイトルは必須です', success: false }
    }

    // ノートを更新
    const updatedNote: Omit<Note, 'id' | 'createdAt'> = {
      content: input.content,
      title: input.title,
      updatedAt: new Date().toISOString(),
    }

    const res = await fetch(`http://localhost:3000/api/notes/${input.id}`, {
      body: JSON.stringify(updatedNote),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      next: { tags: ['notes', `note-${input.id}`] },
    })
    if (!res.ok) {
      return { error: 'ノートの更新に失敗しました', success: false }
    }

    // キャッシュを再検証
    revalidateTag('notes')
    revalidateTag(`note-${input.id}`)

    return { success: true }
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

    const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
      method: 'DELETE',
      next: { tags: ['notes', `note-${id}`] },
    })
    if (!res.ok) {
      return { error: 'ノートの削除に失敗しました', success: false }
    }

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
export async function getNotesWithTag(): Promise<Note[]> {
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
export async function getNoteWithTag(id: string): Promise<Note | null> {
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
