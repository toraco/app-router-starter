import { Metadata } from 'next'
import ClientSection from './_components/ClientSection'
import { getStore } from './fetcher'

export const metadata: Metadata = {
  title: '店舗ページ',
}

type Props = {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: Props) {
  const { storeId } = await params
  const { category } = await searchParams
  const store = await getStore(storeId)

  return (
    <div>
      <h1>This is store page!</h1>
      <p>Store ID: {storeId}.</p>
      <p>Store category: {category}.</p>
      <p>Address: {store.address}</p>
      <ClientSection />
    </div>
  )
}
