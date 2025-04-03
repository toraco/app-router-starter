'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { deleteNote, getNotes, updateNote } from '../_lib/actions'
import type { NoteData } from '../_lib/actions'
import styles from './page.module.scss'

export default function RevalidationPage() {
  const [notes, setNotes] = useState<NoteData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState<NoteData | null>(null)
  const [status, setStatus] = useState<{
    success: boolean
    message: string
    type: 'update' | 'delete' | null
  } | null>(null)

  // ノート一覧を取得
  useEffect(() => {
    async function fetchNotes() {
      try {
        const notesData = await getNotes()
        setNotes(notesData)
      } catch (error) {
        console.error('Failed to fetch notes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  // ノートの編集を開始
  const handleEdit = (note: NoteData) => {
    setEditingNote({ ...note })
  }

  // 編集中のノートの内容を更新
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingNote) return

    setEditingNote({
      ...editingNote,
      [e.target.name]: e.target.value,
    })
  }

  // ノートの更新をキャンセル
  const handleCancelEdit = () => {
    setEditingNote(null)
    setStatus(null)
  }

  // ノートを更新
  const handleUpdateNote = async () => {
    if (!editingNote) return

    try {
      setStatus(null)
      const result = await updateNote({
        content: editingNote.content,
        id: editingNote.id,
        title: editingNote.title,
      })

      if (result.success) {
        // 更新成功
        setStatus({
          message: 'ノートが更新されました',
          success: true,
          type: 'update',
        })

        // ノート一覧を更新
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === editingNote.id ? result.data! : note)),
        )

        // 編集モードを終了
        setEditingNote(null)
      } else {
        // 更新失敗
        setStatus({
          message: result.error || 'ノートの更新に失敗しました',
          success: false,
          type: 'update',
        })
      }
    } catch (error) {
      console.error('Failed to update note:', error)
      setStatus({
        message: '予期せぬエラーが発生しました',
        success: false,
        type: 'update',
      })
    }
  }

  // ノートを削除
  const handleDeleteNote = async (id: string) => {
    if (!confirm('このノートを削除してもよろしいですか？')) return

    try {
      setStatus(null)
      const result = await deleteNote(id)

      if (result.success) {
        // 削除成功
        setStatus({
          message: 'ノートが削除されました',
          success: true,
          type: 'delete',
        })

        // ノート一覧から削除したノートを除外
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
      } else {
        // 削除失敗
        setStatus({
          message: result.error || 'ノートの削除に失敗しました',
          success: false,
          type: 'delete',
        })
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
      setStatus({
        message: '予期せぬエラーが発生しました',
        success: false,
        type: 'delete',
      })
    }
  }

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/server-actions-examples" className={styles.backLink}>
          ← 戻る
        </Link>
        <h1>データ更新と再検証</h1>
      </div>

      <div className={styles.explanation}>
        <p>
          このページでは、Server
          Actionsを使用してデータを更新し、関連するキャッシュを再検証する例を示しています。
          ノートの更新や削除を行うと、Server Actionが実行され、関連するキャッシュが再検証されます。
        </p>
        <p>
          <code>revalidateTag</code>と<code>revalidatePath</code>
          を使用して、特定のタグやパスに関連するキャッシュを再検証します。
        </p>
      </div>

      <div className={styles.notesContainer}>
        <h2>ノート一覧</h2>

        {loading ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : notes.length === 0 ? (
          <div className={styles.emptyState}>ノートがありません</div>
        ) : (
          <div className={styles.notesList}>
            {notes.map((note) => (
              <div key={note.id} className={styles.noteCard}>
                {editingNote && editingNote.id === note.id ? (
                  // 編集モード
                  <div className={styles.noteEdit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="title">タイトル</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={editingNote.title}
                        onChange={handleEditChange}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="content">内容</label>
                      <textarea
                        id="content"
                        name="content"
                        value={editingNote.content}
                        onChange={handleEditChange}
                        rows={4}
                        className={styles.textarea}
                      ></textarea>
                    </div>

                    <div className={styles.noteActions}>
                      <button
                        onClick={handleUpdateNote}
                        className={`${styles.button} ${styles.primaryButton}`}
                      >
                        更新
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={`${styles.button} ${styles.secondaryButton}`}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  // 表示モード
                  <>
                    <div className={styles.noteHeader}>
                      <h3>{note.title}</h3>
                      <div className={styles.noteActions}>
                        <button
                          onClick={() => handleEdit(note)}
                          className={`${styles.button} ${styles.smallButton}`}
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className={`${styles.button} ${styles.smallButton} ${styles.dangerButton}`}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    <div className={styles.noteContent}>{note.content}</div>
                    <div className={styles.noteMeta}>
                      <div>作成: {formatDate(note.createdAt)}</div>
                      <div>更新: {formatDate(note.updatedAt)}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {status && (
          <div
            className={`${styles.statusMessage} ${
              status.success ? styles.successMessage : styles.errorMessage
            }`}
          >
            <p>{status.message}</p>
          </div>
        )}
      </div>

      <div className={styles.codeExample}>
        <h2>コード例</h2>
        <div className={styles.codeBlock}>
          <h3>Server Action (更新と再検証)</h3>
          <pre>
            {`&apos;use server&apos;

import { revalidateTag, revalidatePath } from &apos;next/cache&apos;

// ノート更新用の型
export type UpdateNoteInput = {
  id: string
  title: string
  content: string
}

// ノートを更新するServer Action
export async function updateNote(input: UpdateNoteInput) {
  try {
    // 入力検証
    if (!input.id) {
      return { success: false, error: &apos;ノートIDは必須です&apos; }
    }
    if (!input.title.trim()) {
      return { success: false, error: &apos;タイトルは必須です&apos; }
    }

    // ノートを検索
    const noteIndex = notes.findIndex((note) => note.id === input.id)
    if (noteIndex === -1) {
      return { success: false, error: &apos;ノートが見つかりません&apos; }
    }

    // ノートを更新
    const updatedNote = {
      ...notes[noteIndex],
      title: input.title,
      content: input.content,
      updatedAt: new Date().toISOString(),
    }

    // 更新したノートを保存
    notes = [...notes.slice(0, noteIndex), updatedNote, ...notes.slice(noteIndex + 1)]

    // キャッシュを再検証
    revalidateTag(&apos;notes&apos;)
    revalidateTag(\`note-\${input.id}\`)

    return { success: true, data: updatedNote }
  } catch (error) {
    return { success: false, error: &apos;不明なエラーが発生しました&apos; }
  }
}

// ノートを削除するServer Action
export async function deleteNote(id: string) {
  try {
    // 入力検証
    if (!id) {
      return { success: false, error: &apos;ノートIDは必須です&apos; }
    }

    // ノートを検索
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) {
      return { success: false, error: &apos;ノートが見つかりません&apos; }
    }

    // ノートを削除
    notes = [...notes.slice(0, noteIndex), ...notes.slice(noteIndex + 1)]

    // キャッシュを再検証
    revalidateTag(&apos;notes&apos;)
    revalidatePath(&apos;/server-actions-examples/notes&apos;)

    return { success: true }
  } catch (error) {
    return { success: false, error: &apos;不明なエラーが発生しました&apos; }
  }
}`}
          </pre>
        </div>
      </div>

      <div className={styles.note}>
        <h3>再検証のポイント</h3>
        <ul>
          <li>
            <code>revalidateTag</code>
            は、特定のタグに関連するすべてのキャッシュエントリを再検証します。例えば、
            <code>revalidateTag(&apos;notes&apos;)</code>
            は、notesタグが付けられたすべてのキャッシュを再検証します。
          </li>
          <li>
            <code>revalidatePath</code>
            は、特定のパスに関連するキャッシュを再検証します。例えば、
            <code>revalidatePath(&apos;/server-actions-examples/notes&apos;)</code>
            は、指定されたパスのキャッシュを再検証します。
          </li>
          <li>
            データの更新や削除後に適切なキャッシュを再検証することで、ユーザーに常に最新のデータを表示できます。
          </li>
          <li>タグベースの再検証は、関連するデータが複数のページにまたがる場合に特に有効です。</li>
        </ul>
      </div>
    </div>
  )
}
