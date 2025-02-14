export interface Post {
  id: number
  title: string
  content: string
  categoryId: number
  authorId: number
  updatedAt?: Date
}
