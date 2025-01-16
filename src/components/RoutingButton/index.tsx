'use client'

import { useRouter } from 'next/navigation'
import styles from './RoutingButton.module.scss'

type Props = {
  path: string
}

export default function RoutingButton({ path }: Props) {
  const router = useRouter()
  return (
    <button className={styles.button} onClick={() => router.push(path)}>
      Routing to {path}
    </button>
  )
}
