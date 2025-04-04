import { getNotes } from '../_lib/actions'
import RevalidationPresentation from './presentation'

export default async function RevalidationContainer() {
  const notes = await getNotes()
  return <RevalidationPresentation notes={notes} />
}
