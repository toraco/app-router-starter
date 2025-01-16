'use client'

import { useRouter } from 'next/navigation'

export default function Error({ error }: { error: Error }) {
  const router = useRouter()
  const handleBackToHome = () => router.push('/')
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={handleBackToHome}>トップページへ戻る</button>
    </div>
  )
}
