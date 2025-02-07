'use client'

import { useState } from 'react'
import { Cart } from 'core/domain/entity/cart'
import styles from './CartItemForm.module.scss'

type Props = {
  cart: Cart
}

export default function CartItemForm({ cart }: Props) {
  const [items, setItems] = useState<Cart['items']>(cart.items)

  const handleIncrement = (id: number) => {
    setItems((prevState) =>
      prevState.map((item) => {
        return item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      }),
    )
  }

  const handleDecrement = (id: number) => {
    setItems((prevState) =>
      prevState.map((item) => {
        return item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      }),
    )
  }

  return (
    <form className={styles.form}>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={styles.cartItem}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.quantity}>{item.quantity}個</span>
            <button
              className={styles.button}
              onClick={() => handleIncrement(item.id)}
              type="button"
            >
              +
            </button>
            <button
              className={styles.button}
              disabled={item.quantity === 0}
              onClick={() => handleDecrement(item.id)}
              type="button"
            >
              -
            </button>
          </li>
        ))}
      </ul>
    </form>
  )
}
