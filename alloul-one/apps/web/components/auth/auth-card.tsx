'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AuthCard() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function startPasswordless() {
    setMsg('Sending code...')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/auth/passwordless/start`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setMsg(res.ok ? 'Code sent (dev). Use any 6 digits.' : 'Failed')
  }

  async function verifyCode() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/auth/passwordless/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    const data = await res.json()
    if (data.accessToken) {
      document.cookie = `ao_token=${data.accessToken}; path=/; max-age=${60 * 60 * 24}`
      setMsg('Logged in.')
      router.push('/dashboard')
    } else setMsg('Invalid code')
  }

  async function startOidc(provider: 'google' | 'microsoft') {
    const mapped = provider === 'microsoft' ? 'azuread' : 'google'
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/auth/oidc/start?provider=${mapped}`)
    const data = await res.json()
    setMsg(`OIDC ready: ${data.provider}`)
  }

  return (
    <div className="glass neon-border mx-auto w-full max-w-md rounded-2xl border border-edge p-6">
      <h2 className="mb-2 text-xl font-semibold">Sign in to Alloul One</h2>
      <p className="mb-4 text-sm text-slate-400">OIDC / OAuth2 / Passwordless</p>
      <div className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Email" />
        <button onClick={startPasswordless} type="button" className="w-full rounded-lg bg-neon px-4 py-2">Send Code</button>
        <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Verification code" />
        <button onClick={verifyCode} type="button" className="w-full rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Verify & Login</button>
        <button onClick={() => startOidc('google')} type="button" className="w-full rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Continue with Google</button>
        <button onClick={() => startOidc('microsoft')} type="button" className="w-full rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Continue with Microsoft</button>
      </div>
      {msg ? <p className="mt-3 text-sm text-cyan">{msg}</p> : null}
    </div>
  )
}
