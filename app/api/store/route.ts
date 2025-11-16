import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'

const FILE = '/tmp/santa.json'

export async function GET() {
  try {
    const raw = await fs.readFile(FILE, 'utf8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read store', details: err?.message }, { status: 500 })
  }
}
