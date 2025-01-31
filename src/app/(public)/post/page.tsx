import { Metadata } from 'next'
import { Suspense } from 'react'
import Skeleton from 'components/Skeleton'
import CategoryTag from './_components/CategoryTag'
import PostCardContainer from './_components/PostCardContainer'
import { listCategory } from './fetcher'
import styles from './Post.module.scss'

export const metadata: Metadata = {
  title: '投稿ページ',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: Props) {
  const { categoryId } = await searchParams
  const categories = await listCategory()
  const cid = typeof categoryId === 'string' ? categoryId : ''

  return (
    <div>
      <h1>Post Page</h1>
      <h2>Categories</h2>
      <ul className={styles.categoryList}>
        {categories.map((category) => {
          return (
            <CategoryTag
              category={category}
              key={category.id}
              isActive={category.id === Number(cid)}
            />
          )
        })}
      </ul>
      <h2>Posts</h2>
      <div className={styles.postList}>
        <Suspense
          key={cid}
          fallback={[...Array(2)].map((_, index) => (
            <Skeleton key={index} height={80} />
          ))}
        >
          <PostCardContainer categoryId={cid} />
        </Suspense>
      </div>
    </div>
  )
}
