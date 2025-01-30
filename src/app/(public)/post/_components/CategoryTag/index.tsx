import classNames from 'classnames'
import Link from 'next/link'
import { Category } from 'core/domain/entity/category'
import styles from './CategoryTag.module.scss'

export default function CategoryTag({
  category,
  isActive,
}: {
  category: Category
  isActive: boolean
}) {
  return (
    <Link href={`/post?categoryId=${category.id}`}>
      <li className={classNames(styles.tag, { [styles.active]: isActive })}>{category.name}</li>
    </Link>
  )
}
