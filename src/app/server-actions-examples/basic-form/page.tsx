'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createNote } from '../_lib/actions'
import styles from './page.module.scss'

export default function BasicFormPage() {
  const [status, setStatus] = useState<{
    success: boolean
    message: string
    noteId?: string
  } | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setStatus(null)

    try {
      const title = formData.get('title') as string
      const content = formData.get('content') as string

      const result = await createNote({ content, title })

      if (result.success) {
        setStatus({
          message: 'ノートが作成されました',
          noteId: result.data?.id,
          success: true,
        })
        // フォームをリセット
        formData.set('title', '')
        formData.set('content', '')
        ;(document.getElementById('note-form') as HTMLFormElement).reset()
      } else {
        setStatus({
          message: result.error || 'エラーが発生しました',
          success: false,
        })
      }
    } catch (error) {
      setStatus({
        message: '予期せぬエラーが発生しました',
        success: false,
      })
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/server-actions-examples" className={styles.backLink}>
          ← 戻る
        </Link>
        <h1>基本的なフォーム処理</h1>
      </div>

      <div className={styles.explanation}>
        <p>
          このページでは、Server Actionsを使用した基本的なフォーム処理を示しています。
          フォームを送信すると、データはサーバーサイドで処理され、結果がクライアントに返されます。
        </p>
        <p>
          <code>action</code>属性にServer
          Actionを直接指定することで、フォームデータの送信と処理を簡単に実装できます。
        </p>
      </div>

      <div className={styles.formContainer}>
        <h2>新しいノートを作成</h2>
        <form id="note-form" action={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="ノートのタイトルを入力"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">内容</label>
            <textarea
              id="content"
              name="content"
              rows={5}
              placeholder="ノートの内容を入力"
              className={styles.textarea}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${styles.button} ${isSubmitting ? styles.buttonDisabled : ''}`}
          >
            {isSubmitting ? '送信中...' : 'ノートを作成'}
          </button>
        </form>

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
          <h3>クライアントコンポーネント</h3>
          <pre>
            {`'use client'

import { useState } from 'react'
import { createNote } from '../_lib/actions'

export default function NoteForm() {
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    try {
      const title = formData.get('title') as string
      const content = formData.get('content') as string
      
      const result = await createNote({ title, content })
      
      if (result.success) {
        setStatus({
          success: true,
          message: 'ノートが作成されました'
        })
        // フォームをリセット
        document.getElementById('note-form').reset()
      } else {
        setStatus({
          success: false,
          message: result.error || 'エラーが発生しました'
        })
      }
    } catch (error) {
      setStatus({
        success: false,
        message: '予期せぬエラーが発生しました'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form id="note-form" action={handleSubmit}>
      <div>
        <label htmlFor="title">タイトル</label>
        <input type="text" id="title" name="title" required />
      </div>

      <div>
        <label htmlFor="content">内容</label>
        <textarea id="content" name="content"></textarea>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : 'ノートを作成'}
      </button>
      
      {status && (
        <div className={status.success ? 'success' : 'error'}>
          <p>{status.message}</p>
        </div>
      )}
    </form>
  )
}`}
          </pre>
        </div>

        <div className={styles.codeBlock}>
          <h3>Server Action</h3>
          <pre>
            {`'use server'

import { revalidateTag } from 'next/cache'

export type CreateNoteInput = {
  title: string
  content: string
}

export type Note = {
  id: string
  title: string
  content: string
  createdAt: string
}

export async function createNote(input: CreateNoteInput) {
  try {
    // 入力検証
    if (!input.title.trim()) {
      return { success: false, error: 'タイトルは必須です' }
    }

    // 新しいノートを作成（実際のアプリではデータベースに保存）
    const newNote = {
      id: Date.now().toString(),
      title: input.title,
      content: input.content,
      createdAt: new Date().toISOString()
    }

    // キャッシュを再検証
    revalidateTag('notes')

    return { success: true, data: newNote }
  } catch (error) {
    return { success: false, error: '不明なエラーが発生しました' }
  }
}`}
          </pre>
        </div>
      </div>

      <div className={styles.note}>
        <h3>ポイント</h3>
        <ul>
          <li>
            フォームの<code>action</code>属性にServer
            Actionを直接指定することで、フォームデータの送信と処理を簡単に実装できます。
          </li>
          <li>
            Server
            Actionsは、JavaScriptが無効な環境でも動作します（プログレッシブエンハンスメント）。
          </li>
          <li>
            クライアントコンポーネントでは、送信状態や結果の表示などのUI関連の処理を行います。
          </li>
          <li>
            サーバーコンポーネントでは、データの検証、保存、キャッシュの再検証などのサーバーサイド処理を行います。
          </li>
        </ul>
      </div>
    </div>
  )
}
