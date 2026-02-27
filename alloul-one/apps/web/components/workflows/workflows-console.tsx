'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function WorkflowsConsole() {
  const [orgId, setOrgId] = useState('')
  const [name, setName] = useState('Auto Complete')
  const [workflows, setWorkflows] = useState<any[]>([])
  const [runId, setRunId] = useState('')
  const [logs, setLogs] = useState<any[]>([])

  async function list() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/workflows`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setWorkflows(await res.json())
  }

  async function create() {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/workflows`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({
        name,
        definition: { trigger: 'manual', actions: [{ type: 'log', message: 'hello' }] },
      }),
    })
    list()
  }

  async function run(workflowId: string) {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/workflows/${workflowId}/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ input: { source: 'ui' } }),
    })
    const data = await res.json()
    setRunId(data.id)
  }

  async function fetchLogs() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/workflows/runs/${runId}/logs`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setLogs(await res.json())
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Workflows</h3>
        <input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="orgId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="workflow name" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <div className="flex gap-2">
          <button onClick={create} className="rounded-lg bg-neon px-4 py-2">Create</button>
          <button onClick={list} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button>
        </div>
        <div className="mt-3 space-y-2">
          {workflows.map((w) => (
            <div key={w.id} className="flex items-center justify-between rounded-lg border border-edge p-2 text-sm">
              <span>{w.name}</span>
              <button onClick={() => run(w.id)} className="rounded border border-cyan/40 px-2 py-1 text-cyan">Run</button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Run Logs</h3>
        <input value={runId} onChange={(e) => setRunId(e.target.value)} placeholder="runId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <button onClick={fetchLogs} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Load logs</button>
        <div className="mt-3 space-y-2">
          {logs.map((l) => (
            <div key={l.id} className="rounded-lg border border-edge p-2 text-sm">{l.message}</div>
          ))}
        </div>
      </section>
    </div>
  )
}
