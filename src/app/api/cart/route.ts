import { NextResponse } from 'next/server'
import { Cart } from 'core/domain/entity/cart'
import { sleep } from '../utils'

export async function GET() {
  try {
    // 本来であれば Headers や Cookie からユーザーのセッショントークンを取得してデータベースから取得する
    await sleep(1000)
    console.log('カートを取得します')

    const cart: Cart = {
      amount: 1000,
      items: [
        {
          id: 1,
          name: 'りんご',
          price: 200,
          quantity: 2,
        },
        {
          id: 2,
          name: 'みかん',
          price: 300,
          quantity: 2,
        },
      ],
    }

    return NextResponse.json({ cart, message: 'カートを取得しました。' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        message: 'カートの取得に失敗しました。',
        posts: [],
      },
      { status: 500 },
    )
  }
}
