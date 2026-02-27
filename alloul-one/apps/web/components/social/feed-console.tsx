'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function FeedConsole() {
  const [authorId, setAuthorId] = useState('user_demo')
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<any[]>([])

  async function list() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/feed/posts`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setPosts(await res.json())
  }

  async function create() {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/feed/posts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ authorId, content, visibility: 'PUBLIC' }),
    })
    setContent('')
    list()
  }

  async function react(postId: string) {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/feed/posts/${postId}/reactions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ userId: authorId, type: 'like' }),
    })
    list()
  }

  return (
    <div className="grid gap-4">
      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Create Post</h3>
        <input value={authorId} onChange={(e) => setAuthorId(e.target.value)} className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="authorId" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="mb-2 min-h-20 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Write something..." />
        <div className="flex gap-2">
          <button onClick={create} className="rounded-lg bg-neon px-4 py-2">Post</button>
          <button onClick={list} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button>
        </div>
      </section>

      <section className="space-y-2">
        {posts.map((p) => (
          <article key={p.id} className="glass rounded-xl border border-edge p-4">
            <p className="mb-2 text-sm text-slate-200">{p.content}</p>
            <button onClick={() => react(p.id)} className="rounded border border-cyan/40 px-2 py-1 text-xs text-cyan">Like</button>
          </article>
        ))}
      </section>
    </div>
  )
}
