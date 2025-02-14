import { Post } from 'core/domain/entity/post'

export const DUMMY_POSTS: Post[] = [
  {
    categoryId: 1,
    content: 'Frontend Content 1',
    id: 1,
    title: 'Frontend Post 1',
  },
  {
    categoryId: 1,
    content: 'Frontend Content 2',
    id: 2,
    title: ' Frontend Post 2',
  },
  {
    categoryId: 2,
    content: 'Backend Content 3',
    id: 3,
    title: 'Backend Post 3',
  },
  {
    categoryId: 2,
    content: 'Backend Content 4',
    id: 4,
    title: 'Backend Post 4',
  },
  {
    categoryId: 3,
    content: 'Infrastructure Content 5',
    id: 5,
    title: 'Infrastructure Post 5',
  },
  {
    categoryId: 3,
    content: 'Infrastructure Content 6',
    id: 6,
    title: 'Infrastructure Post 6',
  },
]
