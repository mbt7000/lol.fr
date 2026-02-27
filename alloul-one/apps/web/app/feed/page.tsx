import { AppShell } from '@/components/layout/app-shell'
import { FeedConsole } from '@/components/social/feed-console'

export default function FeedPage() {
  return (
    <AppShell title="Public Feed">
      <FeedConsole />
    </AppShell>
  )
}
