import { NextResponse } from 'next/server'
import { createTokens } from '@lib/generator'
import { initParticipants } from '@lib/store'

export async function POST(req: Request) {
  const body = await req.json()
  console.log('request',body)
  const names = body.names || []
  const tokens = createTokens(names)
  await initParticipants(names)
  return NextResponse.json({ tokens })
}
