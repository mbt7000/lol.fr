import { AppShell } from '@/components/layout/app-shell'
import { ProfileConsole } from '@/components/social/profile-console'

export default function ProfilePage() {
  return (
    <AppShell title="Profile">
      <ProfileConsole />
    </AppShell>
  )
}
