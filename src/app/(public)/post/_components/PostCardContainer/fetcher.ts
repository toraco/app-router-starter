import { Post } from 'core/domain/entity/post'

export async function listPostByCategory(categoryId: string): Promise<Post[]> {
  const params = new URLSearchParams()
  if (categoryId) {
    params.append('categoryId', categoryId)
  }
  const res = await fetch(`http://localhost:3000/api/post?${params.toString()}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data.posts
}
