'use client'

import { useState } from 'react'

export function ObservabilityConsole() {
  const [health, setHealth] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)

  async function load() {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'
    const h = await fetch(`${base}/observability/healthz`).then((r) => r.json())
    const m = await fetch(`${base}/observability/metrics`).then((r) => r.json())
    setHealth(h); setMetrics(m)
  }

  return <div className="glass rounded-xl border border-edge p-4"><h3 className="mb-2 font-semibold">Observability</h3><button onClick={load} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Load health/metrics</button><div className="mt-3 grid gap-3 md:grid-cols-2"><pre className="overflow-auto rounded-lg border border-edge bg-black/30 p-3 text-xs">{JSON.stringify(health,null,2)}</pre><pre className="overflow-auto rounded-lg border border-edge bg-black/30 p-3 text-xs">{JSON.stringify(metrics,null,2)}</pre></div></div>
}
