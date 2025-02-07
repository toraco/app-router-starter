import Image from 'next/image'
import Link from 'next/link'
import Badge from 'components/Badge'
import styles from './CartMenu.module.scss'
import { countItems } from './fetcher'

export default async function CartMenu() {
  const amount = await countItems()
  return (
    <Link className={styles.flex} href="/cart">
      <span>カートページへ</span>
      <Badge badgeCount={amount}>
        <Image alt="カート" height={28} src="/icon/cart.svg" width={28} />
      </Badge>
    </Link>
  )
}
