import { NextResponse } from 'next/server'
import { assign } from '@lib/store'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token } = body || {}
    if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 })

    const assignment = await assign(token)
    if (assignment == null) {
      return NextResponse.json({ error: 'no assignment available' }, { status: 404 })
    }
    return NextResponse.json({ assignment })
  } catch (err: any) {
    console.error('assign route error', err)
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
