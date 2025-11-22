import { loadStore, saveStore, type Store } from './storage'

export async function initParticipants(participants: string[], assignments?: Record<string, string>, taken?: string[], restrictions?: Record<string, string[]>) {
  const data = await loadStore()
  data.participants = participants
  data.assignments = assignments ?? {}
  data.taken = taken ?? []
  data.restrictions = restrictions ?? {}
  await saveStore(data)
  return data
}

export async function assign(token: string) {
  const data = await loadStore()
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
  const remaining = data.participants.filter((p: string) => p !== participantName && !data.taken.includes(p))
  if (remaining.length === 0) {
    console.error('assign: no remaining eligible participants', { participantName, participants: data.participants, taken: data.taken })
    return null
  }

  const pick = remaining[Math.floor(Math.random() * remaining.length)]
  data.assignments[token] = pick
  data.taken.push(pick)
  await saveStore(data)
  console.log('assign: assigned pick', { token, participantName, pick })
  return pick
}

export async function getAssignment(token: string) {
  const data = await loadStore()
  const assignment = data.assignments[token] || null
  if (assignment) console.log('getAssignment: found', { token, assignment })
  else console.log('getAssignment: none for token', { token })
  return assignment
}
