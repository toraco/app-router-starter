import { Category } from 'core/domain/entity/category'
import { Post } from 'core/domain/entity/post'

export async function listPostByCategory(
  categoryId: string | string[] | undefined,
): Promise<Post[]> {
  const params = new URLSearchParams()
  if (typeof categoryId === 'string') {
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

export async function listCategory(): Promise<Category[]> {
  const res = await fetch(`http://localhost:3000/api/category`)
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data.categories
}
