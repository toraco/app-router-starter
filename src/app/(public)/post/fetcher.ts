import { Category } from 'core/domain/entity/category'

export async function listCategory(): Promise<Category[]> {
  const res = await fetch(`http://localhost:3000/api/category`, {
    cache: 'force-cache',
  })
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data.categories
}
