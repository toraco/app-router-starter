import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '店舗ページ',
}

type Props = {
  params: Promise<{ storeId: string }>
}

export default async function Page({ params }: Props) {
  const { storeId } = await params
  return <h1>This is store page! Store ID is {storeId}.</h1>
}
