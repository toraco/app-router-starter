import { Metadata } from 'next'
import { Cart } from 'core/domain/entity/cart'
import CartItemForm from './_components/CartItemForm'
import { getCart } from './fetcher'

export const metadata: Metadata = {
  title: 'カート',
}

export default async function CartContainer() {
  const cart = await getCart()
  return <CartPresentation cart={cart} />
}

type Props = {
  cart: Cart
}

function CartPresentation({ cart }: Props) {
  return (
    <div>
      <h1>This is your cart!</h1>
      <CartItemForm cart={cart} />
    </div>
  )
}
