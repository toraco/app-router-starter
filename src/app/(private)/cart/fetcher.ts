import { Cart } from 'core/domain/entity/cart'

export async function getCart(): Promise<Cart> {
  const res = await fetch(`http://localhost:3000/api/cart`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data.cart
}
