import { Brain, ChartLine, CircleUserRound, ListTodo, ShieldCheck } from 'lucide-react'

const cards = [
  { title: 'Public Feed', icon: ChartLine, value: '24.8k', sub: 'engagement index' },
  { title: 'Task System', icon: ListTodo, value: '148', sub: 'active tasks' },
  { title: 'Memory Threads', icon: Brain, value: '97', sub: 'knowledge links' },
  { title: 'Identity', icon: CircleUserRound, value: 'SAML + OIDC', sub: 'enterprise auth' },
]

export function FuturisticShell() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-7xl rounded-3xl glass neon-border p-6 md:p-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold md:text-2xl">Alloul One</h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 px-3 py-1 text-xs text-cyan">
            <ShieldCheck size={14} /> Enterprise Secure
          </span>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {cards.map(({ title, icon: Icon, value, sub }) => (
            <article key={title} className="glass rounded-2xl border border-edge p-4">
              <div className="mb-2 flex items-center justify-between text-slate-300">
                <span className="text-sm">{title}</span>
                <Icon size={16} />
              </div>
              <div className="text-2xl font-semibold text-white">{value}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-12">
          <article className="glass rounded-2xl border border-edge p-5 md:col-span-8">
            <h2 className="mb-3 text-sm text-slate-300">Unified Intelligence</h2>
            <p className="max-w-2xl text-2xl font-semibold leading-tight md:text-3xl">
              Unified Intelligence for Modern Enterprise + Institutional Memory
            </p>
            <div className="mt-5 flex gap-3">
              <button className="rounded-lg bg-neon px-4 py-2 text-sm font-medium">Request Demo</button>
              <button className="rounded-lg border border-cyan/40 px-4 py-2 text-sm text-cyan">Join for Free</button>
            </div>
          </article>

          <article className="glass rounded-2xl border border-edge p-5 md:col-span-4">
            <h3 className="text-sm text-slate-300">AI Core</h3>
            <div className="mt-3 rounded-xl border border-neon/50 p-4 text-center shadow-neon">
              <div className="mx-auto mb-2 size-16 rounded-full bg-gradient-to-br from-neon/60 to-cyan/50" />
              <p className="text-sm text-slate-200">Reasoning • Summarizer • Executor</p>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
