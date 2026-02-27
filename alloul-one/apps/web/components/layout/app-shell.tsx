import { LanguageSwitcher } from '../i18n/language-switcher'
import { Sidebar } from './sidebar'

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[256px_1fr]">
        <Sidebar />
        <section className="glass neon-border rounded-2xl border border-edge p-4 md:p-6">
          <header className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <span className="rounded-full border border-cyan/30 px-3 py-1 text-xs text-cyan">Enterprise</span>
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  )
}
