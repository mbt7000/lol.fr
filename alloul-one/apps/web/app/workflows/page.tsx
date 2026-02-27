import { AppShell } from '@/components/layout/app-shell'
import { WorkflowsConsole } from '@/components/workflows/workflows-console'

export default function WorkflowsPage() {
  return (
    <AppShell title="Workflow Engine">
      <WorkflowsConsole />
    </AppShell>
  )
}
