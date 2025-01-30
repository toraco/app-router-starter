import { Post } from 'core/domain/entity/post'
import styles from './PostCard.module.scss'

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className={styles.card}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  )
}
