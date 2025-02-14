import { Store } from 'core/domain/entity/store'

export default function StoreSection({ store }: { store: Store }) {
  return (
    <div>
      <h1>This is store page!</h1>
      <p>Store ID: {store.id}.</p>
      <p>Store category: {store.category}.</p>
      <p>Address: {store.address}</p>
    </div>
  )
}
