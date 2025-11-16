import { NextResponse } from 'next/server'
import { createTokens } from '@lib/generator'
import { initParticipants } from '@lib/store'

export async function POST(req: Request) {
  const body = await req.json()
  console.log('request', body)
  const names = body.names || []
  const restrictions: Record<string, string[]> = body.restrictions || {}
  const tokens = createTokens(names)

  // build a derangement with restriction constraints
  const n = names.length
  let assigned: number[] = []

  function shuffle(arr: number[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  function isValid(assigned: number[]): boolean {
    for (let i = 0; i < n; i++) {
      const assignToIdx = assigned[i]
      const fromName = names[i]
      const toName = names[assignToIdx]

      // can't assign to self
      if (fromName === toName) return false

      // check restrictions
      const restricted = restrictions[fromName] || []
      if (restricted.includes(toName)) return false
    }
    return true
  }

  // initialize indices
  assigned = Array.from({ length: n }, (_, i) => i)

  // try shuffling until we get a valid assignment respecting restrictions
  let attempts = 0
  const maxAttempts = 10000
  do {
    shuffle(assigned)
    attempts++
    if (attempts > maxAttempts) break
  } while (!isValid(assigned))

  // create assignments map
  const assignments: Record<string, string> = {}
  const taken: string[] = []
  if (isValid(assigned)) {
    tokens.forEach((t, i) => {
      const pickName = names[assigned[i]]
      assignments[t.token] = pickName
      taken.push(pickName)
    })
    console.log('create: computed valid assignment with restrictions', { attempts })
  } else {
    console.warn('create: could not compute valid assignment after', { attempts, maxAttempts })
  }

  await initParticipants(names, assignments, taken, restrictions)
  return NextResponse.json({ tokens })
}
