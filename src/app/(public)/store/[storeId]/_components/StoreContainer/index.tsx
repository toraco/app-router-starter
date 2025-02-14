import StoreSection from '../StoreSection'
import { getStore } from './fetcher'

export default async function StoreContainer({ storeId }: { storeId: string }) {
  const store = await getStore(storeId)
  return <StoreSection store={store} />
}
