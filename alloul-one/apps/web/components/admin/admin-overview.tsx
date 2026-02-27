const stats = [
  ['Companies', '102,944'],
  ['Active Users', '1,284,220'],
  ['Abuse Flags', '18'],
  ['AI Jobs/min', '3,407'],
]

export function AdminOverview() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {stats.map(([k, v]) => (
        <article key={k} className="glass rounded-xl border border-edge p-4">
          <div className="text-xs text-slate-400">{k}</div>
          <div className="mt-1 text-xl font-semibold">{v}</div>
        </article>
      ))}
    </div>
  )
}
