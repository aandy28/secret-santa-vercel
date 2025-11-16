import { getAssignment, assign } from '@lib/store'

export default async function PickPage({ params }: { params: { token: string } }) {
  const token = params.token
  const existing = await getAssignment(token)

  async function pickAction(formData: FormData): Promise<void> {
    'use server'
    // call assign on server, ignore returned value to satisfy form action typing
    await assign(token)
  }

  return (
    <div style={{padding:40, textAlign:'center'}}>
      <h1>🎅 Secret Santa</h1>
      <p>Keep this page private — it reveals only your assignment.</p>

      {existing ? (
        <div>
          <h2>Your pick:</h2>
          <p style={{fontSize:20}}>{existing}</p>
        </div>
      ) : (
        <form action={pickAction}>
          <button type="submit" style={{padding:'10px 20px', fontSize:18}}>Pick Now</button>
        </form>
      )}
    </div>
  )
}
