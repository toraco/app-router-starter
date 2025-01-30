import { CSSProperties, FC } from 'react'
import styles from './Skeleton.module.scss'

type SkeletonProps = {
  width?: number | string
  height?: number | string
  ariaLabel?: string
}

const Skeleton: FC<SkeletonProps> = ({
  ariaLabel = 'Loading...',
  height = '100%',
  width = '100%',
}) => {
  const stylesInline: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
  }

  return (
    <div
      className={styles.skeleton}
      style={stylesInline}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <span className={styles.screenReader}>Loading...</span>
    </div>
  )
}

export default Skeleton
