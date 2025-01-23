'use client'

import { useParams, useSearchParams } from 'next/navigation'

export default function ClientSection() {
  const params = useParams()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  return (
    <section>
      <h2>Client component section is below</h2>
      <p>Store ID: {params.storeId}</p>
      <p>Store Category: {category}</p>
    </section>
  )
}
