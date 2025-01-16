import Link from 'next/link'
import RoutingButton from 'components/RoutingButton'

export default function Page() {
  return (
    <div>
      <h1>This is Top Page!</h1>
      <div>
        <Link href="/mypage">Go to My Page by Link Component</Link>
      </div>
      <div>
        <RoutingButton path="/store/123" />
      </div>
    </div>
  )
}
