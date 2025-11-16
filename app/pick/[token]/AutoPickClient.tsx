'use client'

import { useEffect, useState } from 'react'

export default function AutoPickClient({ token, existing }: { token: string, existing: string | null }) {
  // show spinner by default when there is no existing assignment
  const [loading, setLoading] = useState<boolean>(!existing)
  const [assignment, setAssignment] = useState<string | null>(existing)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (assignment) return
    let cancelled = false

    ;(async () => {
      console.log('AutoPickClient: starting pick for token', token)
      try {
        setLoading(true)
        const res = await fetch('/api/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
        if (!cancelled) {
          console.log('AutoPickClient: got response', data)
          setAssignment(data.assignment ?? null)
        }
      } catch (err: any) {
        console.error('AutoPickClient error', err)
        if (!cancelled) setError(err?.message ?? String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  if (assignment) {
    return (
      <div>
        <h2>Your pick:</h2>
        <p style={{ fontSize: 20 }}>{assignment}</p>
      </div>
    )
  }

  return (
    <div>
      {loading ? (
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: '4px solid #ccc',
                borderTopColor: '#333',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <div style={{ marginTop: 10 }}>Picking...</div>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : (
        <div>{error ? <p style={{ color: 'red' }}>Error: {error}</p> : <p>Preparing pick...</p>}</div>
      )}
    </div>
  )
}
