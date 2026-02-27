import { AppShell } from '@/components/layout/app-shell'
import { ObservabilityConsole } from '@/components/observability/observability-console'

export default function ObservabilityPage() {
  return <AppShell title="Observability"><ObservabilityConsole /></AppShell>
}
