'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function KnowledgeConsole() {
  const [orgId, setOrgId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [docs, setDocs] = useState<any[]>([])
  const [msg, setMsg] = useState('')

  async function fetchDocs() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/knowledge/documents`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    const data = await res.json()
    setDocs(Array.isArray(data) ? data : [])
  }

  async function createDoc() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/knowledge/documents`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ title, content: { body: content }, createdById: 'user_demo' }),
    })
    setMsg(res.ok ? 'Document created' : 'Failed to create')
    if (res.ok) fetchDocs()
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-3 font-semibold">Knowledge Base</h3>
        <input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="orgId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Document content" className="mb-2 min-h-24 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <div className="flex gap-2">
          <button onClick={createDoc} className="rounded-lg bg-neon px-4 py-2">Create</button>
          <button onClick={fetchDocs} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button>
        </div>
        {msg ? <p className="mt-2 text-sm text-cyan">{msg}</p> : null}
      </section>

      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-3 font-semibold">Documents</h3>
        <div className="space-y-2">
          {docs.map((d) => (
            <article key={d.id} className="rounded-lg border border-edge p-3">
              <div className="font-medium">{d.title}</div>
              <div className="text-xs text-slate-400">{d.id}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
