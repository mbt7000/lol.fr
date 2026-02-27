import { AppShell } from '@/components/layout/app-shell'
import { HandoverConsole } from '@/components/handover/handover-console'

export default function HandoverPage() {
  return (
    <AppShell title="Handover Studio">
      <HandoverConsole />
    </AppShell>
  )
}
