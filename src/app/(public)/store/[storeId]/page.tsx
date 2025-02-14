import { Metadata } from 'next'
import { Suspense } from 'react'
import Skeleton from '../../../../components/Skeleton'
import CategoryContainer from './_components/CategoryContainer'
import StoreContainer from './_components/StoreContainer'

export const metadata: Metadata = {
  title: '店舗ページ',
}

type Props = {
  params: Promise<{ storeId: string }>
}

export default async function Page({ params }: Props) {
  const { storeId } = await params
  return (
    <div>
      <Suspense fallback={<Skeleton height={256} />}>
        <StoreContainer storeId={storeId} />
      </Suspense>
      <Suspense fallback={<Skeleton height={128} />}>
        <CategoryContainer />
      </Suspense>
    </div>
  )
}
