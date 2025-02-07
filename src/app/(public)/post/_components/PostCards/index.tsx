import { Post } from 'core/domain/entity/post'
import styles from './PostCards.module.scss'

export default function PostCards({ posts }: { posts: Post[] }) {
  return posts.map((post) => (
    <div className={styles.card} key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  ))
}
