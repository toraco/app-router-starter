import Link from 'next/link'
import styles from './page.module.scss'

export default function ServerActionsExamplesPage() {
  return (
    <div className={styles.container}>
      <h1>Server Actions (サーバーアクション)</h1>

      <div className={styles.explanation}>
        <p>
          Server Actionsは、Next.js App
          Routerの機能で、クライアントコンポーネントからサーバーサイドの関数を直接呼び出すことができます。
          これにより、フォーム送信やデータ更新などのサーバーサイド処理をシームレスに実装できます。
        </p>
        <p>Server Actionsの主な特徴：</p>
        <ul>
          <li>サーバーサイドで実行される関数を定義し、クライアントから呼び出せる</li>
          <li>フォーム処理と統合しやすい</li>
          <li>データ変更後のキャッシュ再検証と組み合わせて使用できる</li>
          <li>プログレッシブエンハンスメントをサポート（JavaScriptが無効でも動作）</li>
        </ul>
      </div>

      <div className={styles.examples}>
        <h2>サンプル例</h2>
        <p>以下のサンプルで、Server Actionsの様々な使用パターンを確認できます：</p>

        <div className={styles.exampleCard}>
          <h3>基本的なフォーム処理</h3>
          <p>
            Server Actionsを使用した基本的なフォーム処理の例です。
            フォームデータの送信と処理をサーバーサイドで行います。
          </p>
          <Link href="/server-actions-examples/basic-form" className={styles.link}>
            基本的なフォーム処理の例を見る
          </Link>
        </div>

        <div className={styles.exampleCard}>
          <h3>データ更新と再検証</h3>
          <p>
            Server Actionsを使用してデータを更新し、関連するキャッシュを再検証する例です。
            <code>revalidateTag</code>と<code>revalidatePath</code>を使用します。
          </p>
          <Link href="/server-actions-examples/revalidation" className={styles.link}>
            データ更新と再検証の例を見る
          </Link>
        </div>

        <div className={styles.exampleCard}>
          <h3>Optimistic Updates</h3>
          <p>
            Server Actionsと組み合わせて、Optimistic UI更新を実装する例です。
            ユーザー操作に対して即座にUIを更新し、バックグラウンドでサーバー処理を行います。
          </p>
          <Link href="/server-actions-examples/optimistic-updates" className={styles.link}>
            Optimistic Updatesの例を見る
          </Link>
        </div>

        <div className={styles.exampleCard}>
          <h3>バリデーションとエラーハンドリング</h3>
          <p>
            Server Actionsでのフォームバリデーションとエラーハンドリングの例です。
            サーバーサイドでの検証とクライアントへのエラーメッセージの返却方法を示します。
          </p>
          <Link href="/server-actions-examples/validation" className={styles.link}>
            バリデーションとエラーハンドリングの例を見る
          </Link>
        </div>
      </div>

      <div className={styles.codeExample}>
        <h2>Server Actionsの基本的な実装</h2>
        <pre>
          {`// actions.ts
&apos;use server&apos;

import { revalidateTag } from &apos;next/cache&apos;

// Server Actionの定義
export async function createItem(formData: FormData) {
  // フォームデータの取得
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  // バリデーション
  if (!name || name.length < 3) {
    return { success: false, error: '名前は3文字以上必要です' }
  }

  try {
    // データの保存処理（例：データベースへの保存）
    const newItem = await saveItemToDatabase({ name, description })
    
    // 関連するキャッシュの再検証
    revalidateTag('items')
    
    return { success: true, data: newItem }
  } catch (error) {
    return { success: false, error: 'アイテムの作成に失敗しました' }
  }
}

// クライアントコンポーネントでの使用例
&apos;use client&apos;

import { createItem } from &apos;./actions&apos;
import { useState } from &apos;react&apos;

export default function ItemForm() {
  const [status, setStatus] = useState({ success: false, message: '' })

  async function handleSubmit(formData: FormData) {
    const result = await createItem(formData)
    
    if (result.success) {
      setStatus({ success: true, message: 'アイテムが作成されました' })
    } else {
      setStatus({ success: false, message: result.error || 'エラーが発生しました' })
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="アイテム名" required />
      <textarea name="description" placeholder="説明" />
      <button type="submit">作成</button>
      
      {status.message && (
        <p className={status.success ? 'success' : 'error'}>
          {status.message}
        </p>
      )}
    </form>
  )
}`}
        </pre>
      </div>

      <div className={styles.note}>
        <h2>Server Actionsの重要なポイント</h2>
        <ul>
          <li>
            <code>&apos;use server&apos;</code>
            ディレクティブを使用して、サーバーサイドで実行される関数を定義します
          </li>
          <li>
            フォームの<code>action</code>属性にServer Actionを直接指定できます
          </li>
          <li>
            <code>revalidateTag</code>や<code>revalidatePath</code>
            と組み合わせて、データ更新後のキャッシュを再検証できます
          </li>
          <li>
            Server Actionsは、JavaScriptが無効な環境でも動作します（プログレッシブエンハンスメント）
          </li>
          <li>
            エラーハンドリングとバリデーションを適切に実装することで、堅牢なフォーム処理が可能です
          </li>
          <li>Optimistic UI更新と組み合わせることで、ユーザー体験を向上させることができます</li>
        </ul>
      </div>
    </div>
  )
}
