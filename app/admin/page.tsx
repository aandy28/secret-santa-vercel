'use client'
import { useState } from 'react'

export default function AdminPage() {
  const [names, setNames] = useState<string[]>([
    'Alice','Bob','Carl','Dana','Eve','Frank','Gina','Harry','Ivy','John'
  ])
  const [links, setLinks] = useState<{name:string; url:string}[]>([])
  const [loading, setLoading] = useState(false)

  async function create() {
    setLoading(true)
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ names })
    })
    const data = await res.json()
    setLinks(data.tokens.map((t:any) => ({ name: t.name, url: `${location.origin}/pick/${t.token}` })))
    setLoading(false)
  }

  function updateName(i:number, v:string){
    setNames(n => n.map((x, idx) => idx===i ? v : x))
  }

  return (
    <div className="container">
      <h1>Secret Santa — Admin</h1>
      <p>Edit the 10 participant names, then click <strong>Generate Links</strong>.</p>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        {names.map((n, i) => (
          <input key={i} value={n} onChange={(e)=>updateName(i, e.target.value)} />
        ))}
      </div>

      <div style={{marginTop:12}}>
        <button onClick={create} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Links'}
        </button>
      </div>

      {links.length>0 && (
        <div style={{marginTop:20}}>
          <h2>Shareable links</h2>
          <ul>
            {links.map(l=>(
              <li key={l.name}>
                {l.name}: <a href={l.url} target="_blank" rel="noreferrer">{l.url}</a>
              </li>
            ))}
          </ul>
          <p>Copy these links and send via WhatsApp.</p>
        </div>
      )}
    </div>
  )
}
