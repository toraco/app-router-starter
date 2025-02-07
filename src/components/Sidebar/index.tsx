'use client'

import classNames from 'classnames'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import styles from './Sidebar.module.scss'

type Props = {
  children: ReactNode
}

export default function Sidebar({ children }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleToggleSidebar = () => setIsOpen((prevState) => !prevState)

  return (
    <aside className={classNames(styles.sidebar, { [styles.open]: isOpen })}>
      {children}
      <button className={styles.toggleButton} onClick={handleToggleSidebar}>
        <Image
          src={isOpen ? '/icon/arrow_right.svg' : '/icon/arrow_left.svg'}
          alt="サイドバーの開閉"
          width={24}
          height={24}
        />
      </button>
    </aside>
  )
}
