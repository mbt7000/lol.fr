'use client'

import { useState } from 'react'

function cookie(name: string) { return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1] }

export function BillingConsole() {
  const [orgId, setOrgId] = useState('')
  const [tier, setTier] = useState('PRO')
  const [subs, setSubs] = useState<any[]>([])

  async function list() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/billing/subscriptions?orgId=${orgId}`, { headers: { authorization: token ? `Bearer ${token}` : '' } })
    setSubs(await res.json())
  }

  async function create() {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/billing/subscriptions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ orgId, tier, seats: 5, aiCredits: 1000 }),
    })
    list()
  }

  return <div className="grid gap-4 md:grid-cols-2"><section className="glass rounded-xl border border-edge p-4"><h3 className="mb-2 font-semibold">Billing</h3><input value={orgId} onChange={(e)=>setOrgId(e.target.value)} placeholder="orgId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" /><select value={tier} onChange={(e)=>setTier(e.target.value)} className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2"><option>FREE</option><option>PRO</option><option>BUSINESS</option><option>ENTERPRISE</option></select><div className="flex gap-2"><button onClick={create} className="rounded-lg bg-neon px-4 py-2">Create Subscription</button><button onClick={list} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button></div></section><section className="space-y-2">{subs.map((s)=><article key={s.id} className="glass rounded-xl border border-edge p-3"><div className="font-medium">{s.tier}</div><div className="text-xs text-slate-400">Seats: {s.seats} · AI: {s.aiCredits}</div></article>)}</section></div>
}
