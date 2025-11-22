import { promises as fs } from 'fs'

export type Store = {
  participants: string[]
  assignments: Record<string, string>
  taken: string[]
  restrictions: Record<string, string[]>
}

const FILE = '/tmp/santa.json'
const KV_KEY = 'santa:store'

// Determine if we're using KV (production/Vercel) or filesystem (development)
async function getKV() {
  if (process.env.KV_URL) {
    try {
      // @ts-ignore - @vercel/kv may not be installed in dev
      const { kv } = await import('@vercel/kv')
      return kv
    } catch {
      return null
    }
  }
  return null
}

export async function loadStore(): Promise<Store> {
  const kv = await getKV()

  if (kv) {
    try {
      const data = await kv.get(KV_KEY)
      if (data) {
        console.log('[storage] loaded from KV')
        return data as Store
      }
    } catch (err) {
      console.error('[storage] KV read failed, falling back to filesystem', err)
    }
  }

  // Filesystem fallback
  try {
    const raw = await fs.readFile(FILE, 'utf8')
    console.log('[storage] loaded from filesystem')
    return JSON.parse(raw)
  } catch {
    console.log('[storage] no store found, returning empty')
    return { participants: [], assignments: {}, taken: [], restrictions: {} }
  }
}

export async function saveStore(data: Store): Promise<void> {
  const kv = await getKV()

  if (kv) {
    try {
      await kv.set(KV_KEY, data)
      console.log('[storage] saved to KV')
    } catch (err) {
      console.error('[storage] KV write failed', err)
      // Continue to filesystem fallback
    }
  }

  // Always also save to filesystem for local dev
  try {
    await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
    console.log('[storage] saved to filesystem')
  } catch (err) {
    console.error('[storage] filesystem write failed', err)
  }
}
