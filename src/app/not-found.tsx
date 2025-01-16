import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <p>お探しのページが見つかりません。</p>
      <Link href="/">
        <button>トップページへ戻る</button>
      </Link>
    </div>
  )
}
