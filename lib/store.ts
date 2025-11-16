import { promises as fs } from 'fs'
const FILE = '/tmp/santa.json'

type Store = {
  participants: string[],
  assignments: Record<string, string>,
  taken: string[],
  restrictions: Record<string, string[]>
}

async function load(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, 'utf8')
    console.log(raw);
    return JSON.parse(raw)
  } catch {
    return { participants: [], assignments: {}, taken: [], restrictions: {} }
  }
}

async function save(data: Store) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function initParticipants(participants: string[], assignments?: Record<string, string>, taken?: string[], restrictions?: Record<string, string[]>) {
  const data = await load()
  data.participants = participants
  data.assignments = assignments ?? {}
  data.taken = taken ?? []
  data.restrictions = restrictions ?? {}
  await save(data)
  return data
}

export async function assign(token: string) {
  const data = await load()
  // find participant name from token (we encoded name in token)
  let participantName: string | null = null
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts = decoded.split('::')
    // join the rest in case the name contains '::', then trim
    participantName = parts.slice(1).join('::').trim() || null
  } catch (e) {
    console.error('assign: token decode failed', { token, err: String(e) })
    return null
  }

  if (!participantName) {
    console.error('assign: no participant name found after decoding', { token })
    return null
  }

  // if already assigned, return existing pick
  if (data.assignments[token]) {
    console.log('assign: already has assignment', { token, pick: data.assignments[token] })
    return data.assignments[token]
  }

  // compute remaining eligible participants
  const remaining = data.participants.filter(p => p !== participantName && !data.taken.includes(p))
  if (remaining.length === 0) {
    console.error('assign: no remaining eligible participants', { participantName, participants: data.participants, taken: data.taken })
    return null
  }

  const pick = remaining[Math.floor(Math.random() * remaining.length)]
  data.assignments[token] = pick
  data.taken.push(pick)
  await save(data)
  console.log('assign: assigned pick', { token, participantName, pick })
  return pick
}

export async function getAssignment(token: string) {
  const data = await load()
  const assignment = data.assignments[token] || null
  if (assignment) console.log('getAssignment: found', { token, assignment })
  else console.log('getAssignment: none for token', { token })
  return assignment
}
