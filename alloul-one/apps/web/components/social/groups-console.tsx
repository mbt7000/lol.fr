'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function GroupsConsole() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [groups, setGroups] = useState<any[]>([])

  async function list() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/social/groups`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setGroups(await res.json())
  }

  async function create() {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/social/groups`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ name, description }),
    })
    setName('')
    setDescription('')
    list()
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Create Group</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="mb-2 min-h-20 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <div className="flex gap-2">
          <button onClick={create} className="rounded-lg bg-neon px-4 py-2">Create</button>
          <button onClick={list} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button>
        </div>
      </section>
      <section className="space-y-2">
        {groups.map((g) => (
          <article key={g.id} className="glass rounded-xl border border-edge p-3">
            <div className="font-medium">{g.name}</div>
            <div className="text-xs text-slate-400">{g.description}</div>
          </article>
        ))}
      </section>
    </div>
  )
}
