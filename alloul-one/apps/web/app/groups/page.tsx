import { AppShell } from '@/components/layout/app-shell'
import { GroupsConsole } from '@/components/social/groups-console'

export default function GroupsPage() {
  return (
    <AppShell title="Communities & Groups">
      <GroupsConsole />
    </AppShell>
  )
}
