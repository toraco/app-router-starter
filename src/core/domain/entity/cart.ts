export interface Cart {
  amount: number
  items: {
    id: number
    name: string
    quantity: number
    price: number
  }[]
}
