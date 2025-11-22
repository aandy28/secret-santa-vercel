'use client'
import { useState, useEffect } from 'react'

type StoreData = {
  participants: string[]
  assignments: Record<string, string>
  taken: string[]
  restrictions: Record<string, string[]>
}

export default function AdminPage() {
  const [names, setNames] = useState<string[]>([
    'Andy', 'Meg', 'Mark', 'Heidi', 'Chris', 'Becca', 'Tom', 'Michaela', 'Pete', 'Julia'
  ])
  const [restrictions, setRestrictions] = useState<Record<string, string[]>>({
    'Andy': ['Meg'],
    'Meg': ['Andy'],
    'Mark': ['Heidi'],
    'Heidi': ['Mark'],
    'Chris': ['Becca'],
    'Becca': ['Chris'],
    'Tom': ['Michaela'],
    'Michaela': ['Tom'],
    'Pete': ['Julia'],
    'Julia': ['Pete']
  })
  const [links, setLinks] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [store, setStore] = useState<StoreData | null>(null)
  const [showStore, setShowStore] = useState(false)

  async function loadStore() {
    try {
      const res = await fetch('/api/store')
      const data = await res.json()
      setStore(data)
    } catch (err) {
      console.error('Failed to load store', err)
    }
  }

  useEffect(() => {
    if (showStore) loadStore()
  }, [showStore])

  async function create() {
    setLoading(true)
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ names, restrictions })
    })
    const data = await res.json()
    setLinks(data.tokens.map((t: any) => ({ name: t.name, url: `${location.origin}/pick/${t.token}` })))
    setLoading(false)
    loadStore()
  }

  function updateName(i: number, v: string) {
    setNames(n => n.map((x, idx) => idx === i ? v : x))
  }

  function toggleRestriction(name: string, restricted: string) {
    setRestrictions(r => {
      const current = r[name] || []
      const updated = current.includes(restricted)
        ? current.filter(n => n !== restricted)
        : [...current, restricted]
      return { ...r, [name]: updated }
    })
  }

  return (
    <div className="container">
      <h1>Secret Santa — Admin</h1>
      <p>Edit the participant names, set restrictions (pairs who can't be assigned to each other), then click <strong>Generate Links</strong>.</p>

      <h2>Participants</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {names.map((n, i) => (
          <input key={i} value={n} onChange={(e) => updateName(i, e.target.value)} />
        ))}
      </div>

      <h2>Restrictions (pairs that can't be assigned to each other)</h2>
      <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {names.map(name => (
          <div key={name} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 4 }}>
            <strong>{name}</strong>
            <div style={{ marginTop: 8, fontSize: 14 }}>
              {names
                .filter(n => n !== name)
                .map(other => (
                  <label key={other} style={{ display: 'block', marginBottom: 4 }}>
                    <input
                      type="checkbox"
                      checked={(restrictions[name] || []).includes(other)}
                      onChange={() => toggleRestriction(name, other)}
                    />
                    {' '}{other}
                  </label>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={create} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Links'}
        </button>
        {' '}
        <button onClick={() => setShowStore(!showStore)}>
          {showStore ? 'Hide' : 'Show'} Store Contents
        </button>
      </div>

      {links.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2>Shareable links</h2>
          <ul>
            {links.map(l => (
              <li key={l.name}>
                {l.name}: <a href={l.url} target="_blank" rel="noreferrer">{l.url}</a>
              </li>
            ))}
          </ul>
          <p>Copy these links and send via WhatsApp.</p>
        </div>
      )}

      {showStore && store && (
        <div style={{ marginTop: 20, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <h2>Store Contents</h2>
          <pre style={{ overflow: 'auto', fontSize: 12 }}>
            {JSON.stringify(store, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
