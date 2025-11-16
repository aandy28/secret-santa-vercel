import { getAssignment } from '@lib/store'
import AutoPickClient from './AutoPickClient'

export default async function PickPage({ params }: { params: { token: string } }) {
  const token = params.token
  const existing = await getAssignment(token)

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>🎅 Secret Santa</h1>
      <p>Keep this page private — it reveals only your assignment.</p>

      <AutoPickClient token={token} existing={existing} />
    </div>
  )
}
