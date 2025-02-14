import PostCards from '../PostCards'
import { listAuthor, listPostByCategory } from './fetcher'

export default async function PostCardContainer({ categoryId }: { categoryId: string }) {
  const [posts, authors] = await Promise.all([listPostByCategory(categoryId), listAuthor()])
  return <PostCards authors={authors} posts={posts} />
}
