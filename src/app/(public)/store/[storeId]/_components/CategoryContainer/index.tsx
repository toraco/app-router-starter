import CategoryList from '../CategoryList'
import { listCategory } from './fetcher'

export default async function CategoryContainer() {
  const categories = await listCategory()
  return <CategoryList categories={categories} />
}
