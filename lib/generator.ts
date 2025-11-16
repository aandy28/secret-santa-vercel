export function createTokens(participants: string[]) {
  return participants.map((name) => {
    const seed = Math.random().toString(36).slice(2,10)
    const token = Buffer.from(seed + '::' + name).toString('base64url')
    return { name, token }
  })
}
