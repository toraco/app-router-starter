import { Metadata } from 'next'
import CartItemForm from './_components/CartItemForm'
import { getCart } from './fetcher'

export const metadata: Metadata = {
  title: 'カート',
}

export default async function Page() {
  const cart = await getCart()
  return (
    <div>
      <h1>This is your cart!</h1>
      <CartItemForm cart={cart} />
    </div>
  )
}
