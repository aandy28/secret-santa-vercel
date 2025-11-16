import { promises as fs } from 'fs'
const FILE = '/tmp/santa.json'

type Store = {
  participants: string[],
  assignments: Record<string, string>,
  taken: string[]
}

async function load(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { participants: [], assignments: {}, taken: [] }
  }
}

async function save(data: Store) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function initParticipants(participants: string[]) {
  const data = await load()
  data.participants = participants
  data.assignments = {}
  data.taken = []
  await save(data)
  return data
}

export async function assign(token: string) {
  const data = await load()
  // find participant name from token (we encoded name in token)
  let participantName = null
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts = decoded.split('::')
    participantName = parts[1]
  } catch (e) {
    return null
  }

  if (!participantName) return null
  if (data.assignments[token]) return data.assignments[token]

  const remaining = data.participants.filter(p => p !== participantName && !data.taken.includes(p))
  if (remaining.length === 0) return null

  const pick = remaining[Math.floor(Math.random() * remaining.length)]
  data.assignments[token] = pick
  data.taken.push(pick)
  await save(data)
  return pick
}

export async function getAssignment(token: string) {
  const data = await load()
  return data.assignments[token] || null
}
