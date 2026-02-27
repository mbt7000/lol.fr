'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function HandoverConsole() {
  const [orgId, setOrgId] = useState('')
  const [ownerUserId, setOwnerUserId] = useState('user_demo')
  const [checklistText, setChecklistText] = useState('handover docs\ntransfer ownership\nrisk review')
  const [risksText, setRisksText] = useState('pending credentials rotation')
  const [handovers, setHandovers] = useState<any[]>([])
  const [report, setReport] = useState<any>(null)

  async function list() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/handover`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setHandovers(await res.json())
  }

  async function create() {
    const token = cookie('ao_token')
    const checklist = checklistText.split('\n').map((x) => x.trim()).filter(Boolean)
    const risks = risksText.split('\n').map((x) => x.trim()).filter(Boolean)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/handover`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ ownerUserId, checklist, risks }),
    })
    list()
  }

  async function toggle(handoverId: string, itemId: string, isDone: boolean) {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/handover/${handoverId}/checklist/${itemId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ isDone: !isDone }),
    })
    list()
  }

  async function generateReport(handoverId: string) {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/handover/${handoverId}/report`, {
      method: 'POST',
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setReport(await res.json())
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Create Handover</h3>
        <input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="orgId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <input value={ownerUserId} onChange={(e) => setOwnerUserId(e.target.value)} placeholder="ownerUserId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <textarea value={checklistText} onChange={(e) => setChecklistText(e.target.value)} className="mb-2 min-h-24 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="one item per line" />
        <textarea value={risksText} onChange={(e) => setRisksText(e.target.value)} className="mb-2 min-h-20 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="risk per line" />
        <div className="flex gap-2">
          <button onClick={create} className="rounded-lg bg-neon px-4 py-2">Create</button>
          <button onClick={list} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button>
        </div>
      </section>

      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Handover Runs</h3>
        <div className="space-y-3">
          {handovers.map((h) => (
            <article key={h.id} className="rounded-lg border border-edge p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{h.ownerUserId}</span>
                <span className="text-cyan">Score: {h.score ?? 0}</span>
              </div>
              <div className="space-y-1">
                {(h.checklist || []).map((item: any) => (
                  <button key={item.id} onClick={() => toggle(h.id, item.id, item.isDone)} className="block w-full rounded border border-edge px-2 py-1 text-left text-xs hover:bg-white/5">
                    {item.isDone ? '✅' : '⬜'} {item.title}
                  </button>
                ))}
              </div>
              <button onClick={() => generateReport(h.id)} className="mt-2 rounded border border-cyan/40 px-2 py-1 text-xs text-cyan">Generate Report</button>
            </article>
          ))}
        </div>
      </section>

      {report ? (
        <section className="glass rounded-xl border border-edge p-4 md:col-span-2">
          <h3 className="mb-2 font-semibold">Generated Report</h3>
          <pre className="overflow-auto rounded-lg border border-edge bg-black/30 p-3 text-xs">{JSON.stringify(report, null, 2)}</pre>
        </section>
      ) : null}
    </div>
  )
}
