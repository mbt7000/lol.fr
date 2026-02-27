'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function ProfileConsole() {
  const [userId, setUserId] = useState('')
  const [profile, setProfile] = useState<any>(null)

  async function load() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/social/profiles/${userId}`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setProfile(await res.json())
  }

  return (
    <div className="glass rounded-xl border border-edge p-4">
      <h3 className="mb-2 font-semibold">Profile</h3>
      <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="userId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
      <button onClick={load} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Load</button>
      {profile ? <pre className="mt-3 overflow-auto rounded-lg border border-edge bg-black/30 p-3 text-xs">{JSON.stringify(profile, null, 2)}</pre> : null}
    </div>
  )
}
