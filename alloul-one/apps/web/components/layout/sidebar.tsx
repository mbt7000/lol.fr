import { Brain, Building2, CreditCard, FolderKanban, Home, Settings, Users } from 'lucide-react'
import Link from 'next/link'

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/onboarding', label: 'Organizations', icon: Building2 },
  { href: '/dashboard', label: 'Projects', icon: FolderKanban },
  { href: '/admin', label: 'Admin', icon: Users },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/ai', label: 'AI Core', icon: Brain },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="glass neon-border w-full rounded-2xl border border-edge p-3 md:w-64">
      <div className="mb-4 px-2 text-sm font-semibold text-cyan">Alloul One</div>
      <nav className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href + label} href={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
            <Icon size={16} /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
