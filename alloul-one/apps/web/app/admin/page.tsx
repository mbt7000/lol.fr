import { AppShell } from '@/components/layout/app-shell'
import { AdminOverview } from '@/components/admin/admin-overview'

export default function AdminPage() {
  return (
    <AppShell title="Super Admin Console">
      <AdminOverview />
    </AppShell>
  )
}
