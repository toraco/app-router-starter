import classNames from 'classnames'
import Link from 'next/link'
import { Category } from 'core/domain/entity/category'
import styles from './CategoryList.module.scss'

export default function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className={styles.section}>
      <h2>Check posts of this store!</h2>
      <p>Click on the category you are interested in</p>
      <ul className={styles.list}>
        {categories.map((category) => (
          <Link href={`/post?categoryId=${category.id}`} key={category.id}>
            <li className={classNames(styles.listItem)}>{category.name}</li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
