import { Metadata } from 'next'
import CategoryTag from './_components/CategoryTag'
import PostCard from './_components/PostCard'
import { listCategory, listPostByCategory } from './fetcher'
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
  const posts = await listPostByCategory(categoryId)

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
              isActive={category.id === Number(categoryId)}
            />
          )
        })}
      </ul>
      <h2>Posts</h2>
      <div className={styles.postList}>
        {posts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  )
}
