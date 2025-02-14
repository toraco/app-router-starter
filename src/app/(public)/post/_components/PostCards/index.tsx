import { Author } from 'core/domain/entity/author'
import { Post } from 'core/domain/entity/post'
import styles from './PostCards.module.scss'

export default function PostCards({ authors, posts }: { authors: Author[]; posts: Post[] }) {
  return posts.map((post) => (
    <div className={styles.card} key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>
        <small>
          By {authors.find((author) => author.id === post.authorId)?.name ?? 'Unknown author'}
        </small>
      </p>
    </div>
  ))
}
