'use client'

import { useState } from 'react'

function cookie(name: string) { return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1] }

export function AiConsole() {
  const [orgId, setOrgId] = useState('')
  const [query, setQuery] = useState('Give me project risks summary')
  const [resp, setResp] = useState<any>(null)

  async function ask() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/ai/query`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ orgId, query }),
    })
    setResp(await res.json())
  }

  return <div className="glass rounded-xl border border-edge p-4"><h3 className="mb-2 font-semibold">AI Core</h3><input value={orgId} onChange={(e)=>setOrgId(e.target.value)} placeholder="orgId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" /><textarea value={query} onChange={(e)=>setQuery(e.target.value)} className="mb-2 min-h-20 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" /><button onClick={ask} className="rounded-lg bg-neon px-4 py-2">Ask AI</button>{resp ? <pre className="mt-3 overflow-auto rounded-lg border border-edge bg-black/30 p-3 text-xs">{JSON.stringify(resp,null,2)}</pre> : null}</div>
}
