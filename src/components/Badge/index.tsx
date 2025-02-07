import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import styles from './Badge.module.scss'

type Props = {
  badgeCount: number
  children: ReactNode
}

const Badge: FC<Props> = ({ badgeCount, children }) => (
  <span className={classNames(styles.wrapper)}>
    {children}
    <span className={classNames(styles.badge)}>{badgeCount}</span>
  </span>
)

export default Badge
