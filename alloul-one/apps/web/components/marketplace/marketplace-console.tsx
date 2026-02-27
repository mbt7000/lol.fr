'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function MarketplaceConsole() {
  const [ownerUserId, setOwnerUserId] = useState('user_demo')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('SERVICE')
  const [price, setPrice] = useState('100')
  const [listings, setListings] = useState<any[]>([])

  async function list() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/marketplace/listings`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setListings(await res.json())
  }

  async function create() {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/marketplace/listings`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ ownerUserId, type, title, description, price: Number(price), currency: 'USD' }),
    })
    list()
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Create Listing</h3>
        <input value={ownerUserId} onChange={(e) => setOwnerUserId(e.target.value)} className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="ownerUserId" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2">
          <option>SERVICE</option><option>JOB</option><option>REQUEST</option><option>PRODUCT</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2 min-h-20 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Description" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Price" />
        <div className="flex gap-2"><button onClick={create} className="rounded-lg bg-neon px-4 py-2">Create</button><button onClick={list} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button></div>
      </section>
      <section className="space-y-2">
        {listings.map((l) => (
          <article key={l.id} className="glass rounded-xl border border-edge p-3">
            <div className="font-medium">{l.title} · {l.type}</div>
            <div className="text-xs text-slate-400">{l.description}</div>
          </article>
        ))}
      </section>
    </div>
  )
}
