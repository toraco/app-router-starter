import PostCards from '../PostCards'
import { listPostByCategory } from './fetcher'

export default async function PostCardContainer({ categoryId }: { categoryId: string }) {
  const posts = await listPostByCategory(categoryId)
  return <PostCards posts={posts} />
}
