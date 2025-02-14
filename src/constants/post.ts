import { Post } from 'core/domain/entity/post'

export const DUMMY_POSTS: Post[] = [
  {
    authorId: 1,
    categoryId: 1,
    content: 'Frontend Content 1',
    id: 1,
    title: 'Frontend Post 1',
  },
  {
    authorId: 1,
    categoryId: 1,
    content: 'Frontend Content 2',
    id: 2,
    title: ' Frontend Post 2',
  },
  {
    authorId: 1,
    categoryId: 2,
    content: 'Backend Content 3',
    id: 3,
    title: 'Backend Post 3',
  },
  {
    authorId: 2,
    categoryId: 2,
    content: 'Backend Content 4',
    id: 4,
    title: 'Backend Post 4',
  },
  {
    authorId: 2,
    categoryId: 3,
    content: 'Infrastructure Content 5',
    id: 5,
    title: 'Infrastructure Post 5',
  },
  {
    authorId: 3,
    categoryId: 3,
    content: 'Infrastructure Content 6',
    id: 6,
    title: 'Infrastructure Post 6',
  },
]
