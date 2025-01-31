import PostCard from '../PostCard'
import { listPostByCategory } from './fetcher'

export default async function PostCardContainer({ categoryId }: { categoryId: string }) {
  const posts = await listPostByCategory(categoryId)
  return posts.map((post) => <PostCard post={post} key={post.id} />)
}
