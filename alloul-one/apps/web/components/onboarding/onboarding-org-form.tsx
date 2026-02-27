'use client'

import { useState } from 'react'

export function OnboardingOrgForm() {
  const [status, setStatus] = useState('')

  async function submit(formData: FormData) {
    setStatus('Saving...')
    const payload = {
      name: String(formData.get('name') || ''),
      slug: String(formData.get('slug') || ''),
      locale: String(formData.get('locale') || 'en'),
      timezone: String(formData.get('timezone') || 'UTC'),
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-permissions': 'org.write',
        },
        body: JSON.stringify(payload),
      })
      setStatus(res.ok ? 'Organization created.' : 'Failed to create org')
    } catch {
      setStatus('API offline. Start apps/api first.')
    }
  }

  return (
    <form action={submit} className="grid gap-3 md:grid-cols-2">
      <input name="name" className="rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Organization name" />
      <input name="slug" className="rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Slug" />
      <select name="locale" className="rounded-lg border border-edge bg-black/20 px-3 py-2">
        <option value="ar">Arabic (ar)</option>
        <option value="en">English (en)</option>
        <option value="zh">Chinese (zh)</option>
        <option value="ko">Korean (ko)</option>
      </select>
      <select name="timezone" className="rounded-lg border border-edge bg-black/20 px-3 py-2">
        <option value="UTC">UTC</option>
        <option value="Asia/Riyadh">Asia/Riyadh</option>
      </select>
      <button className="rounded-lg bg-neon px-4 py-2 md:col-span-2">Create Organization</button>
      {status ? <p className="text-sm text-cyan md:col-span-2">{status}</p> : null}
    </form>
  )
}
